'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    name: z.string().min(1, 'İsim zorunludur'),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    topic: z.string().min(1, 'Konu seçiniz')
});

export function WhatsappSupportForm({ onSubmit }: { onSubmit: (data: any) => void }) {
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
            setValue('name', `${userData.firstName} ${userData.lastName}`.trim() || userData.email || '');
            setValue('email', userData.email || '');
            setValue('phone', userData.phoneNumber || '');
        } else if (user && !user.isAnonymous) {
            setValue('name', user.displayName || user.email || '');
            setValue('email', user.email || '');
        }
    }, [userData, user, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <div className="flex flex-col items-center gap-2 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                    <MessageCircle className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">WhatsApp Destek Hattı</h3>
                <p className="text-[10px] text-muted-foreground text-center px-4">
                    {isActualUser 
                        ? `Sayın ${user?.displayName?.split(' ')[0] || 'Üye'}, bilgilerinizi onaylayıp WhatsApp'a geçebilirsiniz.`
                        : "Bilgilerinizi doldurun, sizi WhatsApp'a yönlendirelim."
                    }
                </p>
            </div>

            {/* Giriş yapmamış kullanıcılar için gösterilir */}
            {!isActualUser && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Ad Soyad</Label>
                        <Input {...register('name')} placeholder="Adınız" className="h-9 text-sm" />
                        {errors.name && <p className="text-[10px] text-red-500">{errors.name.message as string}</p>}
                    </div>

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
                        <Label className="text-xs">E-posta (Opsiyonel)</Label>
                        <Input {...register('email')} type="email" placeholder="ornek@mail.com" className="h-9 text-sm" />
                        {errors.email && <p className="text-[10px] text-red-500">{errors.email.message as string}</p>}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label className="text-xs">Konu</Label>
                <Select onValueChange={(v) => setValue('topic', v)}>
                    <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fiyatlandirma">Fiyatlar & Ödeme</SelectItem>
                        <SelectItem value="deneme-dersi">Deneme Dersi</SelectItem>
                        <SelectItem value="is-birligi">İş Birliği</SelectItem>
                        <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                </Select>
                {errors.topic && <p className="text-[10px] text-red-500">{errors.topic.message as string}</p>}
            </div>

            <Button type="submit" className="w-full h-10 font-bold bg-green-600 hover:bg-green-700 shadow-md">
                WhatsApp'a Bağlan
            </Button>
        </form>
    );
}
