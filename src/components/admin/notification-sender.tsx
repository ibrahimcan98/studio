'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Bell } from 'lucide-react';

export function NotificationSender() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!title || !body) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen başlık ve mesaj girin.',
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, target }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Başarılı',
          description: `${result.successCount} cihaza bildirim gönderildi.`,
          className: 'bg-green-500 text-white',
        });
        setTitle('');
        setBody('');
      } else {
        throw new Error(result.error || 'Bildirim gönderilemedi.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-none shadow-md overflow-hidden bg-white">
      <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
        <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">Anlık Bildirim Gönder</CardTitle>
        </div>
        <CardDescription>
          Kullanıcılarınızın tarayıcılarına anlık push bildirimi gönderin.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target" className="text-xs font-bold uppercase text-slate-500">Hedef Kitle</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger id="target" className="h-11 rounded-xl">
              <SelectValue placeholder="Hedef seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Herkes (Tüm Kayıtlı Cihazlar)</SelectItem>
              <SelectItem value="parents">Sadece Veliler</SelectItem>
              <SelectItem value="teachers">Sadece Öğretmenler</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-bold uppercase text-slate-500">Bildirim Başlığı</Label>
          <Input
            id="title"
            placeholder="Örn: Yeni Ders Paketi Yayında!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-xs font-bold uppercase text-slate-500">Bildirim İçeriği</Label>
          <Textarea
            id="body"
            placeholder="Mesajınızı buraya yazın..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-xl min-h-[100px] resize-none"
          />
        </div>

        <Button 
          onClick={handleSend} 
          disabled={isSending} 
          className="w-full h-12 rounded-xl font-bold gap-2 text-white shadow-lg shadow-primary/20"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSending ? 'Gönderiliyor...' : 'Bildirimi Gönder'}
        </Button>
      </CardContent>
    </Card>
  );
}
