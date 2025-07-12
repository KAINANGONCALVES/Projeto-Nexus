
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import CryptoCard from '@/components/CryptoCard';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTopCryptos } from '@/hooks/use-crypto';
import { useFavorites, useLogout } from '@/hooks/use-firebase';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Hooks da API
  const { data: cryptos = [], isLoading, error } = useTopCryptos(50);
  const { favorites, toggleFavorite } = useFavorites(user?.uid || '');
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const favoriteCryptos = cryptos.filter(crypto => favorites.includes(crypto.symbol));
  const otherCryptos = cryptos.filter(crypto => !favorites.includes(crypto.symbol));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={{ name: user.displayName || user.email || 'Usuário', avatar: user.photoURL }} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Favoritos</h1>
            <p className="text-slate-300">Suas criptomoedas favoritas em um só lugar</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-3 text-slate-300">Carregando criptomoedas...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-2">Erro ao carregar dados</div>
            <div className="text-sm text-slate-500">
              Não foi possível carregar as criptomoedas. Tente novamente.
            </div>
          </div>
        ) : (
          <>
            {/* Favoritos */}
            {favoriteCryptos.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Seus Favoritos</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {favoriteCryptos.map(crypto => (
                    <CryptoCard
                      key={crypto.symbol}
                      {...crypto}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(crypto.symbol)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-2">Nenhum favorito ainda</div>
                <div className="text-sm text-slate-500">
                  Adicione criptomoedas aos favoritos para vê-las aqui
                </div>
              </div>
            )}

            {/* Outras Criptomoedas */}
            {otherCryptos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Adicionar aos Favoritos</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {otherCryptos.map(crypto => (
                    <CryptoCard
                      key={crypto.symbol}
                      {...crypto}
                      isFavorite={false}
                      onToggleFavorite={() => toggleFavorite(crypto.symbol)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
