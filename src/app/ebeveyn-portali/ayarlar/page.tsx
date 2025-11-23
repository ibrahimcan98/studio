
'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirebase, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, ArrowLeft, User, Image as ImageIcon, KeyRound, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AyarlarPage() {
    const { user: authUser, loading: authLoading } = useUser();
    const { firebaseApp } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();
    const db = useFirestore();
    const auth = getAuth();

    const userDocRef = useMemoFirebase(() => {
        if (!authUser) return null;
        return doc(db, 'users', authUser.uid);
    }, [authUser, db]);

    const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);
    const [isReauthRequired, setIsReauthRequired] = useState(false);
    
    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
        }
        if (authUser) {
            setEmail(authUser.email || '');
        }
    }, [userData, authUser]);


    const handleSaveProfile = async () => {
        if (!authUser || !userDocRef) return;
        setIsSavingProfile(true);

        try {
            const newDisplayName = `${firstName} ${lastName}`.trim();
            if(authUser.displayName !== newDisplayName) {
                await updateProfile(authUser, { displayName: newDisplayName });
            }
            await updateDoc(userDocRef, { firstName, lastName });
            
            if (email !== authUser.email) {
                setIsReauthRequired(true);
                return;
            }

            toast({ title: 'Başarılı!', description: 'Profil bilgileriniz güncellendi.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Profiliniz güncellenirken bir hata oluştu.' });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleReauthenticateAndSave = async () => {
        if (!authUser || !auth.currentUser) {
            return;
        }

        setIsSavingProfile(true);
        try {
            const credential = EmailAuthProvider.credential(authUser.email!, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Re-authentication successful, now update email
            await updateEmail(auth.currentUser, email);
            if (userDocRef) {
                await updateDoc(userDocRef, { email });
            }

            toast({ title: 'Başarılı!', description: 'E-posta adresiniz güncellendi.' });
            setIsReauthRequired(false);
            setCurrentPassword('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Doğrulama Hatası', description: 'Mevcut şifreniz yanlış.' });
        } finally {
            setIsSavingProfile(false);
        }
    };
    
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Yeni şifreler eşleşmiyor.' });
            return;
        }
        if (newPassword.length < 6) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Şifre en az 6 karakter olmalıdır.' });
            return;
        }
        if (!auth.currentUser) return;
        
        setIsSavingSecurity(true);
        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);

            toast({ title: 'Başarılı!', description: 'Şifreniz başarıyla değiştirildi.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Mevcut şifreniz yanlış veya bir sorun oluştu.' });
        } finally {
            setIsSavingSecurity(false);
        }
    }

    if (authLoading || userDataLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-muted/20 min-h-screen">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profil Ayarları</h2>
                    <p className="text-muted-foreground">Profil bilgilerinizi ve hesap ayarlarınızı yönetin.</p>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="flex flex-col gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Kişisel Bilgiler</CardTitle>
                            <CardDescription>Adınızı, soyadınızı ve e-posta adresinizi güncelleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">İsim</Label>
                                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Soyisim</Label>
                                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                                {isSavingProfile && <Loader2 className="animate-spin mr-2"/>}
                                Değişiklikleri Kaydet
                            </Button>
                        </CardFooter>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><KeyRound/> Şifre Değiştir</CardTitle>
                            <CardDescription>Güvenliğiniz için yeni bir şifre belirleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="current-password">Mevcut Şifre</Label>
                                <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Yeni Şifre</Label>
                                    <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleChangePassword} disabled={isSavingSecurity || !currentPassword || !newPassword || !confirmPassword}>
                                 {isSavingSecurity && <Loader2 className="animate-spin mr-2"/>}
                                Şifreyi Değiştir
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            
             <AlertDialog open={isReauthRequired} onOpenChange={setIsReauthRequired}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Güvenlik Doğrulaması</AlertDialogTitle>
                        <AlertDialogDescription>
                            E-posta adresinizi değiştirmek gibi hassas bir işlem için lütfen mevcut şifrenizi tekrar girin.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="reauth-password">Mevcut Şifre</Label>
                        <Input 
                            id="reauth-password" 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setIsReauthRequired(false);
                            // Reset email to original if cancelled
                            if (authUser) setEmail(authUser.email || '');
                            setCurrentPassword('');
                        }}>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReauthenticateAndSave} disabled={isSavingProfile}>
                            {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Onayla ve Güncelle
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
