import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Bem-vindo ao TuctorCripto</h1>
          <p className="text-xl text-slate-300">A plataforma mais moderna para conversão de criptomoedas!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
