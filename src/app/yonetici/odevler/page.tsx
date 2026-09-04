'use client';

import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, collectionGroup, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, where } from 'firebase/firestore';
import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Gamepad2, Search, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import topicsDataJson from '@/data/topics.json';
import { CHEST_DATA } from '@/data/turkce-hazinem-data';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const chestTopics = CHEST_DATA.map(chest => ({
  id: chest.id,
  name: chest.title,
  icon: '🏴‍☠️'
}));

const storyTopics = [
  { id: 'sari-top', name: 'Sarı Top', icon: '📖' },
  { id: 'bir-iki-uc-basardim', name: 'Bir İki Üç Başardım!', icon: '📖' },
  { id: 'kaptan-kahvaltisi', name: 'Kaptan Kahvaltısı', icon: '📖' },
  { id: 'gokusagi-partisi', name: 'Gökkuşağı Partisi', icon: '📖' },
];

const islandTopics = topicsDataJson;

interface Student {
    id: string;
    parentId: string;
    firstName: string;
    lastName: string;
    parentName: string;
}

export default function AdminHomeworksPage() {
    const db = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'adalar' | 'hikayeler' | 'turkce-hazinem'>('adalar');
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [isFetchingStudents, setIsFetchingStudents] = useState(false);

    // Fetch Homeworks
    const hwQuery = useMemoFirebase(() => {
        if (!db) return null;
        return query(collection(db, 'game-homeworks'), orderBy('assignedAt', 'desc'));
    }, [db]);
    const { data: homeworks, isLoading } = useCollection(hwQuery);

    const activeTopics = useMemo(() => {
        if (selectedCategory === 'adalar') return islandTopics;
        if (selectedCategory === 'hikayeler') return storyTopics;
        return chestTopics;
    }, [selectedCategory]);

    const openAssignModal = async () => {
        setIsAssignModalOpen(true);
        if (students.length === 0 && db) {
            setIsFetchingStudents(true);
            try {
                const childrenQuery = query(collectionGroup(db, 'children'));
                const querySnapshot = await getDocs(childrenQuery);
                const studentList = await Promise.all(querySnapshot.docs.map(async (childDoc) => {
                    const data = childDoc.data();
                    const parentId = childDoc.ref.parent.parent?.id || '';
                    return {
                        id: childDoc.id,
                        parentId,
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        parentName: 'Veli'
                    };
                }));
                setStudents(studentList.filter(s => s.firstName));
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetchingStudents(false);
            }
        }
    };

    const handleAssign = async () => {
        if (!selectedStudentId || !selectedTopicId || !db || !user) {
            toast({ title: 'Eksik Alan', description: 'Lütfen öğrenci ve ada seçin.', variant: 'destructive' });
            return;
        }

        setIsAssigning(true);
        try {
            const student = students.find(s => s.id === selectedStudentId);
            const topic = activeTopics.find(t => t.id === selectedTopicId);
            
            if (!student || !topic) throw new Error('Student or topic not found');

            let categoryLabel = 'Oyun Adası';
            if (selectedCategory === 'hikayeler') categoryLabel = 'Hikaye';
            if (selectedCategory === 'turkce-hazinem') categoryLabel = 'Hazine';

            // Check if there is already an active homework for this category
            const hwQuery = query(
                collection(db, 'game-homeworks'),
                where('childId', '==', student.id)
            );
            const activeSnap = await getDocs(hwQuery);
            const hasActive = activeSnap.docs.some(doc => {
                const d = doc.data();
                return d.status === 'assigned' && d.category === categoryLabel;
            });
            
            if (hasActive) {
                toast({ 
                    title: 'Uyarı', 
                    description: `Bu öğrencinin zaten devam eden bir "${categoryLabel}" ödevi var. Lütfen önce onun tamamlanmasını bekleyin veya ödevi silin.`, 
                    variant: 'destructive' 
                });
                setIsAssigning(false);
                return;
            }

            // 1. Assign in activeHomeworkTopic on child doc
            const childRef = doc(db, 'users', student.parentId, 'children', student.id);
            await updateDoc(childRef, {
                activeHomeworkTopic: topic.id,
                activeHomeworkTopics: arrayUnion(topic.id)
            });

            // 2. Add to game-homeworks collection
            await addDoc(collection(db, 'game-homeworks'), {
                teacherId: user.uid,
                teacherName: 'Sistem Yöneticisi',
                parentId: student.parentId,
                childId: student.id,
                childName: `${student.firstName} ${student.lastName}`,
                topicId: topic.id,
                topicName: topic.name,
                category: categoryLabel,
                status: 'assigned',
                assignedAt: serverTimestamp(),
                completedAt: null
            });

            toast({ title: 'Başarılı', description: 'Ödev başarıyla atandı.' });
            setIsAssignModalOpen(false);
            setSelectedStudentId('');
            setSelectedTopicId('');
        } catch (error) {
            console.error(error);
            toast({ title: 'Hata', description: 'Ödev atanırken bir hata oluştu.', variant: 'destructive' });
        } finally {
            setIsAssigning(false);
        }
    };

    const handleDelete = async (hwId: string, childId: string, parentId: string, status: string, topicId: string) => {
        if (!db) return;
        if (confirm('Bu ödev kaydını silmek istediğinize emin misiniz?')) {
            try {
                await deleteDoc(doc(db, 'game-homeworks', hwId));
                // If it was still assigned, remove it from the child so they don't see it anymore
                if (status === 'assigned') {
                    const childRef = doc(db, 'users', parentId, 'children', childId);
                    await updateDoc(childRef, { activeHomeworkTopic: null, activeHomeworkTopics: arrayRemove(topicId) }).catch(() => {});
                }
                toast({ title: 'Başarılı', description: 'Ödev kaydı silindi.' });
            } catch (err) {
                toast({ title: 'Hata', description: 'Silinemedi.', variant: 'destructive' });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Oyun Ödevleri</h2>
                    <p className="text-muted-foreground mt-1">Öğrencilere atanan ada ödevlerini takip edin.</p>
                </div>
                <Button onClick={openAssignModal} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4" /> Yeni Ödev Ata
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-indigo-500" /> Ödev Geçmişi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Öğrenci</TableHead>
                                        <TableHead>Oyun / Görev</TableHead>
                                        <TableHead>Atayan (Öğretmen)</TableHead>
                                        <TableHead>Veriliş Tarihi</TableHead>
                                        <TableHead>Durum</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {homeworks?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">Kayıt bulunamadı.</TableCell>
                                        </TableRow>
                                    ) : (
                                        homeworks?.map((hw: any) => (
                                            <TableRow key={hw.id}>
                                                <TableCell className="font-medium">{hw.childName}</TableCell>
                                                <TableCell>
                                                    {hw.topicName} {hw.category ? <span className="text-muted-foreground text-sm">({hw.category})</span> : null}
                                                </TableCell>
                                                <TableCell>{hw.teacherName}</TableCell>
                                                <TableCell>
                                                    {hw.assignedAt ? format(hw.assignedAt.toDate(), 'dd MMM yyyy, HH:mm', { locale: tr }) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {hw.status === 'assigned' ? (
                                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Devam Ediyor</Badge>
                                                    ) : (
                                                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Tamamlandı</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(hw.id, hw.childId, hw.parentId, hw.status, hw.topicId)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yeni Oyun Ödevi Ata</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Öğrenci Seç</label>
                            {isFetchingStudents ? (
                                <div className="h-10 border rounded-md flex items-center justify-center text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Yükleniyor...</div>
                            ) : (
                                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Öğrenci seçin..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-64">
                                        {students.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ödev Türü</label>
                            <Select value={selectedCategory} onValueChange={(val: 'adalar' | 'hikayeler' | 'turkce-hazinem') => {
                                setSelectedCategory(val);
                                setSelectedTopicId('');
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tür seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="adalar">Macera Haritası (Adalar)</SelectItem>
                                    <SelectItem value="hikayeler">Hikayeler</SelectItem>
                                    <SelectItem value="turkce-hazinem">Türkçe Hazinem</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Görev Seç</label>
                            <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Görev seçin..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {activeTopics.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name} {t.icon}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>İptal</Button>
                        <Button onClick={handleAssign} disabled={isAssigning || !selectedStudentId || !selectedTopicId} className="bg-indigo-600 hover:bg-indigo-700">
                            {isAssigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Ödevi Ata
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
