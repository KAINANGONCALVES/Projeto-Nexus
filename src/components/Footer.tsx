import React from 'react';
import { Coins } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TuctorCripto</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2025 TuctorCripto. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 