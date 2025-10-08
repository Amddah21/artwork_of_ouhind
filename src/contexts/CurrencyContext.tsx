import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'EUR' | 'MAD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInEUR: number) => number;
  formatPrice: (priceInEUR: number) => string;
  getCurrencySymbol: () => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

// Exchange rate: 1 EUR = ~11 MAD (approximate, you can update this)
const DEFAULT_EXCHANGE_RATE = 11;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_EXCHANGE_RATE);

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency') as Currency;
    if (savedCurrency && (savedCurrency === 'EUR' || savedCurrency === 'MAD')) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-currency', currency);
  }, [currency]);

  // Fetch real-time exchange rate (optional - you can use a free API)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Using a free API for EUR to MAD conversion
        // You can replace this with a more reliable API if needed
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        if (data.rates && data.rates.MAD) {
          setExchangeRate(data.rates.MAD);
        }
      } catch (error) {
        console.log('Using default exchange rate:', DEFAULT_EXCHANGE_RATE);
        // Keep the default rate if API fails
      }
    };

    fetchExchangeRate();
  }, []);

  const convertPrice = (priceInEUR: number): number => {
    if (currency === 'MAD') {
      return Math.round(priceInEUR * exchangeRate);
    }
    return priceInEUR;
  };

  const formatPrice = (priceInEUR: number): string => {
    const convertedPrice = convertPrice(priceInEUR);
    const symbol = getCurrencySymbol();
    
    if (currency === 'MAD') {
      return `${convertedPrice.toLocaleString('fr-MA')} ${symbol}`;
    } else {
      return `${convertedPrice.toLocaleString('fr-FR')} ${symbol}`;
    }
  };

  const getCurrencySymbol = (): string => {
    return currency === 'MAD' ? 'MAD' : '€';
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      getCurrencySymbol,
      exchangeRate
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
