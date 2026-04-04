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
import { Loader2, Plus, ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const difficulties = [
    { id: "kelime", label: "Kelime" },
    { id: "cumle", label: "Cümle" },
    { id: "anlama", label: "Anlama" },
    { id: "okuma", label: "Okuma" },
    { id: "yazma", label: "Yazma" },
    { id: "ifade", label: "Kendini ifade" },
    { id: "motivasyon", label: "Motivasyon" },
    { id: "ingilizce-karistirma", label: "Dilleri karıştırma" },
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
    forceOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const STEPS = [
    { id: 1, title: 'Temel Bilgiler' },
    { id: 2, title: 'Dil Ortamı' },
    { id: 3, title: 'Okuryazarlık' },
    { id: 4, title: 'Gözlemler' },
    { id: 5, title: 'Özet' }
];

export function AddChildForm({ userId, onChildAdded, child, childId, children, forceOpen, onOpenChange }: AddChildFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
    const isOpen = forceOpen !== undefined ? forceOpen : open;
    if (isOpen) {
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
        // Only reset step if it's not already set (e.g. first open)
    } else {
        // Reset step when closed
        setCurrentStep(1);
    }
  }, [open, forceOpen]); // Depend only on open state to prevent resets during editing

  const handleNext = async () => {
    let fieldsToValidate: (keyof AddChildFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ['firstName', 'dateOfBirth', 'countryOfResidence'];
    else if (currentStep === 2) fieldsToValidate = ['parentTongues', 'schoolLanguage', 'turkishExposureIntensity'];
    else if (currentStep === 3) fieldsToValidate = ['schoolLiteracyStatus', 'turkishLiteracyLevel'];
    else if (currentStep === 4) fieldsToValidate = ['turkishDifficulties'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
        setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Prevent early submission via Enter key or other triggers
  const handleProtectedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNext();
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (values: AddChildFormValues) => {
    if (currentStep < 5) return; // double safety
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

            localStorage.setItem('newlyAddedChildId', newChildDoc.id);

            addDoc(collection(db, 'activity-log'), {
                event: '👶 Yeni Öğrenci Eklendi',
                icon: '👶',
                details: { 'Öğrenci Adı': values.firstName },
                createdAt: Timestamp.fromDate(new Date())
            }).catch(console.error);

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
      onChildAdded();
      if (onOpenChange) onOpenChange(false);
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

  const handleOpenChange = (newOpen: boolean) => {
      if (onOpenChange) onOpenChange(newOpen);
      setOpen(newOpen);
  };

  const currentOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-[32px] border-none shadow-2xl bg-white focus:outline-none">
        <div className="p-8">
            <DialogHeader className='mb-6'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='space-y-1'>
                        <DialogTitle className='text-2xl font-black text-slate-900'>{isEditMode ? 'Bilgileri Düzenle' : 'Yeni Çocuk Ekle'}</DialogTitle>
                        <DialogDescription className='text-slate-500 font-medium'>
                            {isEditMode ? 'Çocuğunuzun bilgilerini güncelleyebilirsiniz.' : 'Çocuğunuzun Türkçe öğrenme yolculuğu için gerekli bilgiler.'}
                        </DialogDescription>
                    </div>
                </div>
                
                {/* Stepper Indicator */}
                <div className='flex items-center gap-2 mb-2'>
                    {STEPS.map(step => (
                        <div 
                            key={step.id} 
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-500",
                                currentStep >= step.id ? "bg-primary" : "bg-slate-100"
                            )} 
                        />
                    ))}
                </div>
                <div className='flex justify-between px-1 text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                    <span>Giriş</span>
                    <span>Dil Ortamı</span>
                    <span>Okuryazarlık</span>
                    <span>Gözlemler</span>
                    <span>Bitti</span>
                </div>
            </DialogHeader>

            <Form {...form}>
            <form onSubmit={handleProtectedSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="max-h-[50vh] overflow-y-auto px-1 custom-scrollbar"
                    >
                        {currentStep === 1 && (
                            <div className='space-y-6'>
                                <div className='flex items-center gap-3 bg-primary/5 p-4 rounded-2xl mb-4'>
                                    <div className='bg-primary/10 p-2 rounded-xl'>
                                        <ChevronRight className='w-5 h-5 text-primary' />
                                    </div>
                                    <p className='text-sm font-bold text-primary'>Bölüm 1 – Temel Bilgiler</p>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold text-slate-700'>Çocuğun İsmi</FormLabel>
                                        <FormControl><Input placeholder="Örn: Ayşe" className='h-12 rounded-xl border-slate-200' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )} />
                                    
                                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold text-slate-700'>Doğum Tarihi</FormLabel>
                                        <FormControl><Input type="date" className='h-12 rounded-xl border-slate-200' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )} />

                                    <FormField control={form.control} name="countryOfResidence" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold text-slate-700'>Yaşadığı Ülke / Detaylar</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örnek: İsviçre'de yaşıyoruz, orada doğdu" className='h-12 rounded-xl border-slate-200' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className='space-y-6'>
                                <div className='flex items-center gap-3 bg-orange-50 p-4 rounded-2xl mb-4'>
                                    <div className='bg-orange-100 p-2 rounded-xl'>
                                        <ChevronRight className='w-5 h-5 text-orange-600' />
                                    </div>
                                    <p className='text-sm font-bold text-orange-700'>Bölüm 2 – Dil Ortamı</p>
                                </div>
                                <FormField control={form.control} name="parentTongues" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold text-slate-700'>Ebeveynler hangi dilleri konuşuyor?</FormLabel>
                                        <FormControl><Input placeholder="Örn: Türkçe ve Almanca" className='h-12 rounded-xl border-slate-200' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="schoolLanguage" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold text-slate-700'>Çocuğun okul dili nedir?</FormLabel>
                                        <FormControl><Input placeholder="Örn: İngilizce" className='h-12 rounded-xl border-slate-200' {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className='p-4 bg-slate-50 rounded-2xl space-y-4'>
                                    <FormField control={form.control} name="homeLanguageTurkishPercentage" render={({ field }) => (
                                        <FormItem>
                                            <div className='flex justify-between items-center mb-2'>
                                                <FormLabel className='font-bold text-slate-700'>Evde Türkçe Kullanım Oranı</FormLabel>
                                                <Badge className='bg-primary text-white pointer-events-none'>%{field.value}</Badge>
                                            </div>
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
                                </div>
                                <FormField control={form.control} name="turkishExposureIntensity" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className='font-bold text-slate-700'>Türkçe Maruziyet Yoğunluğu</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-2">
                                                {['low', 'medium', 'high'].map((val) => (
                                                    <FormItem key={val} className="flex-1">
                                                        <FormControl>
                                                            <RadioGroupItem value={val} className="peer sr-only" />
                                                        </FormControl>
                                                        <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                                            <span className='font-bold text-sm'>{val === 'low' ? 'Düşük' : val === 'medium' ? 'Orta' : 'Yüksek'}</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className='space-y-6'>
                                <div className='flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl mb-4'>
                                    <div className='bg-emerald-100 p-2 rounded-xl'>
                                        <ChevronRight className='w-5 h-5 text-emerald-600' />
                                    </div>
                                    <p className='text-sm font-bold text-emerald-700'>Bölüm 3 – Okuryazarlık</p>
                                </div>
                                <FormField control={form.control} name="schoolLiteracyStatus" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className='font-bold text-slate-700'>Öğrencinin okuldaki okuma/yazma durumu</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-2">
                                                {[
                                                    { id: 'not-yet', label: 'Henüz öğrenmedi' },
                                                    { id: 'in-progress', label: 'Devam ediyor' },
                                                    { id: 'fluent', label: 'Akıcı okuyup yazıyor' }
                                                ].map((opt) => (
                                                    <FormItem key={opt.id}>
                                                        <FormControl><RadioGroupItem value={opt.id} className="peer sr-only" /></FormControl>
                                                        <FormLabel className="flex items-center gap-3 rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-all font-bold text-sm">
                                                            <div className={cn("w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center peer-data-[state=checked]:border-emerald-500")}>
                                                                {field.value === opt.id && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                                            </div>
                                                            {opt.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="turkishLiteracyLevel" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className='font-bold text-slate-700'>Çocuğun Türkçe okuma/yazma düzeyi</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'none', label: 'Hiç yok' },
                                                    { id: 'word-sentence', label: 'Kelime/Cümle' },
                                                    { id: 'reads-short-writes', label: 'Kısa Yazma' },
                                                    { id: 'fluent', label: 'Akıcı' }
                                                ].map((opt) => (
                                                    <FormItem key={opt.id}>
                                                        <FormControl><RadioGroupItem value={opt.id} className="peer sr-only" /></FormControl>
                                                        <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all font-bold text-xs text-center h-full">
                                                            {opt.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className='space-y-6'>
                                <div className='flex items-center gap-3 bg-purple-50 p-4 rounded-2xl mb-4'>
                                    <div className='bg-purple-100 p-2 rounded-xl'>
                                        <ChevronRight className='w-5 h-5 text-purple-600' />
                                    </div>
                                    <p className='text-sm font-bold text-purple-700'>Bölüm 4 – Türkçe ile İlgili Gözlemleriniz</p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="turkishDifficulties"
                                    render={() => (
                                    <FormItem>
                                        <FormDescription className='font-medium text-slate-500 mb-4'>Zorlanılan alanları seçiniz (Birden fazla seçilebilir):</FormDescription>
                                        <div className="grid grid-cols-2 gap-3">
                                        {difficulties.map((item) => (
                                            <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="turkishDifficulties"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), item.id])
                                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-bold text-sm text-slate-700 cursor-pointer">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                            />
                                        ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        {currentStep === 5 && (
                            <div className='space-y-6'>
                                <div className='flex items-center gap-3 bg-blue-50 p-4 rounded-2xl mb-4'>
                                    <div className='bg-blue-100 p-2 rounded-xl'>
                                        <Check className='w-5 h-5 text-blue-600' />
                                    </div>
                                    <p className='text-sm font-bold text-blue-700'>Bölüm 5 – Bilgileri Kontrol Edin</p>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='bg-slate-50 p-4 rounded-2xl'>
                                        <p className='text-[10px] font-black text-slate-400 uppercase mb-1'>Öğrenci</p>
                                        <p className='font-bold text-slate-900'>{form.getValues('firstName')}</p>
                                    </div>
                                    <div className='bg-slate-50 p-4 rounded-2xl'>
                                        <p className='text-[10px] font-black text-slate-400 uppercase mb-1'>Dil Ortamı</p>
                                        <p className='font-bold text-slate-900'>%{form.getValues('homeLanguageTurkishPercentage')} Türkçe</p>
                                    </div>
                                </div>
                                <p className='text-sm text-center text-slate-500 font-medium px-4'>
                                    Tüm bilgiler doğruysa "Kaydet" butonuyla işlemi tamamlayabilirsiniz.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <DialogFooter className='border-t pt-6 mt-6 flex-row justify-between gap-4 sm:justify-between h-20 items-center'>
                    <div className='flex gap-4 w-full'>
                        {currentStep > 1 && (
                            <Button type="button" variant="outline" className='rounded-2xl font-bold flex-1 h-12' onClick={handleBack}>
                                <ArrowLeft className='w-4 h-4 mr-2'/> Geri
                            </Button>
                        )}
                        
                        {currentStep < 5 ? (
                            <Button type="button" className='rounded-2xl font-bold flex-1 h-12 ml-auto sm:ml-0' onClick={handleNext}>
                                İleri <ArrowRight className='w-4 h-4 ml-2'/>
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting} className='rounded-2xl font-bold flex-1 h-12 shadow-lg shadow-primary/20'>
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Kaydediliyor...</>
                                ) : (
                                    <><Check className='w-5 h-5 mr-2'/> {isEditMode ? 'Güncelle' : 'Kaydet'}</>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </form>
            </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
