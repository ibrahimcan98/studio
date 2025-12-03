

'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format, differenceInYears } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
    User as UserIcon,
    Globe,
    GraduationCap,
    BrainCircuit,
    Star,
    Cloudy,
    Target,
    Smile,
    Meh,
    Frown,
    TrendingDown,
    TrendingUp,
    Minus,
    Award,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { COURSES } from '@/data/courses';
import { Textarea } from '../ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"


const difficultiesMap: { [key: string]: string } = {
    "kelime": "Kelime",
    "cumle": "Cümle",
    "anlama": "Anlama",
    "okuma": "Okuma",
    "yazma": "Yazma",
    "ifade": "Kendini ifade",
    "motivasyon": "Motivasyon",
    "ingilizce-karistirma": "İngilizce karıştırma"
};


const COLORS = ['#4FC3F7', '#FF8A65', '#E0E0E0'];

const cefrLevels = ['preA1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const cefrScoreMapping: { [key: string]: number } = {
    'preA1': 0, 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 5
};

const tutumMap: { [key: string]: { emoji: React.ReactNode, label: string } } = {
    positive: { emoji: <Smile className="w-7 h-7" />, label: 'Olumlu' },
    neutral: { emoji: <Meh className="w-7 h-7" />, label: 'Nötr' },
    shy: { emoji: <Frown className="w-7 h-7" />, label: 'Çekingen' }
};

const dilKaristirmaMap: { [key: string]: { icon: React.ReactNode, label: string, color: string } } = {
    always: { icon: <TrendingDown />, label: 'Her zaman', color: 'text-red-500' },
    sometimes: { icon: <TrendingDown />, label: 'Ara sıra', color: 'text-orange-500' },
    rarely: { icon: <Minus />, label: 'Nadiren', color: 'text-gray-500' },
    never: { icon: <TrendingUp />, label: 'Hiçbir zaman', color: 'text-green-500' }
};

const summarySkills = [
    { id: 'dinleme', label: 'Dinleme' },
    { id: 'tutum', label: 'Tutum' },
    { id: 'motivasyon', label: 'Motivasyon' },
    { id: 'konusma', label: 'Konuşma akıcılığı' },
    { id: 'okuryazarlik', label: 'Okuryazarlık' },
    { id: 'maruziyet', label: 'Türkçe maruziyet' },
];

interface Feedback {
    id: string;
    text: string;
    createdAt: string;
}

export function ProgressPanel({ child, isEditable = false }: { child: any, isEditable?: boolean }) {
    const { toast } = useToast();
    const db = useFirestore();
    const [isSaving, setIsSaving] = useState(false);
    
    // State for editable fields
    const [cefrProfile, setCefrProfile] = useState(child.cefrProfile || { listening: 'preA1', speaking: 'preA1', reading: 'preA1', writing: 'preA1' });
    const [speakingInitiative, setSpeakingInitiative] = useState(child.speakingInitiative || 0);
    const [attitude, setAttitude] = useState(child.attitude || 'neutral');
    const [languageMixing, setLanguageMixing] = useState(child.languageMixing || 'rarely');
    const [strengths, setStrengths] = useState<string[]>(child.strengths || []);
    const [weaknesses, setWeaknesses] = useState<string[]>(child.weaknesses || []);
    const [recommendedCourse, setRecommendedCourse] = useState(child.recommendedCourse || '');
    const [newFeedback, setNewFeedback] = useState("");
    const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>(child.feedbackHistory || []);
    const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);


    useEffect(() => {
        setCefrProfile(child.cefrProfile || { listening: 'preA1', speaking: 'preA1', reading: 'preA1', writing: 'preA1' });
        setSpeakingInitiative(child.speakingInitiative || 0);
        setAttitude(child.attitude || 'neutral');
        setLanguageMixing(child.languageMixing || 'rarely');
        setStrengths(child.strengths || []);
        setWeaknesses(child.weaknesses || []);
        setRecommendedCourse(child.recommendedCourse || '');
        setFeedbackHistory(child.feedbackHistory || []);
        setNewFeedback("");
    }, [child]);


    const handleCefrChange = (skill: string, value: string) => {
        setCefrProfile((prev: any) => ({ ...prev, [skill]: value }));
    };
    
    const handleSummaryClick = (skillId: string, type: 'strength' | 'weakness') => {
        if (!isEditable) return;
        const totalSelected = strengths.length + weaknesses.length;
        const isStrength = strengths.includes(skillId);
        const isWeakness = weaknesses.includes(skillId);

        if (type === 'strength') {
            if (isStrength) {
                setStrengths(prev => prev.filter(s => s !== skillId));
            } else if (!isWeakness && totalSelected < 6) {
                setStrengths(prev => [...prev, skillId]);
            }
        } else if (type === 'weakness') {
            if (isWeakness) {
                setWeaknesses(prev => prev.filter(w => w !== skillId));
            } else if (!isStrength && totalSelected < 6) {
                setWeaknesses(prev => [...prev, skillId]);
            }
        }
    };


    const handleSave = async () => {
        if (!db || !child) return;
        setIsSaving(true);
        const childDocRef = doc(db, 'users', child.userId, 'children', child.id);
        
        let updatedFeedbackHistory = [...feedbackHistory];

        // Handle editing existing feedback
        if (editingFeedback) {
            updatedFeedbackHistory = updatedFeedbackHistory.map(fb =>
                fb.id === editingFeedback.id ? { ...fb, text: editingFeedback.text } : fb
            );
        }

        const updatedData: any = {
            cefrProfile,
            speakingInitiative,
            attitude,
            languageMixing,
            strengths,
            weaknesses,
            recommendedCourse,
            feedbackHistory: updatedFeedbackHistory,
        };

        if (newFeedback.trim() !== "") {
             const feedbackEntry = {
                id: Date.now().toString(),
                text: newFeedback,
                createdAt: new Date().toISOString()
            };
            updatedData.feedbackHistory.push(feedbackEntry);
        }

        updateDoc(childDocRef, updatedData)
            .then(() => {
                toast({
                    title: 'Kaydedildi',
                    description: `${child.firstName} için ilerleme paneli güncellendi.`,
                    className: 'bg-green-500 text-white'
                });
                setFeedbackHistory(updatedData.feedbackHistory);
                setNewFeedback("");
                setEditingFeedback(null);
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: childDocRef.path,
                    operation: 'update',
                    requestResourceData: updatedData,
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const dateOfBirth = child.dateOfBirth ? new Date(child.dateOfBirth) : null;
    const age = dateOfBirth ? differenceInYears(new Date(), dateOfBirth) : 'N/A';

    const homeLanguagePieData = useMemo(() => {
        const turkishPercentage = child.homeLanguageTurkishPercentage || 0;
        return [
            { name: 'Türkçe', value: turkishPercentage },
            { name: 'Diğer Diller', value: 100 - turkishPercentage }
        ];
    }, [child.homeLanguageTurkishPercentage]);

    const exposureMap: { [key: string]: { dots: string; label: string } } = {
        low: { dots: "●○○", label: "Düşük" },
        medium: { dots: "●●○", label: "Orta" },
        high: { dots: "●●●", label: "Yüksek" },
    };
    const exposureInfo = exposureMap[child.turkishExposureIntensity] || exposureMap.low;
    
    const sortedFeedback = useMemo(() => {
        if (!feedbackHistory || feedbackHistory.length === 0) return [];
        return [...feedbackHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [feedbackHistory]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4 h-full overflow-y-auto pr-4 font-body">
            
            <div className='lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card className="w-full col-span-1 rounded-2xl bg-[#E3F2FD] border-blue-200">
                    <CardHeader className="flex-row items-center justify-center gap-3 space-y-0">
                        <UserIcon className="w-6 h-6 text-blue-500" />
                        <CardTitle className="text-lg text-blue-900">Profil Kartı</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 text-4xl mb-3">
                            <AvatarFallback className="bg-blue-200 text-blue-700 font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-bold text-xl text-gray-800">{child.firstName}</p>
                        <p className="text-sm text-gray-600">ID: {child.id.substring(0, 6).toUpperCase()}</p>
                         <div className="text-sm mt-2 text-gray-500 flex flex-col items-center">
                            <span>{age} yaş</span>
                            <span>{child.countryOfResidence.split(',')[0]}</span>
                            <span>Okul Dili: {child.schoolLanguage}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 rounded-2xl bg-[#FFF3E0] border-orange-200">
                    <CardHeader className="flex-row items-center gap-3 space-y-0">
                        <Globe className="w-6 h-6 text-orange-500" />
                        <CardTitle className="text-lg text-orange-900">Dil Ortamı</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-gray-700">Evde Dil Kullanımı</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={homeLanguagePieData} cx="50%" cy="50%" innerRadius={12} outerRadius={20} dataKey="value" paddingAngle={3}>
                                                {homeLanguagePieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-xs space-y-1">
                                    {homeLanguagePieData.map((entry, index) => (
                                        <p key={index} className="flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            %{entry.value} {entry.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-1 text-gray-700">Türkçe Maruziyet Yoğunluğu</h4>
                            <div className="flex items-center gap-2 text-sm"><span className="text-lg font-mono text-orange-500">{exposureInfo.dots}</span> <span className='text-gray-600'>{exposureInfo.label}</span></div>
                        </div>
                        <div className="pt-2">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-700"><UserIcon className="w-4 h-4" />Veli Bildirimi – Zorlanma Alanları</h4>
                            <div className="flex flex-wrap gap-2">
                                {child.turkishDifficulties?.length > 0 ? child.turkishDifficulties.map((d: string) => <Badge key={d} variant="secondary" className="bg-green-100 text-green-800 border border-green-200">{difficultiesMap[d] || d}</Badge>) : <p className="text-xs text-muted-foreground">Belirtilmedi.</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 rounded-2xl bg-[#E8F5E9] border-green-200">
                    <CardHeader className="flex-row items-center gap-3 space-y-0">
                        <GraduationCap className="w-6 h-6 text-green-500" />
                        <CardTitle className="text-lg text-green-900">CEFR Profili</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {Object.entries({ listening: 'Dinleme', speaking: 'Konuşma', reading: 'Okuma', writing: 'Yazma' }).map(([skill, label]) => {
                            const level = cefrProfile[skill] || 'preA1';
                            const score = cefrScoreMapping[level] || 0;
                            const isC2 = level === 'C2';
                            return (
                                <div key={skill} className="grid grid-cols-[auto_90px_1fr] items-center gap-x-3">
                                    <span className="capitalize text-sm font-medium text-gray-700">{label}</span>
                                    {isEditable ? (
                                        <Select value={level} onValueChange={(value) => handleCefrChange(skill, value)}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Seviye" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cefrLevels.map(l => <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant="secondary" className='justify-center'>{level.toUpperCase()}</Badge>
                                    )}
                                    <div className="flex gap-1 items-center">
                                        {[...Array(5)].map((_, i) => (
                                            isC2 ? (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            ) : (
                                                <div key={i} className={`w-3.5 h-3.5 rounded-full ${i < score ? 'bg-primary' : 'bg-green-200'}`}></div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-1 rounded-2xl bg-[#FFFDE7] border-yellow-200">
                    <CardHeader className="flex-row items-center gap-3 space-y-0">
                        <BrainCircuit className="w-6 h-6 text-yellow-600" />
                        <CardTitle className="text-lg text-yellow-900">Dil Davranışı</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Konuşma İnisiyatifi: {speakingInitiative}%</h4>
                            <Slider value={[speakingInitiative]} onValueChange={(value) => setSpeakingInitiative(value[0])} max={100} step={10} disabled={!isEditable} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700">Tutum</h4>
                            <div className="flex gap-4">
                                {Object.entries(tutumMap).map(([key, value]) => (
                                    <motion.div 
                                        key={key} 
                                        whileHover={isEditable ? { scale: 1.1 } : {}}
                                        className={cn(
                                            "flex flex-col items-center gap-1 transition-colors",
                                            isEditable && 'cursor-pointer',
                                            attitude === key ? 'text-green-600' : 'text-gray-400',
                                            isEditable && 'hover:text-gray-600',
                                        )}
                                        onClick={() => isEditable && setAttitude(key)}
                                    >
                                        {value.emoji}
                                        <span className={`text-xs font-medium`}>{value.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Dil Karıştırma</h4>
                            <div className='flex items-center justify-around'>
                                {Object.entries(dilKaristirmaMap).map(([key, value]) => (
                                    <motion.div 
                                        key={key} 
                                        whileHover={isEditable ? { scale: 1.1 } : {}} 
                                        className={cn("flex flex-col items-center gap-1", isEditable && "cursor-pointer", languageMixing === key ? value.color : 'text-gray-400')}
                                        onClick={() => isEditable && setLanguageMixing(key)}
                                    >
                                        <div className='w-8 h-8 flex items-center justify-center'>{value.icon}</div>
                                        <span className='text-xs font-medium'>{value.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 rounded-2xl bg-[#F3E5F5] border-purple-200">
                    <CardHeader className="flex-row items-center gap-3 space-y-0">
                        <Award className="w-6 h-6 text-purple-500" />
                        <CardTitle className="text-lg text-purple-900">Öğrenme Profili Özeti</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                <Star className="w-5 h-5 text-green-500 fill-green-500" />
                                Güçlü Alanlar
                                {isEditable && <span className="text-xs text-muted-foreground">({strengths.length}/6)</span>}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {summarySkills.map(skill => (
                                    <Badge
                                        key={skill.id}
                                        onClick={() => handleSummaryClick(skill.id, 'strength')}
                                        className={cn(
                                            'transition-all',
                                            isEditable ? 'cursor-pointer' : 'cursor-default',
                                            strengths.includes(skill.id) 
                                                ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' 
                                                : (weaknesses.includes(skill.id) || (!isEditable && !strengths.includes(skill.id)) ? 'bg-gray-200 text-gray-400 border-transparent' + (isEditable && !weaknesses.includes(skill.id) ? ' cursor-not-allowed' : '') : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200')
                                        )}
                                    >
                                        {skill.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                <Cloudy className="w-5 h-5 text-orange-500" />
                                Gelişime Açık Alanlar
                                {isEditable && <span className="text-xs text-muted-foreground">({weaknesses.length}/6)</span>}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {summarySkills.map(skill => (
                                    <Badge
                                        key={skill.id}
                                        onClick={() => handleSummaryClick(skill.id, 'weakness')}
                                        className={cn(
                                            'transition-all',
                                            isEditable ? 'cursor-pointer' : 'cursor-default',
                                            weaknesses.includes(skill.id) 
                                                ? 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200' 
                                                : (strengths.includes(skill.id) || (!isEditable && !weaknesses.includes(skill.id)) ? 'bg-gray-200 text-gray-400 border-transparent' + (isEditable && !strengths.includes(skill.id) ? ' cursor-not-allowed' : '') : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200')
                                        )}
                                    >
                                        {skill.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="sm:col-span-2 mt-4">
                            <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Target className="w-5 h-5 text-red-500" />Önerilen Kurs</h4>
                            {isEditable ? (
                                <Select value={recommendedCourse} onValueChange={setRecommendedCourse}>
                                    <SelectTrigger className="w-full sm:w-[250px]">
                                        <SelectValue placeholder="Kurs Seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COURSES.map(course => (
                                            <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className='font-semibold text-gray-800'>{COURSES.find(c => c.id === recommendedCourse)?.title || 'Belirtilmedi'}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className='lg:col-span-3 space-y-4'>
                 <Separator />
                 <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2"><MessageSquare className="text-primary"/> Geri Bildirimler</h3>
                {sortedFeedback.length > 0 ? (
                     <Carousel className="w-full">
                        <CarouselContent className="-ml-4">
                            {sortedFeedback.map((fb, index) => (
                                <CarouselItem key={`${fb.id}-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                     <Dialog onOpenChange={(isOpen) => {
                                         if (!isOpen) {
                                             setEditingFeedback(null);
                                         }
                                     }}>
                                        <DialogTrigger asChild>
                                            <div className="p-1 h-full">
                                                <Card className="h-full cursor-pointer hover:bg-muted" onClick={() => setEditingFeedback(fb)}>
                                                    <CardContent className="flex flex-col gap-4 p-4">
                                                        <p className="text-sm text-muted-foreground flex-grow line-clamp-3">"{fb.text}"</p>
                                                        <span className="text-xs text-gray-400 self-end">{format(new Date(fb.createdAt), 'dd MMM yyyy, HH:mm', { locale: tr })}</span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Geri Bildirim Detayı</DialogTitle>
                                                 <DialogDescription>
                                                    {format(new Date(fb.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                                                </DialogDescription>
                                            </DialogHeader>
                                             {isEditable ? (
                                                <div className="py-4 space-y-2">
                                                    <Textarea
                                                        defaultValue={fb.text}
                                                        onChange={(e) => setEditingFeedback(prev => prev ? { ...prev, text: e.target.value } : null)}
                                                        rows={6}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="py-4">{fb.text}</p>
                                            )}
                                             {isEditable && (
                                                <DialogFooter>
                                                    <Button onClick={handleSave}>Değişiklikleri Kaydet</Button>
                                                </DialogFooter>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                ) : (
                    <p className='text-sm text-muted-foreground'>Henüz geri bildirim eklenmemiş.</p>
                )}


                {isEditable && (
                    <div className='space-y-2 pt-4'>
                        <h4 className="font-semibold text-gray-700">Yeni Geri Bildirim Ekle</h4>
                        <Textarea 
                            placeholder={`${child.firstName} ile ilgili gözlemleriniz...`}
                            value={newFeedback}
                            onChange={(e) => setNewFeedback(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {isEditable && (
                <div className="lg:col-span-3 flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                         {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Değişiklikleri Kaydet
                    </Button>
                </div>
            )}
        </div>
    );
}

