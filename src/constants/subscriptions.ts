
export type SubscriptionTier = 'free' | 'adventurer' | 'hero';

export interface TierDetails {
    id: SubscriptionTier;
    name: string;
    price: string;
    features: string[];
    maxIslands: number | 'unlimited';
    maxStories: number | 'unlimited';
    maxAiHours: number;
    color: string;
    buttonColor: string;
    stripePriceId?: string;
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierDetails> = {
    free: {
        id: 'free',
        name: 'Ücretsiz',
        price: '0 €',
        features: [
            'İlk 2 Ada Ücretsiz',
            'İlk 1 Hikaye Ücretsiz',
            'Günlük 2 Dakika AI Sohbet',
            'Temel Rozetler'
        ],
        maxIslands: 2,
        maxStories: 1,
        maxAiHours: 0.033, // Günlük 2 dk (aylık ~1 saat)
        color: 'bg-slate-100',
        buttonColor: 'bg-slate-500'
    },
    adventurer: {
        id: 'adventurer',
        name: 'Maceracı',
        price: '14.99 €',
        features: [
            'Tüm Adalara Full Erişim',
            'Tüm Hikayelere Full Erişim',
            'AI ile Sohbet (5 Saat/Ay)',
            'Gelişmiş Rozetler'
        ],
        maxIslands: 'unlimited',
        maxStories: 'unlimited',
        maxAiHours: 5,
        color: 'bg-blue-100',
        buttonColor: 'bg-blue-600',
        stripePriceId: 'price_1TW1HUDeWbH3nlzSsh7QW3TN'
    },
    hero: {
        id: 'hero',
        name: 'Kahraman',
        price: '21.99 €',
        features: [
            'Tüm Özelliklere Sınırsız Erişim',
            'En Yüksek Kalite AI Sohbet',
            'AI ile Sohbet (20 Saat/Ay)',
            'Özel Kahraman Rozetleri',
            'Öncelikli Destek'
        ],
        maxIslands: 'unlimited',
        maxStories: 'unlimited',
        maxAiHours: 20,
        color: 'bg-amber-100',
        buttonColor: 'bg-amber-600',
        stripePriceId: 'price_1TW1IBDeWbH3nlzSV1LI0529'
    }
};
