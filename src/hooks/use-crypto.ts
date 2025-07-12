import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoinGeckoService, CRYPTO_ID_MAP } from '@/lib/api';
import { CryptoData, ConversionResult } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export const useTopCryptos = (limit: number = 20) => {
  return useQuery({
    queryKey: ['topCryptos', limit],
    queryFn: async () => {
      const data = await CoinGeckoService.getTopCryptos(limit);
      console.log('Dados das criptomoedas:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
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
        title: "Conversão realizada!",
        description: `${result.amount} ${result.fromSymbol} = ${result.result.toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: result.toSymbol 
        })}`,
      });
    },
    onError: (error) => {
      console.error('Erro na conversão:', error);
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
  });
};

export const useCryptoPrice = (cryptoId: string, currency: string = 'usd') => {
  return useQuery({
    queryKey: ['cryptoPrice', cryptoId, currency],
    queryFn: () => CoinGeckoService.getCryptoPrice(cryptoId, currency),
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 3,
    enabled: !!cryptoId,
  });
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : ['BTC', 'ETH'];
  });

  const addFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(symbol) ? prev : [...prev, symbol];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
    
    toast({
      title: "Adicionado aos favoritos",
      description: `${symbol} foi adicionado aos seus favoritos.`,
    });
  };

  const removeFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav !== symbol);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
    
    toast({
      title: "Removido dos favoritos",
      description: `${symbol} foi removido dos seus favoritos.`,
    });
  };

  const toggleFavorite = (symbol: string) => {
    if (favorites.includes(symbol)) {
      removeFavorite(symbol);
    } else {
      addFavorite(symbol);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
};

export const useConversionHistory = () => {
  const [history, setHistory] = useState<ConversionResult[]>(() => {
    const saved = localStorage.getItem('conversions');
    return saved ? JSON.parse(saved) : [];
  });

  const addConversion = (conversion: ConversionResult) => {
    setHistory(prev => {
      const newHistory = [conversion, ...prev].slice(0, 50);
      localStorage.setItem('conversions', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversions');
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico de conversões foi removido.",
    });
  };

  return {
    history,
    addConversion,
    clearHistory
  };
}; 