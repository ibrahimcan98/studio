
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

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    });

    useEffect(() => {
        if (userData) {
            setValue('name', `${userData.firstName} ${userData.lastName}`);
            setValue('email', userData.email);
            setValue('phone', userData.phoneNumber);
        }
    }, [userData, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <h3 className="font-bold text-slate-800 text-center text-sm">Canlı Desteğe Başla</h3>
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
            <div className="space-y-2">
                <Label className="text-xs">Telefon</Label>
                <Input {...register('phone')} placeholder="+90 ..." className="h-9 text-sm" />
                {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message as string}</p>}
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Konu</Label>
                <Select onValueChange={(v) => setValue('topic', v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="kurslar">Kurslar & Paketler</SelectItem>
                        <SelectItem value="teknik">Teknik Destek</SelectItem>
                        <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                </Select>
                {errors.topic && <p className="text-[10px] text-red-500">{errors.topic.message as string}</p>}
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Sorunuz</Label>
                <Textarea {...register('message')} placeholder="Nasıl yardımcı olabiliriz?" className="text-sm min-h-[60px]" />
                {errors.message && <p className="text-[10px] text-red-500">{errors.message.message as string}</p>}
            </div>
            <Button type="submit" className="w-full h-10 font-bold">Sohbeti Başlat</Button>
        </form>
    );
}
