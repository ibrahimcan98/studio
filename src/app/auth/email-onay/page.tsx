
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailOnayPage() {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/ebeveyn-portali/ayarlar');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Hesabınız Doğrulandı!</CardTitle>
                    <CardDescription className="pt-2">
                        E-posta adresiniz başarıyla doğrulandı. Artık tüm özellikleri kullanabilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleRedirect} className="w-full">
                        Profil Ayarlarına Dön
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
