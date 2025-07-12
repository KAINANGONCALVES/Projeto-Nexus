import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useCryptoSearch } from '@/hooks/use-crypto';
import CryptoCard from './CryptoCard';

interface SearchCryptoProps {
  onSelectCrypto?: (symbol: string) => void;
  onClose?: () => void;
}

const SearchCrypto = ({ onSelectCrypto, onClose }: SearchCryptoProps) => {
  const [query, setQuery] = useState('');
  const { data: searchResults = [], isLoading, error } = useCryptoSearch(query);

  const handleSelect = (symbol: string) => {
    onSelectCrypto?.(symbol);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Buscar Criptomoeda</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o nome ou símbolo da criptomoeda..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {query.length < 3 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">Digite pelo menos 3 caracteres</div>
              <div className="text-sm text-slate-500">
                Para buscar uma criptomoeda específica
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-3 text-slate-300">Buscando...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-2">Erro na busca</div>
              <div className="text-sm text-slate-500">
                Não foi possível realizar a busca. Tente novamente.
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">Nenhum resultado encontrado</div>
              <div className="text-sm text-slate-500">
                Tente buscar por outro termo
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {searchResults.map(crypto => (
                <div
                  key={crypto.symbol}
                  onClick={() => handleSelect(crypto.symbol)}
                  className="cursor-pointer"
                >
                  <CryptoCard
                    {...crypto}
                    onClick={() => handleSelect(crypto.symbol)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchCrypto; 