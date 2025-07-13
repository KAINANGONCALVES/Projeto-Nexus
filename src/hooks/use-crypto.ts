import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoinGeckoService, CRYPTO_ID_MAP } from '@/lib/api';
import { CryptoData, ConversionResult, CryptoHistoryData, ChartDataPoint } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import React from 'react';

// Configurações padrão para queries
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutos
const DEFAULT_RETRY = 3;

export const useTopCryptos = (limit: number = 20) => {
  return useQuery({
    queryKey: ['topCryptos', limit],
    queryFn: async () => {
      const data = await CoinGeckoService.getTopCryptos(limit);
      console.log('Dados das criptomoedas:', data);
      return data;
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: DEFAULT_RETRY,
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useCryptoConversion = (userId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      fromCrypto, 
      toCurrency, 
      amount 
    }: { 
      fromCrypto: string; 
      toCurrency: string; 
      amount: number; 
    }) => {
      const cryptoId = CRYPTO_ID_MAP[fromCrypto] || fromCrypto.toLowerCase();
      console.log('Convertendo:', { fromCrypto, cryptoId, toCurrency, amount });
      const result = await CoinGeckoService.convertCrypto(cryptoId, toCurrency, amount);
      console.log('Resultado da conversão:', result);
      return result;
    },
    onSuccess: async (result) => {
      // Salvar no Firebase se o usuário estiver logado
      if (userId) {
        try {
          const { FirebaseService } = await import('@/lib/firebase-service');
          await FirebaseService.saveConversion({
            userId,
            fromSymbol: result.fromSymbol,
            toSymbol: result.toSymbol,
            amount: result.amount,
            result: result.result,
            rate: result.rate,
            date: new Date()
          });
          // Invalidar cache das conversões
          queryClient.invalidateQueries({ queryKey: ['conversions', userId] });
        } catch (error) {
          console.error('Erro ao salvar conversão no Firebase:', error);
        }
      }
      
      toast({
        title: "Conversão realizada",
        description: `${result.amount} ${result.fromSymbol} = ${result.result.toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: result.toSymbol === 'BRL' ? 'BRL' : 'USD' 
        })}`,
      });
    },
    onError: () => {
      toast({
        title: "Erro na conversão",
        description: "Não foi possível realizar a conversão. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useCryptoSearch = (query: string) => {
  return useQuery({
    queryKey: ['cryptoSearch', query],
    queryFn: () => CoinGeckoService.searchCrypto(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCryptoPrice = (cryptoId: string, currency: string = 'usd') => {
  return useQuery({
    queryKey: ['cryptoPrice', cryptoId, currency],
    queryFn: () => CoinGeckoService.getCryptoPrice(cryptoId, currency),
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: DEFAULT_RETRY,
    enabled: !!cryptoId,
    gcTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useCryptoHistory = (cryptoId: string, days: number = 7, currency: string = 'usd') => {
  return useQuery({
    queryKey: ['crypto-history', cryptoId, days, currency],
    queryFn: () => CoinGeckoService.getCryptoHistory(cryptoId, days, currency),
    enabled: !!cryptoId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: DEFAULT_RETRY,
  });
};

export const useProcessedCryptoHistory = (cryptoId: string, days: number = 7, currency: string = 'usd') => {
  const { data: historyData, isLoading, error } = useCryptoHistory(cryptoId, days, currency);

  const processedData: ChartDataPoint[] = React.useMemo(() => {
    if (!historyData) return [];

    return historyData.prices.map(([timestamp, price], index) => ({
      date: new Date(timestamp).toLocaleDateString('pt-BR'),
      price,
      volume: historyData.total_volumes[index]?.[1] || 0,
      marketCap: historyData.market_caps[index]?.[1] || 0,
    }));
  }, [historyData]);

  return {
    data: processedData,
    isLoading,
    error,
  };
}; 