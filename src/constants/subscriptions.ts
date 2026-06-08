export type SubscriptionTier = 'free' | 'adventurer' | 'hero';
export type BillingPeriod = 'monthly' | 'annual';
export type ChildCount = 1 | 2 | 3;

export interface PriceDetails {
    monthlyEquivalent: string;
    totalPrice: string;
    originalPrice?: string;
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
    prices?: Record<ChildCount, Record<BillingPeriod, PriceDetails>>;
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
            1: {
                monthly: {
                    monthlyEquivalent: '14.99 £',
                    totalPrice: '14.99 £',
                    originalPrice: '19.99 £',
                    stripePriceId: 'price_1TW1HUDeWbH3nlzSsh7QW3TN'
                },
                annual: {
                    monthlyEquivalent: '11.99 £',
                    totalPrice: '143.88 £',
                    originalPrice: '14.99 £',
                    stripePriceId: 'price_1TfTlWDeWbH3nlzSwNcES46d'
                }
            },
            2: {
                monthly: {
                    monthlyEquivalent: '24.99 £',
                    totalPrice: '24.99 £',
                    originalPrice: '34.99 £',
                    stripePriceId: 'price_1TfmyCDeWbH3nlzSR8g3XYeW'
                },
                annual: {
                    monthlyEquivalent: '19.99 £',
                    totalPrice: '239.88 £',
                    originalPrice: '24.99 £',
                    stripePriceId: 'price_1Tfn1MDeWbH3nlzSkeh1Tfeh'
                }
            },
            3: {
                monthly: {
                    monthlyEquivalent: '34.99 £',
                    totalPrice: '34.99 £',
                    originalPrice: '49.99 £',
                    stripePriceId: 'price_1Tfn2iDeWbH3nlzSXBlCTUQQ'
                },
                annual: {
                    monthlyEquivalent: '27.99 £',
                    totalPrice: '335.88 £',
                    originalPrice: '39.99 £',
                    stripePriceId: 'price_1Tfn4UDeWbH3nlzSYaMeodqd'
                }
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
            1: {
                monthly: {
                    monthlyEquivalent: '21.99 £',
                    totalPrice: '21.99 £',
                    originalPrice: '29.99 £',
                    stripePriceId: 'price_1TW1IBDeWbH3nlzSV1LI0529'
                },
                annual: {
                    monthlyEquivalent: '16.99 £',
                    totalPrice: '203.88 £',
                    originalPrice: '21.99 £',
                    stripePriceId: 'price_1TfTluDeWbH3nlzShFhCIqo4'
                }
            },
            2: {
                monthly: {
                    monthlyEquivalent: '34.99 £',
                    totalPrice: '34.99 £',
                    originalPrice: '49.99 £',
                    stripePriceId: 'price_1TfmycDeWbH3nlzSBeIhpcRh'
                },
                annual: {
                    monthlyEquivalent: '27.99 £',
                    totalPrice: '335.88 £',
                    originalPrice: '39.99 £',
                    stripePriceId: 'price_1Tfn21DeWbH3nlzSjXza5Mli'
                }
            },
            3: {
                monthly: {
                    monthlyEquivalent: '44.99 £',
                    totalPrice: '44.99 £',
                    originalPrice: '64.99 £',
                    stripePriceId: 'price_1Tfn3QDeWbH3nlzSKUhhp0WU'
                },
                annual: {
                    monthlyEquivalent: '36.99 £',
                    totalPrice: '443.88 £',
                    originalPrice: '44.99 £',
                    stripePriceId: 'price_1Tfn4zDeWbH3nlzSaRWetRlz'
                }
            }
        }
    }
};
