
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
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
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
  schoolLiteracyStatus: z.enum(["not-yet", "in-progress", "fluent"], {
    required_error: "Lütfen birini seçin.",
  }),
  turkishLiteracyLevel: z.enum(["none", "word-sentence", "reads-short-writes", "fluent"], {
    required_error: "Lütfen birini seçin.",
  }),
  turkishDifficulties: z.array(z.string()).optional(),
});

type AddChildFormValues = z.infer<typeof formSchema>;

export function AddChildForm({ userId, onChildAdded }: { userId: string, onChildAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const form = useForm<AddChildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      dateOfBirth: '',
      countryOfResidence: '',
      parentTongues: '',
      schoolLanguage: '',
      turkishDifficulties: [],
    },
  });

  const onSubmit = async (values: AddChildFormValues) => {
    if (!db) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'users', userId, 'children'), {
        ...values,
        dateOfBirth: format(new Date(values.dateOfBirth), "yyyy-MM-dd"),
        userId: userId,
        rozet: 0,
        completedTopics: [],
        remainingLessons: 0,
        assignedPackage: null,
        assignedPackageName: null,
        level: 'beginner', // Default level
      });

      toast({
        title: 'Başarılı!',
        description: `${values.firstName} eklendi.`,
      });
      onChildAdded(); // Refetch children list in parent component
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Çocuk eklenirken bir sorun oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Çocuk Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Çocuk Ekle</DialogTitle>
          <DialogDescription>
            Çocuğunuzun Türkçe öğrenme yolculuğu için gerekli bilgileri girin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-h-[70vh] overflow-y-auto p-1 pr-4">
            
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
            <div className='space-y-4 p-4 border rounded-lg'>
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
            </div>

            {/* Bölüm 3 */}
            <div className='space-y-6 p-4 border rounded-lg'>
                <h3 className='font-semibold text-lg'>Bölüm 3 – Okuryazarlık</h3>
                <FormField control={form.control} name="schoolLiteracyStatus" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Öğrencinin okuldaki okuma/yazma durumu</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
                 <FormField control={form.control} name="turkishDifficulties" render={() => (
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
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
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
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                 )} />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Çocuğu Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
