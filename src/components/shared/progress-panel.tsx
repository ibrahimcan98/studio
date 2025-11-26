
'use client';

import { useMemo } from 'react';
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
    Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


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

const cefrData = {
    listening: { level: 'A1', score: 2 },
    speaking: { level: 'PreA1', score: 1 },
    reading: { level: 'Ölçülmedi', score: 0 },
    writing: { level: '—', score: 0 },
};

export function ProgressPanel({ child }: { child: any }) {
    
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
    
     const tutumMap: { [key: string]: { emoji: React.ReactNode, label: string } } = {
        positive: { emoji: <Smile className="w-7 h-7 text-gray-500" />, label: 'Olumlu' },
        neutral: { emoji: <Meh className="w-7 h-7 text-gray-500" />, label: 'Nötr' },
        shy: { emoji: <Frown className="w-7 h-7 text-gray-500" />, label: 'Çekingen' }
    };
    
    const currentTutum = 'positive'; // This would be dynamic in a real scenario


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
                    {Object.entries(cefrData).map(([skill, data]) => (
                         <div key={skill} className="grid grid-cols-[1fr_1fr_auto] items-center gap-x-3">
                             <span className="capitalize text-sm font-medium text-gray-700">{skill}</span>
                             <span className="font-bold text-sm text-gray-600">{data.level}</span>
                             <div className="flex gap-1 items-center">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-4 h-4 rounded-sm ${i < data.score ? 'bg-primary' : 'bg-green-200'}`}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="col-span-1 rounded-2xl bg-[#FFFDE7] border-yellow-200">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <BrainCircuit className="w-6 h-6 text-yellow-600" />
                    <CardTitle className="text-lg text-yellow-900">Dil Davranışı</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700">Konuşma İnisiyatifi</h4>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-mono text-primary">(◐)</div>
                            <span className="font-bold text-lg">0%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                         <h4 className="text-sm font-semibold text-gray-700">Tutum</h4>
                         <div className="flex gap-4">
                             {Object.entries(tutumMap).map(([key, value]) => (
                                 <motion.div 
                                     key={key} 
                                     whileHover={{ scale: 1.1 }} 
                                     className={`flex flex-col items-center gap-1 cursor-pointer opacity-40`}
                                 >
                                     {value.emoji}
                                     <span className={`text-xs font-medium text-gray-500`}>{value.label}</span>
                                 </motion.div>
                             ))}
                         </div>
                     </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700">Dil Karıştırma</h4>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 rounded-2xl bg-[#F3E5F5] border-purple-200">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <Award className="w-6 h-6 text-purple-500" />
                    <CardTitle className="text-lg text-purple-900">Öğrenme Profil Özeti</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />Güçlü Alanlar</h4>
                        <div className="flex flex-col gap-2">
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Cloudy className="w-5 h-5 text-orange-500" />Gelişime Açık Alanlar</h4>
                        <div className="flex flex-col gap-2">
                        </div>
                    </div>
                    <div className="sm:col-span-2 mt-2">
                        <h4 className="font-semibold mb-2 text-gray-700 flex items-center gap-2"><Target className="w-5 h-5 text-red-500" />Önerilen Kurs</h4>
                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl bg-gray-50 border-gray-200">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <Milestone className="w-6 h-6 text-gray-500" />
                    <CardTitle className="text-lg text-gray-800">Geçmiş Değerlendirmeler</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div><span>12. Hafta Ara Değerlendirme</span> <span className='text-xs text-muted-foreground ml-auto'>12.06.2024</span></li>
                        <li className="flex items-center gap-3 text-sm"><div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div><span>6. Hafta Ara Değerlendirme</span> <span className='text-xs text-muted-foreground ml-auto'>01.05.2024</span></li>
                        <li className="flex items-center gap-3 text-sm"><div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div><span>İlk Deneme Dersi</span> <span className='text-xs text-muted-foreground ml-auto'>15.03.2024</span></li>
                    </ul>
                </CardContent>
            </Card>

        </div>
    );
}
