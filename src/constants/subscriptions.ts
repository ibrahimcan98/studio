export type SubscriptionTier = 'free' | 'adventurer' | 'hero';
export type BillingPeriod = 'monthly' | 'quarterly' | 'biannual' | 'annual';

export interface PriceDetails {
    monthlyEquivalent: string;
    totalPrice: string;
    stripePriceId: string;
}

export interface TierDetails {
    id: SubscriptionTier;
    name: string;
    features: string[];
    maxIslands: number | 'unlimited';
    maxStories: number | 'unlimited';
    maxAiHours: number;
    color: string;
    buttonColor: string;
    prices?: Record<BillingPeriod, PriceDetails>;
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierDetails> = {
    free: {
        id: 'free',
        name: 'Ücretsiz',
        features: [
            'İlk 1 Macera Haritası Adası Ücretsiz',
            'İlk 1 Türkçe Hazinem Sandığı Ücretsiz',
            'İlk 1 Hikaye Ücretsiz',
            'Günlük 2 Dakika AI Sohbet',
            'Temel Rozetler'
        ],
        maxIslands: 1,
        maxStories: 1,
        maxAiHours: 0.033, // Günlük 2 dk (aylık ~1 saat)
        color: 'bg-slate-100',
        buttonColor: 'bg-slate-500'
    },
    adventurer: {
        id: 'adventurer',
        name: 'Maceracı',
        features: [
            'Tüm Adalara Full Erişim',
            'Tüm Sandıklara Full Erişim',
            'Tüm Hikayelere Full Erişim',
            'En Yüksek Kalite AI Sohbet',
            'AI ile Sohbet (5 Saat/Ay)',
            'Gelişmiş Rozetler'
        ],
        maxIslands: 'unlimited',
        maxStories: 'unlimited',
        maxAiHours: 5,
        color: 'bg-blue-100',
        buttonColor: 'bg-blue-600',
        prices: {
            monthly: {
                monthlyEquivalent: '14.99 £',
                totalPrice: '14.99 £',
                stripePriceId: 'price_1TW1HUDeWbH3nlzSsh7QW3TN'
            },
            quarterly: {
                monthlyEquivalent: '13.99 £',
                totalPrice: '41.97 £',
                stripePriceId: 'price_1TfThmDeWbH3nlzSyVIGdYI9'
            },
            biannual: {
                monthlyEquivalent: '12.99 £',
                totalPrice: '77.94 £',
                stripePriceId: 'price_1TfTkDDeWbH3nlzS7MMfRIk4'
            },
            annual: {
                monthlyEquivalent: '10.99 £',
                totalPrice: '131.88 £',
                stripePriceId: 'price_1TfTlWDeWbH3nlzSwNcES46d'
            }
        }
    },
    hero: {
        id: 'hero',
        name: 'Kahraman',
        features: [
            'Tüm Özelliklere Sınırsız Erişim',
            'En Yüksek Kalite AI Sohbet',
            'AI ile Sohbet (20 Saat/Ay)',
            'Gelişmiş Rozetler'
        ],
        maxIslands: 'unlimited',
        maxStories: 'unlimited',
        maxAiHours: 20,
        color: 'bg-amber-100',
        buttonColor: 'bg-amber-600',
        prices: {
            monthly: {
                monthlyEquivalent: '21.99 £',
                totalPrice: '21.99 £',
                stripePriceId: 'price_1TW1IBDeWbH3nlzSV1LI0529'
            },
            quarterly: {
                monthlyEquivalent: '19.99 £',
                totalPrice: '59.97 £',
                stripePriceId: 'price_1TfTiTDeWbH3nlzSweuEvRV4'
            },
            biannual: {
                monthlyEquivalent: '18.99 £',
                totalPrice: '113.94 £',
                stripePriceId: 'price_1TfTl5DeWbH3nlzSFEAeYL8u'
            },
            annual: {
                monthlyEquivalent: '15.99 £',
                totalPrice: '191.88 £',
                stripePriceId: 'price_1TfTluDeWbH3nlzShFhCIqo4'
            }
        }
    }
};
