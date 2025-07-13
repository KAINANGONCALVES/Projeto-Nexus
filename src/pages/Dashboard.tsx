
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, TrendingUp, ArrowUpDown, Sparkles, Loader2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import CryptoCard from '@/components/CryptoCard';
import SearchCrypto from '@/components/SearchCrypto';
import PriceChart from '@/components/PriceChart';
import Footer from '@/components/Footer';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTopCryptos, useCryptoConversion } from '@/hooks/use-crypto';
import { useFavorites } from '@/hooks/use-firebase';
import { useLogout } from '@/hooks/use-firebase';
import { CRYPTO_ID_MAP } from '@/lib/api';

// Componente otimizado para o painel de conversão
const ConversionPanel = React.memo(({ 
  selectedCrypto, 
  setSelectedCrypto, 
  amount, 
  setAmount, 
  targetCurrency, 
  setTargetCurrency, 
  result, 
  cryptos, 
  conversionMutation, 
  showSearch, 
  setShowSearch 
}: {
  selectedCrypto: string;
  setSelectedCrypto: (crypto: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  targetCurrency: string;
  setTargetCurrency: (currency: string) => void;
  result: number | null;
  cryptos: any[];
  conversionMutation: any;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}) => {
  const handleConvert = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro na conversão",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await conversionMutation.mutateAsync({
        fromCrypto: selectedCrypto,
        toCurrency: targetCurrency.toLowerCase(),
        amount: parseFloat(amount)
      });
      
      // O resultado será atualizado pelo hook
    } catch (error) {
      console.error('Erro na conversão:', error);
    }
  }, [amount, selectedCrypto, targetCurrency, conversionMutation]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ArrowUpDown className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Converter Criptomoeda</h2>
      </div>

      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Criptomoeda
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className="flex-1 p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      >
                        {cryptos.map(crypto => (
                          <option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.symbol} - {crypto.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowSearch(true)}
                        className="p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white hover:bg-slate-700 transition-all flex-shrink-0"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Moeda de Destino
                    </label>
                    <select
                      value={targetCurrency}
                      onChange={(e) => setTargetCurrency(e.target.value)}
                      className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    >
                      <option value="BRL">BRL - Real Brasileiro</option>
                      <option value="USD">USD - Dólar Americano</option>
                    </select>
                  </div>
                </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quantidade
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.00000001"
            className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={conversionMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {conversionMutation.isPending ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Convertendo...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Converter</span>
            </>
          )}
        </button>

        {result !== null && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Resultado da Conversão</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {result.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: targetCurrency === 'BRL' ? 'BRL' : 'USD' 
              })}
            </div>
            <div className="text-sm text-slate-300 mt-1">
              {amount} {selectedCrypto} → {targetCurrency}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Taxa: 1 {selectedCrypto} = {(result / parseFloat(amount || '0')).toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: targetCurrency === 'BRL' ? 'BRL' : 'USD' 
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Componente otimizado para o painel de favoritos
const FavoritesPanel = React.memo(({ 
  favoriteCryptos, 
  toggleFavorite, 
  setSelectedCrypto, 
  setSelectedCryptoForChart 
}: {
  favoriteCryptos: any[];
  toggleFavorite: (symbol: string) => void;
  setSelectedCrypto: (crypto: string) => void;
  setSelectedCryptoForChart: (crypto: string) => void;
}) => {
  const handleCryptoClick = useCallback((symbol: string) => {
    setSelectedCrypto(symbol);
    setSelectedCryptoForChart(symbol);
  }, [setSelectedCrypto, setSelectedCryptoForChart]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Favoritos</h3>
      
      {favoriteCryptos.length > 0 ? (
        <div className="space-y-3">
          {favoriteCryptos.map(crypto => (
            <CryptoCard
              key={crypto.symbol}
              {...crypto}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(crypto.symbol)}
              onClick={() => handleCryptoClick(crypto.symbol)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">Nenhum favorito ainda</div>
          <div className="text-sm text-slate-500">
            Adicione criptomoedas aos favoritos para acesso rápido
          </div>
        </div>
      )}
    </div>
  );
});

// Componente otimizado para o gráfico de preços
const PriceChartSection = React.memo(({ 
  selectedCryptoForChart, 
  setSelectedCryptoForChart, 
  cryptos 
}: {
  selectedCryptoForChart: string;
  setSelectedCryptoForChart: (crypto: string) => void;
  cryptos: any[];
}) => {
  const selectedCryptoData = useMemo(() => 
    cryptos.find(crypto => crypto.symbol === selectedCryptoForChart),
    [cryptos, selectedCryptoForChart]
  );

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-2xl font-bold text-white">Histórico de Preços</h3>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label className="text-sm font-medium text-slate-300">Criptomoeda:</label>
          <select
            value={selectedCryptoForChart}
            onChange={(e) => setSelectedCryptoForChart(e.target.value)}
            className="w-full sm:w-auto p-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          >
            {cryptos.map(crypto => (
              <option key={crypto.symbol} value={crypto.symbol}>
                {crypto.symbol} - {crypto.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-8">
        {selectedCryptoData ? (
          <PriceChart
            cryptoId={selectedCryptoData.symbol}
            cryptoName={selectedCryptoData.name}
            currentPrice={selectedCryptoData.price}
            change24h={selectedCryptoData.change24h}
          />
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="text-center py-8">
              <div className="text-slate-400 mb-2">Selecione uma criptomoeda</div>
              <div className="text-sm text-slate-500">
                Escolha uma criptomoeda para ver seu histórico de preços
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Componente otimizado para a lista de criptomoedas
const CryptosList = React.memo(({ 
  cryptos, 
  favorites, 
  toggleFavorite, 
  setSelectedCrypto, 
  setSelectedCryptoForChart,
  isLoadingCryptos,
  cryptosError
}: {
  cryptos: any[];
  favorites: string[];
  toggleFavorite: (symbol: string) => void;
  setSelectedCrypto: (crypto: string) => void;
  setSelectedCryptoForChart: (crypto: string) => void;
  isLoadingCryptos: boolean;
  cryptosError: any;
}) => {
  const handleCryptoClick = useCallback((symbol: string) => {
    setSelectedCrypto(symbol);
    setSelectedCryptoForChart(symbol);
  }, [setSelectedCrypto, setSelectedCryptoForChart]);

  if (isLoadingCryptos) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-3 text-slate-300">Carregando criptomoedas...</span>
      </div>
    );
  }

  if (cryptosError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-2">Erro ao carregar dados</div>
        <div className="text-sm text-slate-500">
          Não foi possível carregar as criptomoedas. Tente novamente.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cryptos.map(crypto => (
        <CryptoCard
          key={crypto.symbol}
          {...crypto}
          isFavorite={favorites.includes(crypto.symbol)}
          onToggleFavorite={() => toggleFavorite(crypto.symbol)}
          onClick={() => handleCryptoClick(crypto.symbol)}
        />
      ))}
    </div>
  );
});

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCryptoForChart, setSelectedCryptoForChart] = useState('BTC');

  // Hooks da API
  const { data: cryptos = [], isLoading: isLoadingCryptos, error: cryptosError } = useTopCryptos(20);
  const { favorites, toggleFavorite } = useFavorites(user?.uid || '');
  const conversionMutation = useCryptoConversion(user?.uid);
  const logoutMutation = useLogout();

  // Memoização de dados computados
  const favoriteCryptos = useMemo(() => 
    cryptos.filter(crypto => favorites.includes(crypto.symbol)),
    [cryptos, favorites]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, [logoutMutation, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Navbar user={{ name: user.displayName || user.email || 'Usuário', avatar: user.photoURL }} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {user.displayName || user.email}! 👋
          </h1>
          <p className="text-slate-300">
            Converta suas criptomoedas com facilidade e segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversion Panel */}
          <div className="lg:col-span-2">
            <ConversionPanel
              selectedCrypto={selectedCrypto}
              setSelectedCrypto={setSelectedCrypto}
              amount={amount}
              setAmount={setAmount}
              targetCurrency={targetCurrency}
              setTargetCurrency={setTargetCurrency}
              result={result}
              cryptos={cryptos}
              conversionMutation={conversionMutation}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>

          {/* Favorites Panel */}
          <div>
            <FavoritesPanel
              favoriteCryptos={favoriteCryptos}
              toggleFavorite={toggleFavorite}
              setSelectedCrypto={setSelectedCrypto}
              setSelectedCryptoForChart={setSelectedCryptoForChart}
            />
          </div>
        </div>

        {/* Price Chart */}
        <PriceChartSection
          selectedCryptoForChart={selectedCryptoForChart}
          setSelectedCryptoForChart={setSelectedCryptoForChart}
          cryptos={cryptos}
        />

        {/* All Cryptos */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">Todas as Criptomoedas</h3>
          <CryptosList
            cryptos={cryptos}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSelectedCrypto={setSelectedCrypto}
            setSelectedCryptoForChart={setSelectedCryptoForChart}
            isLoadingCryptos={isLoadingCryptos}
            cryptosError={cryptosError}
          />
        </div>
      </div>
      
      {showSearch && (
        <SearchCrypto
          onSelectCrypto={(symbol) => {
            setSelectedCrypto(symbol);
            setShowSearch(false);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
