import { CoinGeckoCoin, CryptoData, ConversionResult } from './types';

const COINGECKO_API_BASE = import.meta.env.DEV 
  ? '/api/coingecko' 
  : 'https://api.coingecko.com/api/v3';

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
      
      if (!response || !response[cryptoId]) {
        throw new Error(`Criptomoeda '${cryptoId}' não encontrada`);
      }
      
      if (!response[cryptoId][targetCurrency]) {
        throw new Error(`Moeda '${targetCurrency}' não disponível para '${cryptoId}'`);
      }
      
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
        
        if (!response || !response[fromCryptoId]) {
          throw new Error(`Criptomoeda '${fromCryptoId}' não encontrada`);
        }
        
        if (!response[fromCryptoId].brl) {
          throw new Error(`BRL não disponível para '${fromCryptoId}'`);
        }
        
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
  'VET': 'vechain',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'BNB': 'binancecoin',
  'DAI': 'dai',
  'WBTC': 'wrapped-bitcoin',
  'LEO': 'leo-token',
  'STETH': 'staked-ether',
  'OKB': 'okb',
  'LDO': 'lido-dao',
  'XLM': 'stellar',
  'HBAR': 'hedera-hashgraph',
  'ICP': 'internet-computer',
  'FIL': 'filecoin',
  'CRO': 'crypto-com-chain',
  'MKR': 'maker',
  'APT': 'aptos',
  'OP': 'optimism',
  'ARB': 'arbitrum',
  'MNT': 'mantle',
  'SUI': 'sui',
  'SEI': 'sei-network',
  'RUNE': 'thorchain',
  'INJ': 'injective',
  'FET': 'fetch-ai',
  'RNDR': 'render-token',
  'GRT': 'the-graph',
  'AAVE': 'aave',
  'SNX': 'havven',
  'COMP': 'compound-governance-token',
  'ZEC': 'zcash',
  'XMR': 'monero',
  'DASH': 'dash',
  'NEO': 'neo',
  'WAVES': 'waves',
  'XTZ': 'tezos',
  'CHZ': 'chiliz',
  'HOT': 'holochain',
  'BAT': 'basic-attention-token',
  'ZRX': '0x',
  'REP': 'augur',
  'KNC': 'kyber-network-crystal',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'ENJ': 'enjincoin',
  'GALA': 'gala',
  'AXS': 'axie-infinity',
  'SLP': 'smooth-love-potion',
  'CHR': 'chromia',
  'ALPHA': 'alpha-finance',
  'PERP': 'perpetual-protocol',
  'RLC': 'iexec-rlc',
  'STORJ': 'storj',
  'ANKR': 'ankr',
  'CKB': 'nervos-network',
  'COTI': 'coti',
  'CTSI': 'cartesi',
  'DUSK': 'dusk-network',
  'FLR': 'flare-networks',
  'FLUX': 'zelcash',
  'FTT': 'ftx-token',
  'GTC': 'gitcoin',
  'HIVE': 'hive',
  'HNT': 'helium',
  'ICX': 'icon',
  'IOTA': 'iota',
  'IOTX': 'iotex',
  'KAVA': 'kava',
  'KDA': 'kadena',
  'KSM': 'kusama',
  'LRC': 'loopring',
  'LSK': 'lisk',
  'LTO': 'lto-network',
  'LUNA': 'terra-luna-2',
  'MINA': 'mina-protocol',
  'MIR': 'mirror-protocol',
  'NANO': 'nano',
  'NEXO': 'nexo',
  'NMR': 'numeraire',
  'NULS': 'nuls',
  'OCEAN': 'ocean-protocol',
  'OGN': 'origin-protocol',
  'OMG': 'omisego',
  'ONE': 'harmony',
  'ONG': 'ong',
  'ONT': 'ontology',
  'ORN': 'orion-protocol',
  'OXT': 'orchid',
  'PAXG': 'pax-gold',
  'POLS': 'polkastarter',
  'POLY': 'polymath',
  'POND': 'marlin',
  'POWR': 'power-ledger',
  'PROM': 'prometeus',
  'QNT': 'quant',
  'QTUM': 'qtum',
  'RAD': 'radicle',
  'RARE': 'superrare',
  'RARI': 'rarible',
  'REN': 'republic-protocol',
  'REQ': 'request-network',
  'ROSE': 'oasis-network',
  'RSR': 'reserve-rights-token',
  'RVN': 'ravencoin',
  'SCRT': 'secret',
  'SKL': 'skale',
  'SNT': 'status',
  'SPELL': 'spell-token',
  'SRM': 'serum',
  'STEEM': 'steem',
  'STMX': 'storm',
  'STRAX': 'straks',
  'STX': 'blockstack',
  'SUPER': 'superfarm',
  'SUSHI': 'sushi',
  'SWAP': 'trustswap',
  'SXP': 'sxp',
  'SYN': 'synapse-network',
  'SYS': 'syscoin',
  'TFUEL': 'theta-fuel',
  'THETA': 'theta-token',
  'TLM': 'alien-worlds',
  'TOKE': 'tokemak',
  'TOMO': 'tomochain',
  'TRB': 'tellor',
  'TRIBE': 'tribe',
  'TRU': 'truefi',
  'UMA': 'uma',
  'UOS': 'ultra',
  'UTK': 'utrust',
  'VGX': 'voyager-token',
  'VRA': 'verasity',
  'VTHO': 'vethor-token',
  'WOO': 'wootrade',
  'XDC': 'xdce-crowdsale',
  'XEC': 'ecash',
  'XEM': 'nem',
  'XVG': 'verge',
  'YFI': 'yearn-finance',
  'YGG': 'yield-guild-games',
  'ZEN': 'horizen',
  'ZIL': 'zilliqa'
}; 