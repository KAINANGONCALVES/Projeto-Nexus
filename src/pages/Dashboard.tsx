
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, TrendingUp, ArrowUpDown, Sparkles, Loader2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import CryptoCard from '@/components/CryptoCard';
import SearchCrypto from '@/components/SearchCrypto';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTopCryptos, useCryptoConversion } from '@/hooks/use-crypto';
import { useFavorites } from '@/hooks/use-firebase';
import { useLogout } from '@/hooks/use-firebase';
import { CRYPTO_ID_MAP } from '@/lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Hooks da API
  const { data: cryptos = [], isLoading: isLoadingCryptos, error: cryptosError } = useTopCryptos(20);
  const { favorites, toggleFavorite } = useFavorites(user?.uid || '');
  const conversionMutation = useCryptoConversion();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleConvert = async () => {
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
      
      setResult(result.result);
    } catch (error) {
      console.error('Erro na conversão:', error);
    }
  };

  const favoriteCryptos = cryptos.filter(crypto => favorites.includes(crypto.symbol));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={{ name: user.displayName || user.email || 'Usuário', avatar: user.photoURL }} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Olá, {user.displayName || user.email}! 👋
          </h1>
          <p className="text-slate-300">
            Converta suas criptomoedas com facilidade e segurança.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conversion Panel */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <ArrowUpDown className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Converter Criptomoeda</h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Criptomoeda
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className="flex-1 p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        {cryptos.map(crypto => (
                          <option key={crypto.symbol} value={crypto.symbol}>
                            {crypto.symbol} - {crypto.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowSearch(true)}
                        className="p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white hover:bg-slate-700 transition-all"
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
                      className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
          </div>

          {/* Favorites Panel */}
          <div>
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
                      onClick={() => setSelectedCrypto(crypto.symbol)}
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
          </div>
        </div>

        {/* All Cryptos */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">Todas as Criptomoedas</h3>
          
          {isLoadingCryptos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-3 text-slate-300">Carregando criptomoedas...</span>
            </div>
          ) : cryptosError ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-2">Erro ao carregar dados</div>
              <div className="text-sm text-slate-500">
                Não foi possível carregar as criptomoedas. Tente novamente.
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cryptos.map(crypto => (
                <CryptoCard
                  key={crypto.symbol}
                  {...crypto}
                  isFavorite={favorites.includes(crypto.symbol)}
                  onToggleFavorite={() => toggleFavorite(crypto.symbol)}
                  onClick={() => setSelectedCrypto(crypto.symbol)}
                />
              ))}
            </div>
          )}
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
    </div>
  );
};

export default Dashboard;
