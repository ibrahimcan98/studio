

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

const difficulties = [
    { id: "kelime", label: "Kelime" },
    { id: "cumle", label: "Cümle" },
    { id: "anlama", label: "Anlama" },
    { id: "okuma", label: "Okuma" },
    { id: "yazma", label: "Yazma" },
    { id: "ifade", label: "Kendini ifade" },
    { id: "motivasyon", label: "Motivasyon" },
    { id: "ingilizce-karistirma", label: "İngilizce karıştırma" },
] as const;

const formSchema = z.object({
  firstName: z.string().min(1, 'İsim boş olamaz.'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Geçerli bir tarih girin." }),
  countryOfResidence: z.string().min(1, 'Yaşadığı ülke boş olamaz.'),
  parentTongues: z.string().min(1, "Ebeveyn dilleri boş olamaz."),
  schoolLanguage: z.string().min(1, "Okul dili boş olamaz."),
  homeLanguageTurkishPercentage: z.number().min(0).max(100).default(50),
  turkishExposureIntensity: z.enum(["low", "medium", "high"], { required_error: "Lütfen bir yoğunluk seçin." }),
  schoolLiteracyStatus: z.enum(["not-yet", "in-progress", "fluent"], {
    required_error: "Lütfen birini seçin.",
  }),
  turkishLiteracyLevel: z.enum(["none", "word-sentence", "reads-short-writes", "fluent"], {
    required_error: "Lütfen birini seçin.",
  }),
  turkishDifficulties: z.array(z.string()).optional(),
});

type AddChildFormValues = z.infer<typeof formSchema>;

interface AddChildFormProps {
    userId: string;
    onChildAdded: () => void;
    child?: any; // For edit mode
    childId?: string; // For edit mode
    children?: React.ReactNode;
}


export function AddChildForm({ userId, onChildAdded, child, childId, children }: AddChildFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();
  
  const isEditMode = !!child;

  const form = useForm<AddChildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: child?.firstName || '',
      dateOfBirth: child?.dateOfBirth ? format(parseISO(child.dateOfBirth), 'yyyy-MM-dd') : '',
      countryOfResidence: child?.countryOfResidence || '',
      parentTongues: child?.parentTongues || '',
      schoolLanguage: child?.schoolLanguage || '',
      homeLanguageTurkishPercentage: child?.homeLanguageTurkishPercentage || 50,
      turkishDifficulties: child?.turkishDifficulties || [],
      turkishExposureIntensity: child?.turkishExposureIntensity,
      schoolLiteracyStatus: child?.schoolLiteracyStatus,
      turkishLiteracyLevel: child?.turkishLiteracyLevel,
    },
  });

  useEffect(() => {
    if (open) {
        if (isEditMode && child) {
            form.reset({
                firstName: child.firstName || '',
                dateOfBirth: child.dateOfBirth ? format(parseISO(child.dateOfBirth), 'yyyy-MM-dd') : '',
                countryOfResidence: child.countryOfResidence || '',
                parentTongues: child.parentTongues || '',
                schoolLanguage: child.schoolLanguage || '',
                homeLanguageTurkishPercentage: child.homeLanguageTurkishPercentage || 50,
                turkishDifficulties: child.turkishDifficulties || [],
                turkishExposureIntensity: child.turkishExposureIntensity,
                schoolLiteracyStatus: child.schoolLiteracyStatus,
                turkishLiteracyLevel: child.turkishLiteracyLevel,
            });
        } else {
            form.reset({
                firstName: '',
                dateOfBirth: '',
                countryOfResidence: '',
                parentTongues: '',
                schoolLanguage: '',
                homeLanguageTurkishPercentage: 50,
                turkishDifficulties: [],
                turkishExposureIntensity: undefined,
                schoolLiteracyStatus: undefined,
                turkishLiteracyLevel: undefined,
            });
        }
    }
  }, [isEditMode, child, form, open]);


  const onInvalid = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const onSubmit = async (values: AddChildFormValues) => {
    if (!db) return;
    setIsSubmitting(true);

    try {
        if(isEditMode && childId) {
            const childDocRef = doc(db, 'users', userId, 'children', childId);
            await updateDoc(childDocRef, {
                ...values,
                dateOfBirth: format(new Date(values.dateOfBirth), "yyyy-MM-dd"),
                isProfileComplete: true,
            });
             toast({
                title: 'Başarılı!',
                description: `${values.firstName} bilgileri güncellendi.`,
            });
        } else {
            const newChildDoc = await addDoc(collection(db, 'users', userId, 'children'), {
                ...values,
                dateOfBirth: format(new Date(values.dateOfBirth), "yyyy-MM-dd"),
                userId: userId,
                rozet: 0,
                completedTopics: [],
                remainingLessons: 0,
                assignedPackage: null,
                assignedPackageName: null,
                level: 'beginner',
                hasUsedFreeTrial: false,
                isProfileComplete: true,
                createdAt: serverTimestamp(),
            });

            // Store new child's ID for auto-selection
            localStorage.setItem('newlyAddedChildId', newChildDoc.id);

            // Store in Activity Log (Frontend side for auth)
            addDoc(collection(db, 'activity-log'), {
                event: '👶 Yeni Öğrenci Eklendi',
                icon: '👶',
                details: { 'Öğrenci Adı': values.firstName },
                createdAt: Timestamp.fromDate(new Date())
            }).catch(console.error);

            // Admin notification (Email)
            fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: '👶 Yeni Öğrenci Eklendi',
                    details: { 'Öğrenci Adı': values.firstName }
                })
            }).catch(console.error);

            toast({
                title: 'Başarılı!',
                description: `${values.firstName} eklendi.`,
            });
        }
      onChildAdded(); // Refetch children list in parent component
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error saving child:', error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Çocuk bilgileri kaydedilirken bir sorun oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Çocuk Bilgilerini Düzenle' : 'Yeni Çocuk Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Çocuğunuzun bilgilerini güncelleyebilirsiniz.' : 'Çocuğunuzun Türkçe öğrenme yolculuğu için gerekli bilgileri girin.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 max-h-[70vh] overflow-y-auto p-1 pr-4">
            
            {/* Bölüm 1 */}
            <div className='space-y-4 p-4 border rounded-lg'>
              <h3 className='font-semibold text-lg'>Bölüm 1 – Çocuğun Temel Bilgileri</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl><Input placeholder="Çocuğun adı" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Doğum Tarihi</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="countryOfResidence" render={({ field }) => (
                <FormItem>
                  <FormLabel>Yaşadığı ülke/Burada doğdu/Şu yılda geldi</FormLabel>
                  <FormControl><Input placeholder="Örnek: İsviçre'de yaşıyoruz, burada doğdu veya 2022'de geldi" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Bölüm 2 */}
            <div className='space-y-6 p-4 border rounded-lg'>
                <h3 className='font-semibold text-lg'>Bölüm 2 – Dil Ortamı</h3>
                <FormField control={form.control} name="parentTongues" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ebeveynler hangi dilleri konuşuyor?</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="schoolLanguage" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Çocuğun okul dili</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="homeLanguageTurkishPercentage" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Evde Türkçe Kullanım Oranı: {field.value}%</FormLabel>
                        <FormControl>
                            <Slider
                                value={[field.value]}
                                max={100}
                                step={10}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="turkishExposureIntensity" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Türkçe Maruziyet Yoğunluğu</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="low" /></FormControl>
                                    <FormLabel className="font-normal">Düşük</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="medium" /></FormControl>
                                    <FormLabel className="font-normal">Orta</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="high" /></FormControl>
                                    <FormLabel className="font-normal">Yüksek</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            {/* Bölüm 3 */}
            <div className='space-y-6 p-4 border rounded-lg'>
                <h3 className='font-semibold text-lg'>Bölüm 3 – Okuryazarlık</h3>
                <FormField control={form.control} name="schoolLiteracyStatus" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Öğrencinin okuldaki okuma/yazma durumu</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="not-yet" /></FormControl>
                                    <FormLabel className="font-normal">Henüz öğrenmedi</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="in-progress" /></FormControl>
                                    <FormLabel className="font-normal">Devam ediyor</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="fluent" /></FormControl>
                                    <FormLabel className="font-normal">Öğrendi, akıcı bir şekilde okuyup yazıyor</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="turkishLiteracyLevel" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Çocuğun Türkçe okuma/yazma düzeyi</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="none" /></FormControl>
                                    <FormLabel className="font-normal">Hiç yok</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="word-sentence" /></FormControl>
                                    <FormLabel className="font-normal">Kelime/cümle düzeyinde</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="reads-short-writes" /></FormControl>
                                    <FormLabel className="font-normal">Okuyup kısa yazabiliyor</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="fluent" /></FormControl>
                                    <FormLabel className="font-normal">Akıcı okuyor / düzenli yazıyor</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            {/* Bölüm 4 */}
             <div className='space-y-4 p-4 border rounded-lg'>
                <FormField
                    control={form.control}
                    name="turkishDifficulties"
                    render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <h3 className='font-semibold text-lg'>Bölüm 4 – Türkçe ile İlgili Gözlemleriniz</h3>
                            <FormDescription>Çocuğun Türkçe ile ilgili zorlandığı alanlar (Birden fazla seçilebilir)</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        {difficulties.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="turkishDifficulties"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {isEditMode ? 'Değişiklikleri Kaydet' : 'Çocuğu Kaydet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
