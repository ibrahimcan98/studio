
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TeacherIllustration } from '@/components/illustrations/teacher-illustration';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

export default function OgretmenGirisPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  const ensureTeacherProfile = async (firebaseUser: User) => {
    if (!db || !firebaseUser.email) return false;

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    // Eğer kullanıcı zaten Firestore'da varsa, rolünü kontrol et
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.role === 'teacher') return true;
      
      // Eğer rolü farklıysa ama admin panelinden bir taslak oluşturulmuş olabilir (ID e-posta slug olabilir)
      // Bu durumda UID ile dokümanı eşlememiz gerekir.
      // Basitlik için: Eğer email eşleşiyorsa ama UID farklıysa, yetkiyi UID'ye taşı
      const slugId = firebaseUser.email.replace(/[^a-zA-Z0-9]/g, '_');
      const slugRef = doc(db, 'users', slugId);
      const slugDoc = await getDoc(slugRef);
      
      if (slugDoc.exists() && slugDoc.data().role === 'teacher') {
          // Taslağı UID'ye taşı
          await setDoc(userDocRef, { 
              ...slugDoc.data(), 
              id: firebaseUser.uid,
              updatedAt: serverTimestamp() 
          });
          await deleteDoc(slugRef);
          return true;
      }
      
      return false;
    }

    // Kullanıcı Firestore'da yoksa, e-posta taslağı kontrolü yap
    const slugId = firebaseUser.email.replace(/[^a-zA-Z0-9]/g, '_');
    const slugRef = doc(db, 'users', slugId);
    const slugDoc = await getDoc(slugRef);

    if (slugDoc.exists() && slugDoc.data().role === 'teacher') {
        await setDoc(userDocRef, { 
            ...slugDoc.data(), 
            id: firebaseUser.uid,
            updatedAt: serverTimestamp() 
        });
        // Opsiyonel: Taslağı silebiliriz (temizlik için)
        // await deleteDoc(slugRef);
        return true;
    }

    return false;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !db) return;

    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isAuthorized = await ensureTeacherProfile(userCredential.user);
      
      if (isAuthorized) {
        toast({ title: 'Başarılı!', description: 'Öğretmen portalına yönlendiriliyorsunuz...' });
        router.push('/ogretmen-portali/takvim');
      } else {
        await auth.signOut();
        toast({ variant: 'destructive', title: 'Yetki Hatası', description: 'Bu hesap öğretmen portalı için yetkilendirilmemiş.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata', description: 'E-posta veya şifre hatalı.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white p-4 overflow-hidden">
      <div className="container relative z-10 w-full max-w-6xl flex items-center justify-center">
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full max-w-4xl">
            <div className="flex justify-center md:justify-end">
              <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-3xl font-bold">Öğretmen Girişi</CardTitle>
                  <CardDescription>Portala erişmek için lütfen giriş yapın.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
                      </div>
                      <Button type="submit" className="w-full font-bold text-lg py-6" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : 'Giriş Yap'}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="hidden md:block">
              <TeacherIllustration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
