
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
    blobColor: string;
    cta: {
        text: string;
        iconBgColor: string;
        iconTextColor: string;
        badgeColor: string;
        badgeTextColor: string;
        linkTextColor: string;
    };
    details: {
        duration: string;
        gains: string[];
        gainsColor: string;
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
        shortDescription: "3–4 yaşındaki çocuğunuz için çevrim içi bir Türkçe oyun saati!\n* Yaş grubu tahmindir. Çocuğunuzun hazır bulunuşluğu ve sizin beklentilerinize göre başlayacağınız kurs belirlenir.",
        blobColor: "bg-accent", // #FFD166
        cta: {
            text: "Detaylı bilgi için tıkla >",
            iconBgColor: "bg-yellow-100",
            iconTextColor: "text-yellow-500",
            badgeColor: "bg-yellow-400",
            badgeTextColor: "text-yellow-900",
            linkTextColor: "text-orange-500",
        },
        details: {
            duration: "20 dakika",
            gains: [
                "Belirli temalarda (hayvanlar, renkler, kıyafetler, mevsimler, doğa…) kelime bilgisi geniştir.",
                "Türkçe şarkılar dinler ve anlar.",
                "Sorulara Türkçe cevaplar verebilir.",
            ],
            gainsColor: "bg-[#FFF8E7]",
        },
        pricing: {
            perLesson: { '4': 24.75, '8': 22.38, '12': 20.75, '24': 12.46 },
            packages: [
                { lessons: 4, price: 99 },
                { lessons: 8, price: 179 },
                { lessons: 12, price: 249 },
                { lessons: 24, price: 299 },
            ],
        },
    },
    {
        id: "konusma",
        title: "Konuşma Kursu",
        ageGroup: "Okul öncesi",
        shortDescription: "5 yaşındaki çocuğunuz için keyifli bir ısınma turu!\n* Yaş grubu tahmindir. Çocuğunuzun hazır bulunuşluğu ve sizin beklentilerinize göre başlayacağınız kurs belirlenir.",
        blobColor: "bg-cyan-300", // #4ECDC4
        cta: {
            text: "Detaylı bilgi için tıkla >",
            iconBgColor: "bg-teal-100",
            iconTextColor: "text-teal-500",
            badgeColor: "bg-orange-400",
            badgeTextColor: "text-white",
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
            gainsColor: "bg-[#FFF0CC]",
        },
        pricing: {
            perLesson: { '4': 18, '8': 17.5, '12': 16.5, '24': 15 },
            packages: [
                { lessons: 4, price: 72 },
                { lessons: 8, price: 140 },
                { lessons: 12, price: 198 },
                { lessons: 24, price: 360 },
            ],
        },
    },
    {
        id: "gelisim",
        title: "Gelişim Kursu",
        ageGroup: "İlkokul ve ortaokul",
        shortDescription: "Çocuğunuz için etkili, genel kültür dersleri.",
        blobColor: "bg-green-200", // #C7EFCF
        cta: { 
            text: "Detaylı bilgi için tıkla >",
            iconBgColor: "bg-teal-100",
            iconTextColor: "text-teal-500",
            badgeColor: "bg-green-500",
            badgeTextColor: "text-white",
            linkTextColor: "text-orange-500",
        },
        details: {
            duration: "45 dakika",
            gains: [
                "Fen, sanat, sosyal bilimler gibi konuları Türkçe olarak ifade edebilir.",
                "Bu konularda yeterli kelime bilgisine sahiptir.",
            ],
            gainsColor: "bg-[#F0FAF8]",
        },
        pricing: {
             perLesson: { '4': 25.25, '8': 26.31, '12': 22.88, '24': 21.06 },
            packages: [
                { lessons: 4, price: 101 },
                { lessons: 8, price: 210.5 },
                { lessons: 12, price: 274.5 },
                { lessons: 24, price: 505.5 },
            ],
        },
    },
    {
        id: "akademik",
        title: "Akademik Kurs",
        ageGroup: "İlkokul ve ortaokul",
        shortDescription: "Okuma yazma bilen her öğrencinin alabileceği Akademik Kurs, 4 adımdan oluşur.",
        blobColor: "bg-green-400", // #7BE495
        cta: { 
            text: "Detaylı bilgi için tıkla >",
            iconBgColor: "bg-teal-100",
            iconTextColor: "text-teal-500",
            badgeColor: "bg-green-500",
            badgeTextColor: "text-white",
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
            perLesson: { '4': 25.25, '8': 26.31, '12': 22.88, '24': 21.06 },
            packages: [
                { lessons: 4, price: 101 },
                { lessons: 8, price: 210.5 },
                { lessons: 12, price: 274.5 },
                { lessons: 24, price: 505.5 },
            ],
        },
    },
];
