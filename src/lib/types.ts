export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    currency: string;
    percentage: number;
    times: number;
  };
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface ConversionResult {
  id: string;
  fromSymbol: string;
  toSymbol: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  image: string;
  marketCap: number;
  volume: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Firebase Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseConversion {
  id: string;
  userId: string;
  fromSymbol: string;
  toSymbol: string;
  amount: number;
  result: number;
  rate: number;
  date: Date;
}

export interface FirebaseError {
  code: string;
  message: string;
}

export interface CryptoHistoryData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
  marketCap: number;
} 