import { CoinGeckoCoin, CryptoData, ConversionResult } from './types';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class CoinGeckoService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${COINGECKO_API_BASE}${endpoint}`);
      
      if (!response.ok) {
        throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Erro na conexão com a API');
    }
  }

  static async getTopCryptos(limit: number = 20): Promise<CryptoData[]> {
    try {
      const coins: CoinGeckoCoin[] = await this.makeRequest(
        `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&locale=pt`
      );

      return coins.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        image: coin.image,
        marketCap: coin.market_cap,
        volume: coin.total_volume
      }));
    } catch (error) {
      console.error('Erro ao buscar criptomoedas:', error);
      throw error;
    }
  }

  static async getCryptoPrice(cryptoId: string, targetCurrency: string = 'usd'): Promise<number> {
    try {
      const response = await this.makeRequest<{ [key: string]: { [key: string]: number } }>(
        `/simple/price?ids=${cryptoId}&vs_currencies=${targetCurrency}`
      );
      
      return response[cryptoId][targetCurrency];
    } catch (error) {
      console.error('Erro ao buscar preço:', error);
      throw error;
    }
  }

  static async convertCrypto(
    fromCryptoId: string, 
    toCurrency: string, 
    amount: number
  ): Promise<ConversionResult> {
    try {
      let price: number;
      let result: number;
      
      if (toCurrency.toLowerCase() === 'brl') {
        // Para BRL, usar a API do CoinGecko que suporta BRL diretamente
        const response = await this.makeRequest<{ [key: string]: { [key: string]: number } }>(
          `/simple/price?ids=${fromCryptoId}&vs_currencies=brl`
        );
        price = response[fromCryptoId].brl;
        result = amount * price;
      } else {
        // Para outras moedas
        price = await this.getCryptoPrice(fromCryptoId, toCurrency);
        result = amount * price;
      }
      
      return {
        id: Date.now().toString(),
        fromSymbol: fromCryptoId.toUpperCase(),
        toSymbol: toCurrency.toUpperCase(),
        amount,
        result,
        rate: price,
        date: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro na conversão:', error);
      throw error;
    }
  }

  static async searchCrypto(query: string): Promise<CryptoData[]> {
    try {
      const searchResponse: { coins: { id: string; name: string; symbol: string }[] } = await this.makeRequest(
        `/search?query=${encodeURIComponent(query)}`
      );

      // Buscar dados detalhados dos primeiros 10 resultados
      const topResults = searchResponse.coins.slice(0, 10);
      const coinIds = topResults.map(coin => coin.id).join(',');
      
      const detailedCoins: CoinGeckoCoin[] = await this.makeRequest(
        `/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=pt`
      );

      return detailedCoins.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        image: coin.image,
        marketCap: coin.market_cap,
        volume: coin.total_volume
      }));
    } catch (error) {
      console.error('Erro na busca:', error);
      throw error;
    }
  }

  static async getCryptoDetails(cryptoId: string): Promise<CoinGeckoCoin> {
    try {
      return await this.makeRequest(`/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    } catch (error) {
      console.error('Erro ao buscar detalhes da criptomoeda:', error);
      throw error;
    }
  }

  static async getCryptoHistory(cryptoId: string, days: number = 7, currency: string = 'usd'): Promise<{ prices: [number, number][], market_caps: [number, number][], total_volumes: [number, number][] }> {
    try {
      const response = await this.makeRequest<{
        prices: [number, number][];
        market_caps: [number, number][];
        total_volumes: [number, number][];
      }>(`/coins/${cryptoId}/market_chart?vs_currency=${currency}&days=${days}`);
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar histórico da criptomoeda:', error);
      throw error;
    }
  }
}

// Mapeamento de símbolos para IDs do CoinGecko
export const CRYPTO_ID_MAP: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'ADA': 'cardano',
  'SOL': 'solana',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'XRP': 'ripple',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  'TRX': 'tron',
  'NEAR': 'near',
  'FTM': 'fantom',
  'ALGO': 'algorand',
  'VET': 'vechain'
}; 