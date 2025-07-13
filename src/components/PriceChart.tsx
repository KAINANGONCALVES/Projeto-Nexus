import React, { useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useProcessedCryptoHistory } from '@/hooks/use-crypto';
import { CRYPTO_ID_MAP } from '@/lib/api';
import { ChartDataPoint } from '@/lib/types';

interface PriceChartProps {
  cryptoId: string;
  cryptoName: string;
  currentPrice: number;
  change24h: number;
  className?: string;
}

const PriceChart = React.memo(({ 
  cryptoId, 
  cryptoName, 
  currentPrice, 
  change24h, 
  className = '' 
}: PriceChartProps) => {
  const { data: chartData, isLoading, error } = useProcessedCryptoHistory(
    CRYPTO_ID_MAP[cryptoId] || cryptoId.toLowerCase(),
    7,
    'usd'
  );

  const formatPrice = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  const formatTooltip = useCallback((value: any, name: string) => {
    if (name === 'price') {
      return [formatPrice(value), 'Preço'];
    }
    return [value, name];
  }, [formatPrice]);

  const chartStats = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    
    const prices = chartData.map(d => d.price);
    const volumes = chartData.map(d => d.volume);
    
    return {
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      avgVolume: volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="ml-3 text-slate-300">Carregando histórico...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">Erro ao carregar dados</div>
          <div className="text-sm text-slate-500">
            Não foi possível carregar o histórico de preços.
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">Nenhum dado disponível</div>
          <div className="text-sm text-slate-500">
            Não há dados históricos para esta criptomoeda.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{cryptoName} ({cryptoId})</h3>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-white">
              {formatPrice(currentPrice)}
            </span>
            <div className={`flex items-center space-x-1 ${
              change24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {change24h >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Últimos 7 dias</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
              formatter={formatTooltip}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {chartStats && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-slate-400">Preço mais alto</div>
            <div className="text-lg font-semibold text-white">
              {formatPrice(chartStats.maxPrice)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Preço mais baixo</div>
            <div className="text-lg font-semibold text-white">
              {formatPrice(chartStats.minPrice)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Volume médio</div>
            <div className="text-lg font-semibold text-white">
              ${(chartStats.avgVolume / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PriceChart.displayName = 'PriceChart';

export default PriceChart; 