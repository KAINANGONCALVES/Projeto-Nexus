
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Filter, Calendar, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ConversionCard from '@/components/ConversionCard';
import Footer from '@/components/Footer';
import { useAuthContext } from '@/contexts/AuthContext';
import { useConversions, useLogout } from '@/hooks/use-firebase';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Hook para gerenciar o histórico
  const { conversions, clearConversions } = useConversions(user?.uid || '');
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const filteredConversions = conversions
    .filter(conversion => {
      if (filter === 'all') return true;
      return conversion.fromSymbol === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'amount') {
        return b.result - a.result;
      }
      return 0;
    });

  const uniqueCryptos = [...new Set(conversions.map(c => c.fromSymbol))];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Navbar user={{ name: user.displayName || user.email || 'Usuário', avatar: user.photoURL }} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
              <HistoryIcon className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Histórico</h1>
              <p className="text-slate-300">Suas conversões anteriores</p>
            </div>
          </div>

          {conversions.length > 0 && (
            <button
              onClick={() => clearConversions.mutate()}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Filters */}
        {conversions.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-white">Filtros</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Filtrar por Criptomoeda
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="all">Todas as criptomoedas</option>
                  {uniqueCryptos.map(crypto => (
                    <option key={crypto} value={crypto}>{crypto}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="date">Data (mais recente)</option>
                  <option value="amount">Valor (maior)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Conversions List */}
        {conversions.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-6 bg-slate-800/30 rounded-full mb-6 mx-auto w-fit">
              <HistoryIcon className="w-16 h-16 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Nenhuma conversão ainda</h2>
            <p className="text-slate-300 text-center max-w-md mb-8 mx-auto">
              Suas conversões aparecerão aqui para que você possa acompanhar 
              seu histórico de operações.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              Fazer Primeira Conversão
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversions.map((conversion, index) => (
              <ConversionCard
                key={index}
                {...conversion}
                date={conversion.date.toISOString()}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default History;
