'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/firebase";

function EmailOnayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('E-posta adresiniz doğrulanıyor...');

    useEffect(() => {
        const handleVerification = async () => {
            const oobCode = searchParams.get('oobCode');
            const mode = searchParams.get('mode');

            if (mode !== 'verifyEmail' || !oobCode) {
                setStatus('error');
                setMessage('Geçersiz doğrulama bağlantısı.');
                return;
            }

            try {
                await applyActionCode(auth, oobCode);
                setStatus('success');
                setMessage('E-posta adresiniz başarıyla doğrulandı. Artık tüm özellikleri kullanabilirsiniz.');
            } catch (error: any) {
                console.error("Verification error:", error);
                setStatus('error');
                if (error.code === 'auth/invalid-action-code') {
                    setMessage('Doğrulama kodu geçersiz veya daha önce kullanılmış.');
                } else if (error.code === 'auth/expired-action-code') {
                    setMessage('Doğrulama kodunun süresi dolmuş. Lütfen yeni bir doğrulama e-postası talep edin.');
                } else {
                    setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
            }
        };

        handleVerification();
    }, [searchParams]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                router.push('/ebeveyn-portali');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    const handleRedirect = () => {
        router.push('/ebeveyn-portali');
    };

    if (status === 'loading') {
        return (
            <Card className="w-full max-w-md text-center shadow-lg p-10">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <CardTitle className="text-xl">Doğrulanıyor...</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </div>
            </Card>
        );
    }

    if (status === 'error') {
        return (
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                        <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Doğrulama Başarısız</CardTitle>
                    <CardDescription className="pt-2 text-red-600 font-medium">{message}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={() => router.push('/ebeveyn-portali')} variant="outline" className="w-full">
                        Panele Dön
                    </Button>
                    <Button onClick={() => router.push('/')} className="w-full">
                        Ana Sayfaya Git
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col items-center scale-100 animate-in fade-in duration-500">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Hesabınız Doğrulandı!</CardTitle>
                    <CardDescription className="pt-2 text-slate-600 font-medium">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleRedirect} className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:scale-105 transition-transform">
                        Ebeveyn Portalı'na Git
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function EmailOnayPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
                <EmailOnayContent />
            </Suspense>
        </div>
    );
}
