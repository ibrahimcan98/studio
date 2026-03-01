
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { User, Mail } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, 'İsim zorunludur'),
    email: z.string().email('Geçerli bir e-posta girin'),
    phone: z.string().min(10, 'Telefon numarası zorunludur'),
    topic: z.string().min(1, 'Konu seçiniz'),
    message: z.string().min(5, 'Lütfen sorunuzu kısaca yazın')
});

export function LiveChatForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const { user } = useUser();
    const db = useFirestore();
    const userDocRef = useMemoFirebase(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
    const { data: userData } = useDoc(userDocRef);

    const isActualUser = user && !user.isAnonymous;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    });

    useEffect(() => {
        if (userData) {
            setValue('name', `${userData.firstName} ${userData.lastName}`);
            setValue('email', userData.email);
            // Telefon numarasını otomatik doldurmayı kaldırdık (kullanıcı isteği üzerine)
        } else if (user && !user.isAnonymous) {
            setValue('name', user.displayName || '');
            setValue('email', user.email || '');
        }
    }, [userData, user, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <div className="text-center space-y-1 mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Canlı Desteğe Başla</h3>
                {isActualUser && (
                    <p className="text-[10px] text-muted-foreground italic">
                        Hoş geldiniz, <span className="font-bold text-primary">{user?.displayName?.split(' ')[0]}</span>. Bilgileriniz otomatik olarak eklendi.
                    </p>
                )}
            </div>

            {!isActualUser && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs">Ad Soyad</Label>
                        <Input {...register('name')} placeholder="Adınız" className="h-9 text-sm" />
                        {errors.name && <p className="text-[10px] text-red-500">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">E-posta</Label>
                        <Input {...register('email')} type="email" placeholder="ornek@mail.com" className="h-9 text-sm" />
                        {errors.email && <p className="text-[10px] text-red-500">{errors.email.message as string}</p>}
                    </div>
                </>
            )}

            <div className="space-y-2">
                <Label className="text-xs">Telefon Numarası</Label>
                <Input 
                    {...register('phone')} 
                    type="tel" 
                    placeholder="+90 ..." 
                    className="h-9 text-sm" 
                    autoComplete="tel"
                />
                {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs">Konu</Label>
                <Select onValueChange={(v) => setValue('topic', v)}>
                    <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Konu Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="kurslar">Kurslar & Paketler</SelectItem>
                        <SelectItem value="teknik">Teknik Destek</SelectItem>
                        <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                </Select>
                {errors.topic && <p className="text-[10px] text-red-500">{errors.topic.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-xs">Mesajınız</Label>
                <Textarea {...register('message')} placeholder="Nasıl yardımcı olabiliriz?" className="text-sm min-h-[60px]" />
                {errors.message && <p className="text-[10px] text-red-500">{errors.message.message as string}</p>}
            </div>

            <Button type="submit" className="w-full h-10 font-bold shadow-md">
                Sohbeti Başlat
            </Button>
        </form>
    );
}
