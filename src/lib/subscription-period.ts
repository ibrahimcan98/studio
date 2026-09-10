// Stripe's older API puts the period on the subscription; newer APIs use items.
export function subscriptionPeriodEnd(subscription: {
    current_period_end?: number;
    items?: { data: { current_period_end?: number }[] };
}): number | null {
    const ends = subscription.items?.data
        .map(item => item.current_period_end)
        .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0) || [];
    const legacy = subscription.current_period_end;
    return ends.length ? Math.min(...ends) : typeof legacy === 'number' && Number.isFinite(legacy) && legacy > 0 ? legacy : null;
}
