export function calculateLevel(totalXp: number): number {
  if (totalXp < 0) return 1;
  // Seviye = Kök(XP / 100) + 1
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export function calculateXpForNextLevel(currentLevel: number): number {
  // Level N için gereken toplam XP = (N - 1)^2 * 100
  const nextLevel = currentLevel + 1;
  return Math.pow(nextLevel - 1, 2) * 100;
}

export function calculateXpForCurrentLevel(currentLevel: number): number {
  return Math.pow(currentLevel - 1, 2) * 100;
}

export interface BadgeUnlock {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export function getCompletedChestsCount(completedTopics: string[]): number {
  const chestIds = new Set<string>();
  for (const topic of completedTopics) {
    if (topic.startsWith('chest-')) {
      const parts = topic.split('-');
      if (parts.length === 3) {
        chestIds.add(parts[1]);
      }
    }
  }
  let completedCount = 0;
  for (const id of chestIds) {
    if (
      completedTopics.includes(`chest-${id}-1`) &&
      completedTopics.includes(`chest-${id}-2`) &&
      completedTopics.includes(`chest-${id}-3`)
    ) {
      completedCount++;
    }
  }
  return completedCount;
}

export function hasCompletedTekrar(topics: string[], tekrarId: number): boolean {
  // Tekrar sandıkları sadece "Ülkemi Öğreniyorum" (country = -3) bölümüne sahip.
  // Bu yüzden sadece chest-tekrar-X-3 anahtarını kontrol ediyoruz.
  const key3 = `chest-tekrar-${tekrarId}-3`;
  const key2 = `chest-tekrar-${tekrarId}-2`;
  // -3 varsa kesinlikle tamamlanmış; -2 varsa da (lang bölümü olan sandıklar için) tamamlanmış sayılır
  return topics.includes(key3) || topics.includes(key2);
}

// 6 Adet Tekrar Rozeti Şartı (Görsel Odaklı)
export const BADGES = [
  {
    id: "tekrar_1_kupasi",
    name: "Kırmızı Kulübe Kupası",
    description: "1. Genel Tekrar Sandığı'nı başarıyla bitirene verilir.",
    icon: "/badges/tekrar-1.png",
    check: (topics: string[]) => hasCompletedTekrar(topics, 1)
  },
  {
    id: "tekrar_2_kupasi",
    name: "Gümüş Pusula Kupası",
    description: "2. Genel Tekrar Sandığı'nı başarıyla bitirene verilir.",
    icon: "/badges/tekrar-2.png",
    check: (topics: string[]) => hasCompletedTekrar(topics, 2)
  },
  {
    id: "tekrar_3_kupasi",
    name: "Bronz Baykuş Kupası",
    description: "3. Genel Tekrar Sandığı'nı başarıyla bitirene verilir.",
    icon: "/badges/tekrar-3.png",
    check: (topics: string[]) => hasCompletedTekrar(topics, 3)
  },
  {
    id: "tekrar_4_kupasi",
    name: "Kristal Yıldız Kupası",
    description: "4. Genel Tekrar Sandığı'nı başarıyla bitirene verilir.",
    icon: "/badges/tekrar-4.png",
    check: (topics: string[]) => hasCompletedTekrar(topics, 4)
  },
  {
    id: "tekrar_5_kupasi",
    name: "Zümrüt Ağaç Kupası",
    description: "5. Genel Tekrar Sandığı'nı başarıyla bitirene verilir.",
    icon: "/badges/tekrar-5.png",
    check: (topics: string[]) => hasCompletedTekrar(topics, 5)
  },
  {
    id: "tekrar_6_kupasi",
    name: "Elmas Taç Kupası",
    description: "6. Genel Tekrar Sandığı'nı başarıyla bitirene verilir.",
    icon: "/badges/tekrar-6.png",
    check: (topics: string[]) => hasCompletedTekrar(topics, 6)
  },
  {
    id: 'ilk-hazine',
    name: 'İlk Hazine',
    description: 'İlk Türkçe Hazinem sandığını başarıyla açana verilir.',
    icon: '/rozetler/hazine/ilk-hazine.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-3')).length >= 1
  },
  {
    id: 'okuma-sevdalisi',
    name: 'Okuma Sevdalısı',
    description: '10 Türkçe Hazinem "Okuyorum Anlıyorum" görevini tamamlayana.',
    icon: '/rozetler/hazine/okuma-sevdalisi.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-1')).length >= 10
  },
  {
    id: 'dil-ustasi',
    name: 'Dil Ustası',
    description: '10 Türkçe Hazinem "Dilimi Öğreniyorum" görevini tamamlayana.',
    icon: '/rozetler/hazine/dil-ustasi.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-2')).length >= 10
  },
  {
    id: 'turkiye-sevdalisi',
    name: 'Türkiye Sevdalısı',
    description: '10 Türkçe Hazinem "Ülkemi Öğreniyorum" görevini tamamlayana.',
    icon: '/rozetler/hazine/turkiye-sevdalisi.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-3')).length >= 10
  },
  {
    id: 'kelime-uzmani',
    name: 'Kelime Uzmanı',
    description: '10 tam Türkçe Hazinem sandığı bitirene verilir.',
    icon: '/rozetler/hazine/kelime-uzmani.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-3')).length >= 10
  },
  {
    id: 'kultur-elcisi',
    name: 'Kültür Elçisi',
    description: '20 tam Türkçe Hazinem sandığı bitiren kaşiflere.',
    icon: '/rozetler/hazine/kultur-elcisi.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-3')).length >= 20
  },
  {
    id: 'hazine-avcisi',
    name: 'Hazine Avcısı',
    description: 'Tüm 30 Türkçe Hazinem sandığını tamamlayan büyük kaşiflere!',
    icon: '/rozetler/hazine/hazine-avcisi.png',
    check: (topics: string[]) => topics.filter(t => t.startsWith('chest-') && t.endsWith('-3')).length >= 30
  }
];

export function checkNewBadgeUnlock(oldTopics: string[], newTopics: string[]): BadgeUnlock | null {
  for (const badge of BADGES) {
    const wasUnlocked = badge.check(oldTopics);
    const isUnlockedNow = badge.check(newTopics);
    
    // Eğer eskiden açılmamışsa ve şimdi açılıyorsa rozeti döndür
    if (!wasUnlocked && isUnlockedNow) {
      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon
      };
    }
  }

  return null;
}

// Kazanılmış rozetleri sticker olarak döndürür (Firestore sync için)
export function getEarnedBadgesAsStickers(topics: string[]): Record<string, string> {
  const stickers: Record<string, string> = {};
  for (const badge of BADGES) {
    if (badge.check(topics)) {
      stickers[badge.id] = badge.icon;
    }
  }
  return stickers;
}
