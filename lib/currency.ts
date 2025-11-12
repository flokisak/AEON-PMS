// lib/currency.ts
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD (base currency)
}

export const currencies: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', rate: 23.5 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.88 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.5 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24 },
};

export type CurrencyCode = keyof typeof currencies;

export class CurrencyConverter {
  private static baseCurrency: CurrencyCode = 'USD';
  private static currentCurrency: CurrencyCode = 'USD';

  static setBaseCurrency(currency: CurrencyCode): void {
    this.baseCurrency = currency;
  }

  static setCurrentCurrency(currency: CurrencyCode): void {
    this.currentCurrency = currency;
    localStorage.setItem('currency', currency);
  }

  static getCurrentCurrency(): CurrencyCode {
    const saved = localStorage.getItem('currency') as CurrencyCode;
    if (saved && currencies[saved]) {
      this.currentCurrency = saved;
    }
    return this.currentCurrency;
  }

  static getBaseCurrency(): CurrencyCode {
    return this.baseCurrency;
  }

  static convert(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = currencies[fromCurrency]?.rate || 1;
    const toRate = currencies[toCurrency]?.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }

  static convertFromBase(amount: number): number {
    return this.convert(amount, this.baseCurrency, this.currentCurrency);
  }

  static convertToBase(amount: number): number {
    return this.convert(amount, this.currentCurrency, this.baseCurrency);
  }

  static formatCurrency(amount: number, currency?: CurrencyCode): string {
    const targetCurrency = currency || this.currentCurrency;
    const currencyInfo = currencies[targetCurrency];
    
    if (!currencyInfo) return amount.toString();

    const convertedAmount = this.convert(amount, this.baseCurrency, targetCurrency);
    
    // Format based on currency conventions
    switch (targetCurrency) {
      case 'JPY':
      case 'CNY':
        // No decimal places for these currencies
        return `${currencyInfo.symbol}${convertedAmount.toFixed(0)}`;
      default:
        // Two decimal places for most currencies
        return `${currencyInfo.symbol}${convertedAmount.toFixed(2)}`;
    }
  }

  static getCurrencyInfo(currency?: CurrencyCode): Currency {
    const targetCurrency = currency || this.currentCurrency;
    return currencies[targetCurrency] || currencies.USD;
  }

  static getAllCurrencies(): Currency[] {
    return Object.values(currencies);
  }

  static getCurrencySymbol(currency?: CurrencyCode): string {
    return this.getCurrencyInfo(currency).symbol;
  }
}

// Initialize currency from localStorage
if (typeof window !== 'undefined') {
  CurrencyConverter.getCurrentCurrency();
}