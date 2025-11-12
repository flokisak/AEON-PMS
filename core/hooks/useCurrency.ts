// core/hooks/useCurrency.ts
import { useState, useEffect } from 'react';
import { CurrencyConverter, CurrencyCode, Currency } from '@/lib/currency';

export function useCurrency() {
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>('USD');
  const [currencyInfo, setCurrencyInfo] = useState<Currency>(CurrencyConverter.getCurrencyInfo());

  useEffect(() => {
    const savedCurrency = CurrencyConverter.getCurrentCurrency();
    setCurrentCurrencyState(savedCurrency);
    setCurrencyInfo(CurrencyConverter.getCurrencyInfo(savedCurrency));
  }, []);

  const changeCurrency = (newCurrency: CurrencyCode) => {
    CurrencyConverter.setCurrentCurrency(newCurrency);
    setCurrentCurrencyState(newCurrency);
    setCurrencyInfo(CurrencyConverter.getCurrencyInfo(newCurrency));
    
    // Trigger a custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: newCurrency } 
    }));
  };

  const formatCurrency = (amount: number, currency?: CurrencyCode): string => {
    return CurrencyConverter.formatCurrency(amount, currency);
  };

  const convertAmount = (amount: number, fromCurrency?: CurrencyCode, toCurrency?: CurrencyCode): number => {
    const from = fromCurrency || CurrencyConverter.getBaseCurrency();
    const to = toCurrency || currentCurrency;
    return CurrencyConverter.convert(amount, from, to);
  };

  const convertFromBase = (amount: number): number => {
    return CurrencyConverter.convertFromBase(amount);
  };

  const convertToBase = (amount: number): number => {
    return CurrencyConverter.convertToBase(amount);
  };

  return {
    currentCurrency,
    currencyInfo,
    changeCurrency,
    formatCurrency,
    convertAmount,
    convertFromBase,
    convertToBase,
    allCurrencies: CurrencyConverter.getAllCurrencies(),
  };
}