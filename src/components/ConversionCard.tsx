
import React from 'react';
import { ArrowRight, Clock, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConversionCardProps {
  fromSymbol: string;
  toSymbol: string;
  amount: number;
  result: number;
  date: string;
  rate?: number;
}

const ConversionCard = ({
  fromSymbol,
  toSymbol,
  amount,
  result,
  date,
  rate
}: ConversionCardProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.toString());
    toast({
      title: "Copiado!",
      description: "Valor copiado para a área de transferência.",
    });
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Copiar resultado"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{amount}</div>
            <div className="text-sm text-slate-400">{fromSymbol}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-5 h-5 text-blue-400" />
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {result.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: toSymbol === 'BRL' ? 'BRL' : 'USD' 
              })}
            </div>
            <div className="text-sm text-slate-400">{toSymbol}</div>
          </div>
        </div>
      </div>

      {rate && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            Taxa: 1 {fromSymbol} = {rate.toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: toSymbol === 'BRL' ? 'BRL' : 'USD' 
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionCard;
