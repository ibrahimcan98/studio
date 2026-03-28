

export type AcademicStep = {
    id: string;
    title: string;
    color: string;
    gains: string[];
};

export type Course = {
    id: string;
    title: string;
    ageGroup: string;
    shortDescription: string;
    cta: {
        backgroundColor: string;
        iconBgColor: string;
        iconTextColor: string;
        badgeColor: string;
        badgeTextColor: string;
        linkTextColor: string;
    };
    details: {
        duration: string;
        gains: string[];
        longDescription?: string;
    };
    academicSteps?: AcademicStep[];
    pricing: {
        perLesson: {
            '4'?: number;
            '8'?: number;
            '12'?: number;
            '24'?: number;
        },
        packages: {
            lessons: number;
            price: number;
        }[];
    };
};

export const COURSES: Course[] = [
    {
        id: "baslangic",
        title: "Başlangıç Kursu (Pre A1)",
        ageGroup: "3-4 yaş",
        shortDescription: "Türkçeyle güvenli bir ilk bağ kurarak, çocuğun dili anlamaya ve fark etmeye başlamasını sağlar.",
        cta: {
            backgroundColor: "bg-[#FFF8E7]",
            iconBgColor: "bg-yellow-100",
            iconTextColor: "text-yellow-500",
            badgeColor: "bg-[#FFD166]",
            badgeTextColor: "text-gray-800",
            linkTextColor: "text-orange-500",
        },
        details: {
            duration: "20 dakika",
            gains: [
                "Türkçeyi duyduğunda temel anlamları fark etmeye başlar",
                "Günlük kelimeleri görsel ve bağlamla eşleştirir",
                "Basit yönergeleri anlar ve takip eder",
                "Kısa ifadelerle kendini ifade etmeye başlar",
                "Türkçeyle pozitif bağ, güven ve aidiyet geliştirir"
            ],
            longDescription: "Çocuğun Türkçeyle güvenli ve doğal bir bağ kurmasını hedefler."
        },
        pricing: {
            perLesson: { '4': 27, '8': 26, '12': 24, '24': 23 },
            packages: [
                { lessons: 4, price: 108 },
                { lessons: 8, price: 208 },
                { lessons: 12, price: 288 },
                { lessons: 24, price: 552 },
            ],
        },
    },
    {
        id: "konusma",
        title: "Konuşma Kursu (A1)",
        ageGroup: "Okul öncesi ve ilkokulun ilk yılları",
        shortDescription: "Çocuğun Türkçeyi kısa cümleler ve günlük konuşmalarla aktif olarak kullanmasını destekler.",
        cta: {
            backgroundColor: "bg-[#FFF0CC]",
            iconBgColor: "bg-teal-100",
            iconTextColor: "text-teal-500",
            badgeColor: "bg-orange-400",
            badgeTextColor: "text-gray-800",
            linkTextColor: "text-orange-500",
        },
        details: {
            duration: "30 dakika",
             gains: [
                "Günlük konularda kısa cümlelerle konuşur",
                "Basit sorular sorar ve cevaplar",
                "Tematik kelimeleri doğru bağlamda kullanır",
                "Günlük diyaloglara katılır",
                "Kültürel konular hakkında kısa anlatımlar yapar",
            ],
            longDescription: "Türkçeyi aktif iletişim aracı olarak kullanmayı hedefler."
        },
        pricing: {
            perLesson: { '4': 41, '8': 39, '12': 36, '24': 34 },
            packages: [
                { lessons: 4, price: 164 },
                { lessons: 8, price: 312 },
                { lessons: 12, price: 432 },
                { lessons: 24, price: 816 },
            ],
        },
    },
     {
        id: "akademik",
        title: "Akademik Kurs (A2)",
        ageGroup: "İlkokul ve ortaokul",
        shortDescription: "Okuma, yazma ve metin anlama becerilerini geliştirerek akademik Türkçenin temellerini oluşturur.",
        cta: { 
            backgroundColor: "bg-[#D4EDE3]",
            iconBgColor: "bg-green-100",
            iconTextColor: "text-green-500",
            badgeColor: "bg-transparent",
            badgeTextColor: "text-gray-800",
            linkTextColor: "text-orange-500",
        },
        details: {
            duration: "45 dakika",
            gains: [
                 "Metinleri anlayıp ana fikri belirler",
                "Paragraf düzeyinde yazılar yazar",
                "Olay sırası ve sebep sonuç ilişkisi kurar",
                "Farklı metin türlerini tanır ve kullanır",
                "Dil bilgisi yapılarını işlevsel biçimde uygular",
            ],
             longDescription: "Okuma, yazma ve akademik dil becerilerinin temellerini atar."
        },
        academicSteps: [
            {
                id: "akademik-1",
                title: "1. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Okuma ve yazmaya yönelik temel farkındalık kazanır.",
                    "Kısa ve basit metinleri anlayarak okur.",
                    "Okuduklarından temel anlam çıkarır.",
                    "Basit cümleler yazar ve düşüncelerini yazılı olarak ifade etmeye başlar.",
                    "Kelime bilgisi ve cümle yapısını doğru bağlamda kullanır.",
                ],
            },
            {
                id: "akademik-2",
                title: "2. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Metinlerin ana fikrini ve temel detaylarını ayırt eder.",
                    "Olay sırasını takip eder ve aktarır.",
                    "Paragraf düzeyinde kısa metinler yazar.",
                    "Görsellerden hareketle yazılı anlatım oluşturur.",
                    "Temel dil bilgisi yapılarını işlevsel şekilde kullanır.",
                ],
            },
             {
                id: "akademik-3",
                title: "3. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Farklı metin türlerini tanır ve ayırt eder.",
                    "Okuduklarından çıkarım yapar.",
                    "Sebep sonuç ve karşılaştırma ilişkileri kurar.",
                    "Daha uzun ve yapılandırılmış metinler yazar.",
                    "Yazdıklarını gözden geçirerek düzenler.",
                ],
            },
            {
                id: "akademik-4",
                title: "4. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Bilgilendirici ve açıklayıcı metinleri anlar.",
                    "Metinlerde ana fikir, yardımcı fikir ve çıkarım yapar.",
                    "Akademik dil yapılarını doğru şekilde kullanır.",
                    "Görüş bildiren ve bilgi veren metinler yazar.",
                    "Türkçeyi akademik bağlamda güvenle kullanır.",
                ],
            },
        ],
        pricing: {
            perLesson: { '4': 63, '8': 60, '12': 55, '24': 51 },
            packages: [
                { lessons: 4, price: 252 },
                { lessons: 8, price: 480 },
                { lessons: 12, price: 660 },
                { lessons: 24, price: 1224 },
            ],
        },
    },
    {
        id: "gelisim",
        title: "Gelişim Kursu (B1)",
        ageGroup: "Ortaokul",
        shortDescription: "Türkçeyi sadece konuşma dili değil, öğrenme ve düşünme aracı olarak kullanmayı hedefler.",
        cta: { 
            backgroundColor: "bg-[#F0FAF8]",
            iconBgColor: "bg-gray-200",
            iconTextColor: "text-gray-500",
            badgeColor: "bg-[#86E3FC]",
            badgeTextColor: "text-cyan-900",
            linkTextColor: "text-orange-500",
        },
        details: {
            duration: "45 dakika",
             gains: [
                "Fen, kültür ve dünya bilgisi içeriklerini Türkçe öğrenir",
                "Bilgi metinlerinden çıkarım yapar",
                "Karşılaştırma ve açıklama yapar",
                "Kısa araştırmalar ve sunumlar hazırlar",
                "Dil, kültür ve kimlik arasında bilinçli bağlar kurar."
            ],
            longDescription: "Türkçeyi içerik öğrenme ve düşünme dili olarak kullanmayı hedefler."
        },
        pricing: {
             perLesson: { '4': 63, '8': 60, '12': 55, '24': 51 },
            packages: [
                { lessons: 4, price: 252 },
                { lessons: 8, price: 480 },
                { lessons: 12, price: 660 },
                { lessons: 24, price: 1224 },
            ],
        },
    },
    {
        id: "gcse",
        title: "GCSE Türkçe Kursu",
        ageGroup: "Ortaokul – Lise (GCSE adayları)",
        shortDescription: "Öğrenciyi GCSE Türkçe sınavının konuşma, yazma, dinleme ve okuma gerekliliklerine sistemli ve sınav odaklı şekilde hazırlar.",
        cta: {
            backgroundColor: "bg-blue-100",
            iconBgColor: "bg-blue-200",
            iconTextColor: "text-blue-600",
            badgeColor: "bg-blue-500",
            badgeTextColor: "text-white",
            linkTextColor: "text-blue-600",
        },
        details: {
            duration: "50 dakika",
            longDescription: "Bu kursu tamamlayan öğrenciler, GCSE Türkçe sınavında yer alan dinleme, okuma, yazma ve konuşma becerilerini sınav formatına uygun şekilde geliştirir. Sınavda karşılaşabilecekleri metinleri anlayabilir, ana fikir ve detayları ayırt edebilir, metinlerden çıkarım yapabilir. Yazılı bölümlerde sınav kriterlerine uygun, yapılandırılmış ve anlamlı cevaplar üretir; konuşma sınavında ise kendini açık, akıcı ve tutarlı biçimde ifade edebilir.\n\nÖğrenciler, GCSE’ye özgü soru türlerini tanır, doğru stratejilerle cevaplama becerisi kazanır ve zaman yönetimini etkin şekilde kullanmayı öğrenir. Kelime bilgisi ve dil bilgisi yapılarını sınav bağlamında işlevsel olarak kullanır; karşılaştırma, açıklama ve gerekçelendirme gibi akademik dil becerilerini geliştirir. Günlük yaşam, kültür ve toplumsal konular hakkında görüş bildirebilir, kısa sunumlar ve yapılandırılmış konuşmalar yapabilir. Kurs süresince Türkçeyi yalnızca sınav için değil, akademik ve iletişimsel bir dil olarak güvenle kullanma yetkinliği kazanır.",
            gains: [
                "Dinleme ve okuma metinlerinden ana fikir ve detay bilgileri ayırt eder, metinlerde verilen tutum, duygu ve görüşleri doğru şekilde yorumlar.",
                "Günlük ve akademik konularda düşüncelerini açık, tutarlı ve akıcı biçimde sözlü olarak ifade eder.",
                "Yazılı anlatımda farklı cümle yapıları ve kelime türlerini kullanarak anlam tekrarından kaçınır.",
                "Soyut kavramları (duygu, düşünce, görüş, neden–sonuç ilişkileri) doğru bağlamda anlar ve kullanır.",
                "Metinlerde verilen bilgileri karşılaştırır, çıkarım yapar ve kişisel görüşünü gerekçelendirir.",
                "GCSE sınav formatına uygun olarak kısa ve uzun yazma görevlerini planlı bir şekilde tamamlar.",
                "Yazılı ve sözlü anlatımlarında giriş–gelişme–sonuç yapısını bilinçli biçimde kullanır.",
                "Deyim ve kalıplaşmış ifadeleri bağlama uygun şekilde kullanarak anlatım gücünü artırır.",
                "Farklı temalar (aile, okul, çevre, teknoloji, kültür, gelecek planları vb.) hakkında sınav düzeyinde kelime dağarcığı geliştirir.",
                "Deneme sınavları ve geri bildirimler yoluyla sınav stratejilerini geliştirir ve zaman yönetimi becerisi kazanır."
            ],
        },
        pricing: {
            perLesson: { '12': 60 },
            packages: [
                { lessons: 12, price: 720 }
            ],
        },
    },
];

export const getCourseByCode = (code?: string): Course | undefined => {
    if (!code) return undefined;
    const courseMap: { [key: string]: string } = { 
        'B': 'baslangic', 
        'K': 'konusma', 
        'G': 'gelisim', 
        'A': 'akademik',
        'GCSE': 'gcse'
    };
    const courseKey = code.replace(/[0-9]/g, '');
    const courseId = courseMap[courseKey as keyof typeof courseMap];
    return COURSES.find(c => c.id === courseId);
};
