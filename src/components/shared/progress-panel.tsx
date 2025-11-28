
'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format, differenceInYears } from 'date-fns';
import {
    User as UserIcon,
    Globe,
    GraduationCap,
    BrainCircuit,
    Star,
    Cloudy,
    Target,
    Milestone,
    Smile,
    Meh,
    Frown,
    CheckCircle,
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
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';


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


export function ProgressPanel({ child }: { child: any }) {
    const { toast } = useToast();
    const db = useFirestore();
    const [isSaving, setIsSaving] = useState(false);
    
    // State for editable fields
    const [cefrProfile, setCefrProfile] = useState(child.cefrProfile || { listening: 'preA1', speaking: 'preA1', reading: 'preA1', writing: 'preA1' });
    const [speakingInitiative, setSpeakingInitiative] = useState(child.speakingInitiative || 0);
    const [attitude, setAttitude] = useState(child.attitude || 'neutral');
    const [languageMixing, setLanguageMixing] = useState(child.languageMixing || 'rarely');

    useEffect(() => {
        setCefrProfile(child.cefrProfile || { listening: 'preA1', speaking: 'preA1', reading: 'preA1', writing: 'preA1' });
        setSpeakingInitiative(child.speakingInitiative || 0);
        setAttitude(child.attitude || 'neutral');
        setLanguageMixing(child.languageMixing || 'rarely');
    }, [child]);


    const handleCefrChange = (skill: string, value: string) => {
        setCefrProfile((prev: any) => ({ ...prev, [skill]: value }));
    };
    
    const handleSave = async () => {
        if (!db || !child) return;
        setIsSaving(true);
        const childDocRef = doc(db, 'users', child.userId, 'children', child.id);
        
        try {
            await updateDoc(childDocRef, {
                cefrProfile,
                speakingInitiative,
                attitude,
                languageMixing
            });
            toast({
                title: 'Kaydedildi',
                description: `${child.firstName} için ilerleme paneli güncellendi.`,
                className: 'bg-green-500 text-white'
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Değişiklikler kaydedilirken bir sorun oluştu.'
            });
            console.error("Error updating progress panel:", error);
        } finally {
            setIsSaving(false);
        }
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
    

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 h-full overflow-y-auto pr-4 font-body">

            <Card className="col-span-1 rounded-2xl bg-[#E3F2FD] border-blue-200">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <UserIcon className="w-6 h-6 text-blue-500" />
                    <CardTitle className="text-lg text-blue-900">Profil Kartı</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 text-4xl mb-3">
                        <AvatarFallback className="bg-blue-200 text-blue-700 font-bold">{child.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-xl text-gray-800">{child.firstName}</p>
                    <p className="text-sm text-gray-600">ID: {child.id.substring(0, 6).toUpperCase()}</p>
                    <p className="text-sm mt-2 text-gray-500">{age} yaş • {child.countryOfResidence.split(',')[0]} • Okul Dili: {child.schoolLanguage}</p>
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
                                 <Select value={level} onValueChange={(value) => handleCefrChange(skill, value)}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Seviye" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cefrLevels.map(l => <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>)}
                                    </SelectContent>
                                </Select>
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

            <Card className="col-span-1 rounded-2xl bg-[#FFFDE7] border-yellow-200">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <BrainCircuit className="w-6 h-6 text-yellow-600" />
                    <CardTitle className="text-lg text-yellow-900">Dil Davranışı</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Konuşma İnisiyatifi: {speakingInitiative}%</h4>
                        <Slider value={[speakingInitiative]} onValueChange={(value) => setSpeakingInitiative(value[0])} max={100} step={10} />
                    </div>
                    <div className="space-y-2">
                         <h4 className="text-sm font-semibold text-gray-700">Tutum</h4>
                         <div className="flex gap-4">
                             {Object.entries(tutumMap).map(([key, value]) => (
                                 <motion.div 
                                     key={key} 
                                     whileHover={{ scale: 1.1 }} 
                                     className={cn(
                                        "flex flex-col items-center gap-1 cursor-pointer transition-colors",
                                        attitude === key ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                                     )}
                                     onClick={() => setAttitude(key)}
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
                                     whileHover={{ scale: 1.1 }} 
                                     className={cn("flex flex-col items-center gap-1 cursor-pointer", languageMixing === key ? value.color : 'text-gray-400')}
                                     onClick={() => setLanguageMixing(key)}
                                 >
                                    <div className='w-8 h-8 flex items-center justify-center'>{value.icon}</div>
                                    <span className='text-xs font-medium'>{value.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 rounded-2xl bg-[#F3E5F5] border-purple-200">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <Award className="w-6 h-6 text-purple-500" />
                    <CardTitle className="text-lg text-purple-900">Öğrenme Profili Özeti</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />Güçlü Alanlar</h4>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Cloudy className="w-5 h-5 text-orange-500" />Gelişime Açık Alanlar</h4>
                    </div>
                    <div className="sm:col-span-2 mt-2">
                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Target className="w-5 h-5 text-red-500" />Önerilen Kurs</h4>
                    </div>
                </CardContent>
            </Card>
            
            <div className="lg:col-span-3 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                     {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Değişiklikleri Kaydet
                </Button>
            </div>
        </div>
    );
}
