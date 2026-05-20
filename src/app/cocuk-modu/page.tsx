'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2, User, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetPinDialog } from '@/components/child-mode/set-pin-dialog';

export default function ChildModeSelectPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const db = useFirestore();

    const childrenQuery = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return collection(db, 'users', user.uid, 'children');
    }, [db, user?.uid]);

    const { data: children, isLoading: childrenLoading } = useCollection(childrenQuery);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/ebeveyn-portali');
        }
    }, [user, authLoading, router]);

    if (authLoading || childrenLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-sky-100">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Macera Dünyası Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (children && children.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-sky-100">
                <div className="text-center">
                    <p className="text-slate-500 font-medium mb-4">Henüz kayıtlı çocuk bulunamadı.</p>
                    <Button onClick={() => router.push('/ebeveyn-portali')}>Ebeveyn Paneline Dön</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-gradient-to-b from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Arkaplan Efektleri */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[10%] left-[10%] w-32 h-10 bg-white rounded-full opacity-60 blur-sm" />
                <div className="absolute top-[20%] right-[20%] w-40 h-12 bg-white rounded-full opacity-60 blur-sm" />
                <div className="absolute bottom-[30%] left-[15%] w-48 h-16 bg-white rounded-full opacity-40 blur-sm" />
            </div>

            {/* Geri Dön Butonu */}
            <Button 
                variant="outline" 
                className="absolute top-6 left-6 rounded-xl font-bold bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-white z-20 shadow-sm"
                onClick={() => router.push('/ebeveyn-portali')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Ebeveyn Paneline Dön
            </Button>

            <div className="max-w-4xl w-full text-center z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 drop-shadow-sm">Kim Oynuyor?</h1>
                    <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
                <p className="text-slate-600 text-lg mb-12 font-medium">Macera dünyasına girmek için profilini seç!</p>

                <div className="flex flex-wrap justify-center gap-12">
                    {children?.map((child: any) => (
                        <SetPinDialog key={child.id} childId={child.id}>
                            <div className="group flex flex-col items-center gap-4 cursor-pointer">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-xl shadow-sky-200/50 flex items-center justify-center text-4xl font-bold text-sky-600 border-4 border-transparent group-hover:border-sky-400 transition-all transform group-hover:scale-105 group-hover:shadow-2xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-white -z-10" />
                                    {child.firstName?.[0] || <User className="w-16 h-16 text-sky-300" />}
                                </div>
                                <span className="text-lg md:text-xl font-bold text-slate-700 group-hover:text-sky-600 transition-colors">
                                    {child.firstName}
                                </span>
                            </div>
                        </SetPinDialog>
                    ))}
                </div>
            </div>
        </div>
    );
}
