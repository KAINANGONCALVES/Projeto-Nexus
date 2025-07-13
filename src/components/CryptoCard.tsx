
import React, { useCallback } from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  image?: string;
  marketCap?: number;
  volume?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
}

const CryptoCard = React.memo(({
  symbol,
  name,
  price,
  change24h,
  image,
  marketCap,
  volume,
  isFavorite = false,
  onToggleFavorite,
  onClick
}: CryptoCardProps) => {
  const isPositive = change24h >= 0;

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  }, [onToggleFavorite]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  }, []);

  const formatPrice = useCallback((price: number) => {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: price < 1 ? 6 : 2, 
      maximumFractionDigits: price < 1 ? 6 : 2 
    });
  }, []);

  return (
    <div 
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-10 h-10 rounded-full"
              onError={handleImageError}
            />
          ) : null}
          <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm ${image ? 'hidden' : ''}`}>
            {symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{symbol}</h3>
            <p className="text-slate-400 text-xs">{name}</p>
          </div>
        </div>
        
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite 
                ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10' 
                : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-xl font-bold text-white">
          ${formatPrice(price)}
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
        </div>
        
        {marketCap && (
          <div className="text-xs text-slate-400">
            MC: ${(marketCap / 1e9).toFixed(2)}B
          </div>
        )}
      </div>
    </div>
  );
});

CryptoCard.displayName = 'CryptoCard';

export default CryptoCard;
