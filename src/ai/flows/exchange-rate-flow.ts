'use server';
/**
 * @fileOverview A flow for fetching live currency exchange rates.
 *
 * - getExchangeRates - A function that returns current exchange rates based on GBP.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExchangeRateOutputSchema = z.object({
  rates: z.record(z.string(), z.number()).describe("A dictionary of currency codes to their exchange rate against the British Pound."),
});
export type ExchangeRateOutput = z.infer<typeof ExchangeRateOutputSchema>;


export async function getExchangeRates(): Promise<ExchangeRateOutput> {
  return exchangeRateFlow();
}

const exchangeRateFlow = ai.defineFlow(
  {
    name: 'exchangeRateFlow',
    outputSchema: ExchangeRateOutputSchema,
  },
  async () => {
    try {
      // Abort controller to prevent long-hanging fetches that crash RSC navigation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('https://api.frankfurter.app/latest?from=GBP', {
        signal: controller.signal,
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data && data.rates) {
        return {
          rates: data.rates,
        };
      } else {
        throw new Error('Invalid data structure from exchange rate API.');
      }
    } catch (error) {
      console.warn("Error fetching exchange rates, using fallback:", error);
      // Fallback rates to prevent "Failed to fetch" crashes during site navigation
      return {
        rates: {
          GBP: 1,
          EUR: 1.18,
          USD: 1.27,
          AED: 4.66,
          AUD: 1.92,
          CAD: 1.74,
          CHF: 1.14,
          IDR: 20760,
          MYR: 5.99,
          NOK: 13.58,
          TRY: 41.76,
        }
      }
    }
  }
);
