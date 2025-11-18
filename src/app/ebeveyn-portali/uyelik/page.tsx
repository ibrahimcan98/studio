'use client';

import {
  Award,
  BookOpen,
  CheckCircle,
  CreditCard,
  Crown,
  Download,
  Mail,
  RefreshCw,
  Star,
  User,
  Zap,
  X,
  Snowflake,
  Loader2,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { addMonths, format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

const paymentHistory = [
  { date: '15 Kasım 2025', amount: '14 €', status: 'Başarılı' },
  { date: '15 Ekim 2025', amount: '14 €', status: 'Başarılı' },
  { date: '15 Eylül 2025', amount: '14 €', status: 'Başarılı' },
];

const plans = [
    { name: 'Aylık', price: '14 €', discount: '', current: true },
    { name: '3 Aylık', price: '36 €', discount: '%15 indirim', current: false },
    { name: 'Yıllık', price: '129 €', discount: '%25 indirim', current: false },
]

const premiumPerks = [
    { icon: BookOpen, text: "Tüm konular & seviyeler açılır" },
    { icon: Award, text: "Görevler & rozetler sınırsız" },
    { icon: Star, text: "Çocuk modu power-up’ları" },
    { icon: Zap, text: "Sınırsız can & reklamsız deneyim" },
    { icon: User, text: "İlerleme raporları" },
]

export default function UyelikYonetimiPage() {
    const { user, isUserLoading } = useUser();
    const db = useFirestore();
    const router = useRouter();

    const userDocRef = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return doc(db, 'users', user.uid);
    }, [db, user?.uid]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const isPremium = userData?.isPremium || false;

    if (isUserLoading || isUserDataLoading) {
      return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!user || !isPremium) {
       router.push('/premium');
       return null;
    }


    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return format(parseISO(dateString), 'd MMMM yyyy', { locale: tr });
    };

    const startDate = formatDate(userData?.premiumStartDate);
    const renewalDate = formatDate(userData?.premiumEndDate);


  return (
    <div className="bg-muted/30">
      <div className="container max-w-5xl mx-auto py-12 px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Üyelik Yönetimi</h1>
            <p className="text-muted-foreground text-lg">Premium üyeliğinizle ilgili tüm detayları burada bulabilirsiniz.</p>
        </div>

        {/* 1. Üyelik Durumu Kartı */}
        <Card className="overflow-hidden border-2 border-primary/50 shadow-lg">
          <CardHeader className="bg-primary/5 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Crown className="text-primary" /> Premium Üyeliğiniz Aktif
                    </CardTitle>
                    <CardDescription className="mt-2">
                        Başlangıç Tarihi: {startDate}
                    </CardDescription>
                </div>
                <div className="text-left md:text-right">
                    <p className="font-semibold text-foreground">Her ay 14 € otomatik yenilenir</p>
                    <p className="text-sm text-muted-foreground">Sonraki yenileme: {renewalDate}</p>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Aylık Plan</span>
                <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-primary"/> Sınırsız Can</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-primary"/> Tüm Konular Açık</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4 text-primary"/> Özel Rozetler</span>
            </div>
            <Separator/>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-muted-foreground"/>
                    <div>
                        <p className="font-medium">Ödeme Yöntemi</p>
                        <p className="text-sm text-muted-foreground">Visa kartı, sonu **** 4242</p>
                    </div>
                </div>
                <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2"/>
                    Ödeme Yöntemini Değiştir
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Faturalandırma Bölümü */}
        <Card>
            <CardHeader>
                <CardTitle>Faturalandırma</CardTitle>
                <CardDescription>Ödeme geçmişinizi görüntüleyin ve faturalarınızı indirin.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg p-4 mb-6 flex justify-between items-center bg-background">
                    <div>
                        <p className="text-sm font-medium">Sonraki Ödeme</p>
                        <p className="text-2xl font-bold">14 €</p>
                    </div>
                    <div className="text-right">
                         <p className="text-sm font-medium">Tarih</p>
                         <p className="font-semibold">{renewalDate}</p>
                    </div>
                </div>
                <h4 className="font-semibold mb-4">Ödeme Geçmişi</h4>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tarih</TableHead>
                                <TableHead>Tutar</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">Fatura</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {paymentHistory.map((payment, index) => (
                            <TableRow key={index}>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">{payment.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        <Download className="w-4 h-4 mr-2"/> PDF
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                 <Button variant="outline" className="mt-6 w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2"/> Tüm Faturaları İndir
                </Button>
            </CardContent>
        </Card>

        {/* Grid for Plan & Perks */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* 3. Planı Değiştir Bölümü */}
            <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><RefreshCw/> Planını Değiştir</CardTitle>
                    <CardDescription>Daha uzun süreli planlara geçerek tasarruf edin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {plans.map(plan => (
                         <div key={plan.name} className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${plan.current ? 'border-primary bg-primary/5' : ''}`}>
                            <div>
                               <p className="font-bold">{plan.name} Plan</p>
                               <p className="text-2xl font-bold">{plan.price} <span className="text-sm font-normal text-muted-foreground">/ {plan.name.toLowerCase()}</span></p>
                               {plan.discount && <Badge className="mt-1 bg-green-600">{plan.discount}</Badge>}
                            </div>
                            {plan.current ? (
                                <Badge variant="outline" className="border-primary text-primary">Mevcut Plan</Badge>
                            ) : (
                                <Button>Bu Plana Geç</Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* 5. Premium Avantajlar */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="text-yellow-500"/> Premium Avantajları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {premiumPerks.map((perk, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <div className="p-1 bg-yellow-100 rounded-full">
                                <perk.icon className="w-4 h-4 text-yellow-600"/>
                            </div>
                            <span className="font-medium">{perk.text}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>


        {/* 4. Üyelik İptali / Dondurma */}
        <Card>
             <CardHeader>
                <CardTitle>Üyelik Ayarları</CardTitle>
                <CardDescription>Üyeliğinizi dondurabilir veya iptal edebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 flex flex-col items-start gap-3 bg-blue-50/50">
                    <div className="flex items-center gap-2 font-semibold text-blue-800"><Snowflake/> Üyeliği Dondur</div>
                    <p className="text-sm text-muted-foreground flex-grow">Yenilemeyi 3 aya kadar duraklatabilirsiniz.</p>
                    <Button variant="outline" className="w-full sm:w-auto">Dondur</Button>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <div className="border rounded-lg p-4 flex flex-col items-start gap-3 bg-red-50/50">
                            <div className="flex items-center gap-2 font-semibold text-destructive"><X/> Premium Üyeliği İptal Et</div>
                            <p className="text-sm text-muted-foreground flex-grow">İptal ettiğinizde tüm premium özelliklere erişiminizi kaybedersiniz.</p>
                            <Button variant="destructive" className="w-full sm:w-auto">İptal Et</Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Premium üyeliğinizi iptal etmek istediğinizden emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Üyeliğinizi iptal ederseniz, fatura döneminizin sonunda aşağıdaki premium özelliklere erişiminizi kaybedersiniz:
                                <ul className="mt-4 space-y-2 text-left">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5"/> <div><span className="font-semibold">Sınırsız Can:</span> Öğrenmeye ara vermeyin.</div></li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5"/> <div><span className="font-semibold">Tüm Kategoriler:</span> Kilitli tüm konulara erişin.</div></li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5"/> <div><span className="font-semibold">Özel Rozetler:</span> Premium rozetleri kazanın.</div></li>
                                </ul>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Evet, İptal Et</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>

        {/* 6. Destek */}
        <Card className="text-center">
            <CardContent className="p-6">
                <Mail className="w-8 h-8 text-primary mx-auto mb-2"/>
                <h3 className="font-semibold text-lg">Desteğe mi İhtiyacınız Var?</h3>
                <p className="text-muted-foreground mb-4">Üyeliğinizle ilgili sorularınız için bizimle iletişime geçin.</p>
                <a href="mailto:support@turkcocukakademisi.com" className="font-semibold text-primary hover:underline">
                    support@turkcocukakademisi.com
                </a>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
