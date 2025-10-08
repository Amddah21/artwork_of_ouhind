import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencySelector = () => {
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'MAD', flag: '🇲🇦' }
  ];

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[120px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentCurrency?.flag}</span>
          <span className="text-sm font-medium">{currentCurrency?.code}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              Taux de change: 1€ = {exchangeRate.toFixed(2)} MAD
            </div>
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code as 'EUR' | 'MAD');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currency === curr.code
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <span className="text-lg">{curr.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{curr.name}</div>
                  <div className="text-xs text-muted-foreground">{curr.code} • {curr.symbol}</div>
                </div>
                {currency === curr.code && (
                  <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
