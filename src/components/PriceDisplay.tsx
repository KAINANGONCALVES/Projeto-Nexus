import React from 'react';
import { useTopCryptos } from '@/hooks/use-crypto';

const PriceDisplay = () => {
  const { data: cryptos = [], isLoading, error } = useTopCryptos(5);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <h3 className="text-white font-bold mb-4">Teste de Preços</h3>
      <div className="space-y-2">
        {cryptos.map(crypto => (
          <div key={crypto.symbol} className="text-white">
            <strong>{crypto.symbol}</strong>: ${crypto.price.toLocaleString('en-US', { 
              minimumFractionDigits: crypto.price < 1 ? 8 : 2, 
              maximumFractionDigits: crypto.price < 1 ? 8 : 2 
            })} 
            ({crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%)
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceDisplay; 