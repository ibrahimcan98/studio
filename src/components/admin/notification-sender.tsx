'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Bell, Mail, Smartphone, Search, X, Check, Globe, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const REDIRECT_OPTIONS = [
  { label: 'Ana Sayfa (Dashboard)', value: '/ebeveyn-portali' },
  { label: 'Ders Planla', value: '/ebeveyn-portali/ders-planla' },
  { label: 'Kurslarım (Bakiyeler)', value: '/ebeveyn-portali/paketlerim' },
  { label: 'Derslerim (Takvim)', value: '/ebeveyn-portali/dersler' },
  { label: 'Yeni Kurs Al (Market)', value: '/kurslar' },
  { label: 'Özel URL', value: 'custom' },
];

export function NotificationSender() {
  const db = useFirestore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [channels, setChannels] = useState<string[]>(['push']);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [redirectType, setRedirectType] = useState('/ebeveyn-portali');
  const [customLink, setCustomLink] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [parentSearch, setParentSearch] = useState('');
  const [expiresAt, setExpiresAt] = useState<string>('never');
  const [customExpiryDate, setCustomExpiryDate] = useState<string>('');

  // Fetch parents for targeting
  const parentsQuery = useMemoFirebase(() => db ? query(collection(db, 'users'), where('role', '==', 'parent')) : null, [db]);
  const { data: parents } = useCollection(parentsQuery);

  const filteredParents = useMemo(() => {
    if (!parents) return [];
    if (!parentSearch) return parents;
    const q = parentSearch.toLowerCase();
    return parents.filter((p: any) => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || 
      p.email?.toLowerCase().includes(q)
    );
  }, [parents, parentSearch]);

  const toggleUser = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!title || !body) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen başlık ve mesaj girin.' });
      return;
    }

    if (channels.length === 0) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen en az bir gönderim kanalı seçin.' });
      return;
    }

    if (target === 'selected_parents' && selectedUserIds.length === 0) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen en az bir veli seçin.' });
      return;
    }

    if (expiresAt === 'custom' && !customExpiryDate) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen bir gecerlilik tarihi seçin.' });
      return;
    }

    const redirectPath = redirectType === 'custom' ? customLink : redirectType;

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          body, 
          target, 
          channels, 
          selectedUserIds, 
          redirectPath,
          expiresAt: expiresAt === 'never' ? null : expiresAt === 'custom' ? customExpiryDate : expiresAt
        }),
      });

      const result = await response.json();

      if (response.ok) {
        let msg = '';
        if (result.results.push.successCount > 0) msg += `${result.results.push.successCount} Bildirim `;
        if (result.results.email.successCount > 0) msg += (msg ? 've ' : '') + `${result.results.email.successCount} E-posta `;
        msg += 'başarıyla gönderildi ve sisteme kaydedildi.';

        toast({
          title: 'Başarılı',
          description: msg,
          className: 'bg-green-500 text-white',
        });
        setTitle('');
        setBody('');
        setSelectedUserIds([]);
        setCustomLink('');
      } else {
        throw new Error(result.error || 'Bildirim gönderilemedi.');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Hata', description: error.message });
    } finally {
      setIsSending(false);
    }
  };

  const toggleChannel = (channel: string) => {
    setChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  return (
    <Card className="border-none shadow-xl overflow-hidden bg-white rounded-3xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5 pb-8 p-8">
        <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2.5 rounded-2xl shadow-lg shadow-primary/20">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Yeni Bildirim Oluştur</CardTitle>
              <CardDescription className="text-slate-500 font-medium mt-1">
                Velilerinize veya öğretmenlerinize anlık mesaj ve e-posta gönderin.
              </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Audience Selection */}
            <div className="space-y-3">
              <Label htmlFor="target" className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">1. Hedef Kitle</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger id="target" className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors">
                  <SelectValue placeholder="Hedef seçin" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-xl">
                  <SelectItem value="all">Herkes (Tüm Kullanıcılar)</SelectItem>
                  <SelectItem value="parents">Sadece Veliler</SelectItem>
                  <SelectItem value="teachers">Sadece Öğretmenler</SelectItem>
                  <SelectItem value="selected_parents">Belirli Velileri Seç</SelectItem>
                </SelectContent>
              </Select>

              {/* Selected Parents Selector */}
              {target === 'selected_parents' && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-12 justify-between rounded-2xl border-slate-200 font-bold overflow-hidden text-slate-600 hover:border-primary transition-all">
                        <div className="flex items-center gap-2 truncate">
                          <Search className="h-4 w-4 text-slate-400" />
                          {selectedUserIds.length > 0 
                            ? `${selectedUserIds.length} veli seçildi` 
                            : 'Veli Ara ve Seç...'}
                        </div>
                        <Badge className="bg-primary text-white ml-2 rounded-lg">
                          {selectedUserIds.length}
                        </Badge>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0 rounded-2xl shadow-2xl border-none" align="start">
                      <div className="p-3 border-b bg-slate-50/50">
                        <Input 
                          placeholder="İsim veya e-posta ile ara..." 
                          value={parentSearch}
                          onChange={(e) => setParentSearch(e.target.value)}
                          className="h-10 border-slate-200 focus-visible:ring-primary rounded-xl"
                        />
                      </div>
                      <ScrollArea className="h-[280px]">
                        <div className="p-2">
                          {filteredParents.map((p: any) => (
                            <div 
                              key={p.id}
                              onClick={() => toggleUser(p.id)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-primary/5 transition-all group mb-1",
                                selectedUserIds.includes(p.id) ? "bg-primary/10" : "bg-transparent"
                              )}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-slate-800 truncate">{p.firstName} {p.lastName}</span>
                                <span className="text-[11px] text-slate-500 font-medium truncate">{p.email}</span>
                              </div>
                              {selectedUserIds.includes(p.id) ? (
                                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-slate-200 group-hover:border-primary transition-colors" />
                              )}
                            </div>
                          ))}
                          {filteredParents.length === 0 && (
                            <div className="py-10 text-center flex flex-col items-center gap-2">
                              <Search className="h-8 w-8 text-slate-200" />
                              <p className="text-xs text-slate-400 font-medium">Sonuç bulunamadı</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  
                  {selectedUserIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 max-h-[100px] overflow-y-auto p-1">
                      {selectedUserIds.map(id => {
                        const p = parents?.find((x: any) => x.id === id);
                        return p ? (
                          <Badge key={id} variant="secondary" className="bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 border-none text-[11px] font-bold gap-2 px-3 py-1.5 rounded-xl transition-all group cursor-pointer" onClick={() => toggleUser(id)}>
                            {p.firstName}
                            <X className="h-3 w-3 text-slate-400 group-hover:text-red-500" />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Channel Selection */}
            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">2. Gönderim Kanalları</Label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                    channels.includes('push') ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                  )}
                  onClick={() => toggleChannel('push')}
                >
                  <div className={cn("p-2 rounded-xl", channels.includes('push') ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Anlık Bildirim</span>
                    <span className="text-[10px] text-slate-400 font-medium">Mobil & Masaüstü</span>
                  </div>
                </div>
                <div 
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                    channels.includes('email') ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                  )}
                  onClick={() => toggleChannel('email')}
                >
                  <div className={cn("p-2 rounded-xl", channels.includes('email') ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">E-posta</span>
                    <span className="text-[10px] text-slate-400 font-medium">Kaliteli Şablon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Redirect Selection */}
            <div className="space-y-3">
              <Label htmlFor="redirect" className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">3. Yönlendirme Sayfası</Label>
              <Select value={redirectType} onValueChange={setRedirectType}>
                <SelectTrigger id="redirect" className="h-12 rounded-2xl border-slate-200 bg-slate-50/50">
                  <SelectValue placeholder="Gidilecek Sayfa" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-xl">
                  {REDIRECT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {redirectType === 'custom' && (
                <div className="pt-2 animate-in zoom-in-95 duration-200">
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="https://... veya /sayfa-adi" 
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      className="h-12 rounded-2xl border-slate-200 pl-10 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 ml-2 font-medium italic">* Harici linkler için tam URL giriniz (örn: https://...)</p>
                </div>
              )}
            </div>

            {/* Expiration Selection */}
            <div className="space-y-3">
              <Label htmlFor="expiresAt" className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">4. Geçerlilik Süresi</Label>
              <Select value={expiresAt} onValueChange={setExpiresAt}>
                <SelectTrigger id="expiresAt" className="h-12 rounded-2xl border-slate-200 bg-slate-50/50">
                  <SelectValue placeholder="Geçerlilik süresi seçin" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-xl">
                  <SelectItem value="never">Her Zaman (Süresiz)</SelectItem>
                  <SelectItem value="1_day">1 Gün Boyunca</SelectItem>
                  <SelectItem value="3_days">3 Gün Boyunca</SelectItem>
                  <SelectItem value="1_week">1 Hafta Boyunca</SelectItem>
                  <SelectItem value="custom">Özel Tarih Seç</SelectItem>
                </SelectContent>
              </Select>
              
              {expiresAt === 'custom' && (
                <div className="pt-2 animate-in zoom-in-95 duration-200">
                  <Input 
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 ml-2 font-medium italic">* Bu tarihten sonra bildirim velilerin panelinden kaybolacaktır.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">5. Başlık</Label>
              <Input
                id="title"
                placeholder="Bildirim başlığını buraya yazın..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 text-base font-bold bg-slate-50/50 focus:bg-white transition-colors"
                maxLength={60}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="body" className="text-[11px] font-black uppercase text-slate-400 tracking-[0.1em]">6. Mesaj İçeriği</Label>
              <Textarea
                id="body"
                placeholder="Mesajınızı detaylıca buraya yazın..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="rounded-2xl min-h-[160px] resize-none border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base leading-relaxed"
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSend} 
                disabled={isSending} 
                className="w-full h-16 rounded-[24px] font-black text-lg gap-3 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
              >
                {isSending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Send className="h-6 w-6" />
                )}
                {isSending ? 'Bildiriler Gönderiliyor...' : 'Şimdi Yayına Al'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
