'use server';
/**
 * @fileOverview A flow for fetching live currency exchange rates.
 *
 * - getExchangeRates - A function that returns current exchange rates based on EUR.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExchangeRateOutputSchema = z.object({
  rates: z.record(z.string(), z.number()).describe("A dictionary of currency codes to their exchange rate against the Euro."),
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
      const response = await fetch('https://api.frankfurter.app/latest?from=EUR');
      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Ensure the API response has the expected structure
      if (data && data.rates) {
        return {
          rates: data.rates,
        };
      } else {
        throw new Error('Invalid data structure from exchange rate API.');
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      // In case of an error, return a default/stale set of rates to prevent a crash
      return {
        rates: {
          EUR: 1,
          GBP: 0.85,
          USD: 1.08,
          AED: 3.96,
          AUD: 1.63,
          CAD: 1.48,
          CHF: 0.97,
          IDR: 17650,
          MYR: 5.09,
          NOK: 11.55,
          TRY: 35.50,
        }
      }
    }
  }
);
