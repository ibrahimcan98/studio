
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
    };
    academicSteps?: AcademicStep[];
    pricing: {
        perLesson: {
            '4': number;
            '8': number;
            '12': number;
            '24': number;
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
        title: "Başlangıç Kursu",
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
                "Belirli temalarda (hayvanlar, renkler, kıyafetler, mevsimler, doğa…) kelime bilgisi geniştir.",
                "Türkçe şarkılar dinler ve anlar.",
                "Sorulara Türkçe cevaplar verebilir.",
            ],
        },
        pricing: {
            perLesson: { '4': 14.01, '8': 13.38, '12': 12.28, '24': 11.34 },
            packages: [
                { lessons: 4, price: 56.05 },
                { lessons: 8, price: 107.07 },
                { lessons: 12, price: 147.33 },
                { lessons: 24, price: 272.14 },
            ],
        },
    },
    {
        id: "konusma",
        title: "Konuşma Kursu",
        ageGroup: "Okul öncesi",
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
                "Sorulara sadece kelimelerle değil, birbirine bağlı cümlelerle cevap verebilir.",
                "Neden/sonuç cümleleri kurabilir.",
                "Amaç/sonuç cümleleri kurabilir.",
                "Hikâye anlatabilir.",
                "Türkçe şarkılar dinler ve anlar.",
                "Türkçe hikâye dinler / çizgi film izler ve yorumlar.",
            ],
        },
        pricing: {
            perLesson: { '4': 20.80, '8': 20.16, '12': 18.46, '24': 17.62 },
            packages: [
                { lessons: 4, price: 83.20 },
                { lessons: 8, price: 161.27 },
                { lessons: 12, price: 221.48 },
                { lessons: 24, price: 422.93 },
            ],
        },
    },
    {
        id: "akademik",
        title: "Akademik Kurs",
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
            gains: [], // Gains are in academicSteps
        },
        academicSteps: [
            {
                id: "akademik-1",
                title: "1. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Türkçe harfleri telaffuz edebilir.",
                    "Türkçe yazma becerileri gelişmiştir.",
                    "Doğru bir şekilde sesli okumayı öğrenir.",
                    "Okuduğunu anlama becerileri gelişmiştir.",
                    "Okuduğu metinle ilgili basit sorulara cevap verebilir.",
                ],
            },
            {
                id: "akademik-2",
                title: "2. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Okuduğunu anlama becerileri gelişmiştir.",
                    "Zıt anlam / eş anlam kavramını algılar.",
                    "Bir görseli detaylıca betimleyebilir.",
                    "Kelime hazinesi genişlemiştir.",
                    "İkili diyaloglarda rahattır ve günlük dile hâkimdir.",
                    "Dili hatasız kullanır.",
                ],
            },
            {
                id: "akademik-3",
                title: "3. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "Anlamlı cümleler kurar.",
                    "Noktalama işaretlerini düzgün kullanır.",
                    "Anlatım bozuklukları ve yazım hataları yapmaz.",
                    "Şiir okuyabilir ve basitçe yorumlar.",
                    "Bağlaçları etkin kullanır. Cümleleri “ve” ile bağlamaz.",
                    "Anlatılan veya okunanın ana fikrini basitçe açıklar.",
                ],
            },
            {
                id: "akademik-4",
                title: "4. adım",
                color: "bg-[#D4EDE3]",
                gains: [
                    "İfadelerinde aynı kelimeleri kullanmaz; aynı anlama gelen farklı kelimeleri etkin kullanır.",
                    "Sayıt ifadeleri anlar ve kullanır.",
                    "Anlatılan veya okunan eserin derin anlamını çıkarabilir; anlatılmak isteneni farklı boyutlarda ele alır.",
                    "Deyimleri ve atasözlerini etkin kullanır.",
                    "Yazılı ve sözlü anlatımda giriş-gelişme-sonuç bölümlerine göre ilerler.",
                ],
            },
        ],
        pricing: {
            perLesson: { '4': 31.30, '8': 30.10, '12': 27.69, '24': 26.48 },
            packages: [
                { lessons: 4, price: 125.18 },
                { lessons: 8, price: 240.77 },
                { lessons: 12, price: 332.22 },
                { lessons: 24, price: 635.56 },
            ],
        },
    },
    {
        id: "gelisim",
        title: "Gelişim Kursu",
        ageGroup: "İlkokul ve ortaokul",
        shortDescription: "Türkçeyi içerik öğrenme ve düşünme dili olarak kullanmayı hedefler.\n\nBu kursu tamamlayan çocuklar:\n\nFen, kültür ve dünya bilgisi içeriklerini Türkçe öğrenir\nBilgi metinlerinden çıkarım yapar\nKarşılaştırma ve açıklama yapar\nKısa araştırmalar ve sunumlar hazırlar\nDil, kültür ve kimlik arasında bilinçli bağlar kurar",
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
                "Fen, kültür ve dünya bilgisi içeriklerini Türkçe öğrenir.",
                "Bilgi metinlerinden çıkarım yapar.",
                "Karşılaştırma ve açıklama yapar.",
                "Kısa araştırmalar ve sunumlar hazırlar.",
                "Dil, kültür ve kimlik arasında bilinçli bağlar kurar.",
            ],
        },
        pricing: {
             perLesson: { '4': 31.30, '8': 30.10, '12': 27.69, '24': 26.48 },
            packages: [
                { lessons: 4, price: 125.18 },
                { lessons: 8, price: 240.77 },
                { lessons: 12, price: 332.22 },
                { lessons: 24, price: 635.56 },
            ],
        },
    },
];
