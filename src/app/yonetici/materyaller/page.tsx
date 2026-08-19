'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, Upload, FileText, Video, Link as LinkIcon, File, Folder, FolderPlus, ChevronRight, Home, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function MateryallerPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  // States
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  
  // Drag & Drop to Folders State
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  
  // Single link states
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Fetch all materials
  const materialsQuery = useMemoFirebase(() => 
    db ? query(collection(db, 'materials'), orderBy('createdAt', 'desc')) : null, [db]);
    
  const { data: allMaterials, isLoading } = useCollection(materialsQuery);

  // Derived state for Folders and Breadcrumbs
  const breadcrumbPath = useMemo(() => {
      const path: any[] = [];
      let currentId = currentFolderId;
      while (currentId) {
          const folder = allMaterials?.find(m => m.id === currentId && m.type === 'folder');
          if (folder) {
              path.unshift(folder);
              currentId = folder.parentId || null;
          } else {
              break; // Safeguard
          }
      }
      return path;
  }, [currentFolderId, allMaterials]);

  const currentLevelItems = useMemo(() => {
      if (!allMaterials) return { folders: [], files: [] };
      const items = allMaterials.filter(m => (m.parentId || null) === currentFolderId);
      
      const folders = items.filter(m => m.type === 'folder').sort((a, b) => (a.title || '').localeCompare(b.title || '', 'tr'));
      const files = items.filter(m => m.type !== 'folder').sort((a, b) => (a.title || '').localeCompare(b.title || '', 'tr'));
      
      return { folders, files };
  }, [allMaterials, currentFolderId]);

  // Drag & Drop Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          await processFiles(Array.from(e.dataTransfer.files));
      }
  }, [db, currentFolderId]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          await processFiles(Array.from(e.target.files));
          e.target.value = ''; // reset
      }
  };

  const processFiles = async (files: File[]) => {
      if (!db) return;
      setIsUploading(true);
      setUploadProgress(0);
      
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadStatusText(`${files.length} dosyadan ${i + 1}. yükleniyor: ${file.name}`);
          
          try {
              const fileExtIndex = file.name.lastIndexOf('.');
              const title = fileExtIndex > 0 ? file.name.substring(0, fileExtIndex) : file.name;
              
              let type = 'document';
              if (file.type.startsWith('video/')) type = 'video';
              else if (file.type.startsWith('image/')) type = 'document'; // can be 'image' but keeping simple

              const fileName = `${Date.now()}_${file.name}`;
              const storageRef = ref(storage, `materials/${fileName}`);
              const uploadTask = uploadBytesResumable(storageRef, file);

              const finalUrl = await new Promise<string>((resolve, reject) => {
                  uploadTask.on('state_changed', 
                      (snapshot) => {
                          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                          // Overall progress calculation
                          const overall = ((i * 100) + progress) / files.length;
                          setUploadProgress(overall);
                      },
                      (error) => reject(error),
                      async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
                  );
              });

              await addDoc(collection(db, 'materials'), {
                  title,
                  type,
                  url: finalUrl,
                  fileName,
                  parentId: currentFolderId || null,
                  createdAt: serverTimestamp()
              });
              
              successCount++;
          } catch (err) {
              console.error("File upload failed:", file.name, err);
              failCount++;
          }
      }

      setIsUploading(false);
      if (failCount === 0) {
          toast({ title: 'Başarılı', description: `${successCount} materyal başarıyla yüklendi.` });
      } else {
          toast({ variant: 'destructive', title: 'Tamamlandı (Hatalı)', description: `${successCount} yüklendi, ${failCount} yüklenemedi.` });
      }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!db || !newFolderName.trim()) return;

      try {
          await addDoc(collection(db, 'materials'), {
              title: newFolderName.trim(),
              type: 'folder',
              parentId: currentFolderId || null,
              createdAt: serverTimestamp()
          });
          toast({ title: 'Klasör Oluşturuldu' });
          setNewFolderName('');
          setIsCreateFolderOpen(false);
      } catch (error) {
          toast({ variant: 'destructive', title: 'Hata', description: 'Klasör oluşturulamadı.' });
      }
  };

  const handleAddLink = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!db || !linkTitle.trim() || !linkUrl.trim()) return;

      try {
          await addDoc(collection(db, 'materials'), {
              title: linkTitle.trim(),
              type: 'link',
              url: linkUrl.trim(),
              parentId: currentFolderId || null,
              createdAt: serverTimestamp()
          });
          toast({ title: 'Bağlantı Eklendi' });
          setLinkTitle('');
          setLinkUrl('');
          setIsAddingLink(false);
      } catch (error) {
          toast({ variant: 'destructive', title: 'Hata', description: 'Bağlantı eklenemedi.' });
      }
  };

  const handleDelete = async (materialId: string, fileName?: string | null, type?: string) => {
      if (!db) return;
      
      const confirmText = type === 'folder' 
        ? 'Bu klasörü silmek istediğinize emin misiniz? (İçindeki dosyalar silinmeyebilir)' 
        : 'Bu materyali silmek istediğinize emin misiniz?';
        
      if (!confirm(confirmText)) return;
      
      try {
          if (fileName) {
              const storageRef = ref(storage, `materials/${fileName}`);
              await deleteObject(storageRef).catch(err => console.log('Dosya bulunamadı', err));
          }
          await deleteDoc(doc(db, 'materials', materialId));
          toast({ title: 'Silindi', description: 'Başarıyla silindi.' });
      } catch (error) {
          toast({ variant: 'destructive', title: 'Hata', description: 'Silinemedi.' });
      }
  };

  const handleMoveToFolder = async (materialId: string, targetFolderId: string) => {
      if (!db || materialId === targetFolderId) return;
      try {
          await updateDoc(doc(db, 'materials', materialId), {
              parentId: targetFolderId
          });
          toast({ title: 'Taşındı', description: 'Dosya klasöre taşındı.' });
      } catch (error) {
          toast({ variant: 'destructive', title: 'Hata', description: 'Taşıma başarısız oldu.' });
      }
  };

  const getIconForType = (t: string) => {
      switch(t) {
          case 'folder': return <Folder className="w-8 h-8 text-blue-500 fill-blue-100" />;
          case 'document': return <FileText className="w-6 h-6 text-emerald-500" />;
          case 'video': return <Video className="w-6 h-6 text-red-500" />;
          case 'link': return <LinkIcon className="w-6 h-6 text-amber-500" />;
          default: return <File className="w-6 h-6 text-slate-500" />;
      }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
             <FileText className="w-8 h-8 text-primary" /> Eğitim Materyalleri
          </h2>
          <p className="text-slate-500 font-medium">Sürükle-bırak ile toplu materyal yükleyin ve klasörleyerek yönetin.</p>
        </div>
      </div>

      {/* Upload Zone */}
      {!isAddingLink && (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300",
                isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-300 bg-slate-50 hover:bg-slate-100",
                isUploading && "pointer-events-none opacity-80"
            )}
          >
              {isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <div className="space-y-2 w-full max-w-md">
                          <p className="text-lg font-bold text-slate-700">{uploadStatusText}</p>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <p className="text-sm font-medium text-slate-500">% {Math.round(uploadProgress)} tamamlandı</p>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-white p-4 rounded-full shadow-sm">
                          <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800">Dosyaları Buraya Sürükleyin</h3>
                          <p className="text-slate-500 mt-1 mb-4">veya bilgisayarınızdan seçin (Birden fazla seçebilirsiniz)</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                              <Label htmlFor="file-upload" className="cursor-pointer bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                                  Dosyaları Seç
                              </Label>
                              <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileInput} />
                              
                              <Button variant="outline" className="rounded-xl font-bold px-6 py-2.5 h-auto text-slate-600" onClick={() => setIsAddingLink(true)}>
                                  <LinkIcon className="w-4 h-4 mr-2" /> Dış Bağlantı (Link) Ekle
                              </Button>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
                          <AlertCircle className="w-4 h-4" /> 
                          Dosya isimleri otomatik olarak materyal başlığına dönüştürülecektir.
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Link Add Form */}
      {isAddingLink && (
          <Card className="border-2 border-primary/20 shadow-sm rounded-3xl overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
                  <h3 className="font-bold text-primary flex items-center gap-2"><LinkIcon className="w-5 h-5" /> Dış Bağlantı Ekle</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddingLink(false)} className="rounded-full hover:bg-primary/10 text-slate-500">
                      <X className="w-5 h-5" />
                  </Button>
              </div>
              <CardContent className="p-6">
                  <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row items-end gap-4">
                      <div className="space-y-2 flex-1">
                          <Label>Bağlantı Başlığı</Label>
                          <Input placeholder="Örn: 1. Ünite Video Anlatımı" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} required className="rounded-xl h-11" />
                      </div>
                      <div className="space-y-2 flex-[2]">
                          <Label>Bağlantı Adresi (URL)</Label>
                          <Input type="url" placeholder="https://" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} required className="rounded-xl h-11" />
                      </div>
                      <Button type="submit" className="h-11 px-8 rounded-xl font-bold w-full sm:w-auto">Ekle</Button>
                  </form>
              </CardContent>
          </Card>
      )}

      {/* Main Content Area */}
      <Card className="rounded-3xl border-none shadow-lg overflow-hidden bg-white/50 backdrop-blur-sm">
         <CardHeader className="border-b bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-sm font-bold overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                 <button 
                    onClick={() => setCurrentFolderId(null)}
                    className={cn("flex items-center gap-1.5 transition-colors", !currentFolderId ? "text-primary" : "text-slate-400 hover:text-slate-700")}
                 >
                     <Home className="w-4 h-4" /> Ana Dizin
                 </button>
                 
                 {breadcrumbPath.map((folder, idx) => (
                     <React.Fragment key={folder.id}>
                         <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                         <button 
                            onClick={() => setCurrentFolderId(folder.id)}
                            className={cn("truncate max-w-[120px] transition-colors", idx === breadcrumbPath.length - 1 ? "text-primary" : "text-slate-400 hover:text-slate-700")}
                         >
                             {folder.title}
                         </button>
                     </React.Fragment>
                 ))}
             </div>
             
             <Button variant="outline" className="rounded-xl font-bold shadow-sm h-10 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 shrink-0" onClick={() => setIsCreateFolderOpen(true)}>
                 <FolderPlus className="w-4 h-4 mr-2" /> Yeni Klasör
             </Button>
         </CardHeader>
         
         <CardContent className="p-6 bg-slate-50/50 min-h-[400px]">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-primary" />
                    <p className="text-slate-500 font-medium">İçerikler yükleniyor...</p>
                </div>
            ) : currentLevelItems.folders.length === 0 && currentLevelItems.files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                        <Folder className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Bu Dizin Boş</h3>
                    <p className="text-slate-500">Klasör oluşturarak veya dosya sürükleyerek içerik ekleyin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    
                    {/* Folders */}
                    {currentLevelItems.folders.map(folder => (
                        <div 
                          key={folder.id} 
                          className={cn(
                              "group bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-[140px]",
                              dragOverFolderId === folder.id ? "border-primary bg-primary/10 scale-105" : "border-slate-200 hover:border-blue-300"
                          )}
                          onClick={() => setCurrentFolderId(folder.id)}
                          onDragOver={(e) => {
                              e.preventDefault(); // Necessary to allow dropping
                              setDragOverFolderId(folder.id);
                          }}
                          onDragLeave={(e) => {
                              e.preventDefault();
                              setDragOverFolderId(null);
                          }}
                          onDrop={(e) => {
                              e.preventDefault();
                              setDragOverFolderId(null);
                              const materialId = e.dataTransfer.getData('text/plain');
                              if (materialId) handleMoveToFolder(materialId, folder.id);
                          }}
                        >
                            <div className="flex items-start justify-between">
                                {getIconForType(folder.type)}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2 transition-all" onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, null, 'folder'); }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 line-clamp-2 mt-3">{folder.title}</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium">{folder.createdAt ? format(folder.createdAt.toDate(), 'dd.MM.yyyy') : 'Yeni'}</p>
                            </div>
                        </div>
                    ))}

                    {/* Files */}
                    {currentLevelItems.files.map(file => (
                        <div 
                          key={file.id} 
                          draggable
                          onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', file.id);
                              // Optional visual change when dragging
                              if (e.dataTransfer.setDragImage) {
                                  // Standard behaviour is fine
                              }
                          }}
                          className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between h-[140px] cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex items-start justify-between">
                                <div className="bg-slate-50 p-2.5 rounded-xl">
                                    {getIconForType(file.type)}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -mr-2 -mt-2">
                                    {file.url && (
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                            <LinkIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" onClick={() => handleDelete(file.id, file.fileName, file.type)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <h3 className="font-bold text-slate-800 line-clamp-2 text-sm" title={file.title}>{file.title}</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">{file.type === 'document' ? 'Döküman' : file.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </CardContent>
      </Card>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogContent className="sm:max-w-md rounded-[24px]">
              <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Yeni Klasör Oluştur</DialogTitle>
                  <DialogDescription>Mevcut dizinde yeni bir klasör oluşturun.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateFolder}>
                  <div className="py-6">
                      <Label htmlFor="folderName" className="text-sm font-bold text-slate-700">Klasör Adı</Label>
                      <Input 
                        id="folderName" 
                        value={newFolderName} 
                        onChange={(e) => setNewFolderName(e.target.value)} 
                        placeholder="Örn: 1. Dönem Konu Anlatımları" 
                        className="mt-2 rounded-xl h-11"
                        autoFocus
                      />
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="outline" className="rounded-xl font-bold" onClick={() => setIsCreateFolderOpen(false)}>İptal</Button>
                      <Button type="submit" className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">Oluştur</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>

    </div>
  );
}
