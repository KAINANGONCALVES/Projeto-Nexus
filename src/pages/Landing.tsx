
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Shield, Zap, History, Star, TrendingUp, Coins } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  const features = [
    {
      icon: Zap,
      title: 'Conversão Rápida',
      description: 'Converta suas criptomoedas instantaneamente com dados em tempo real.'
    },
    {
      icon: Shield,
      title: 'Segurança Garantida',
      description: 'Suas informações estão protegidas com criptografia de ponta.'
    },
    {
      icon: History,
      title: 'Histórico Completo',
      description: 'Acompanhe todas as suas conversões com histórico detalhado.'
    },
    {
      icon: Star,
      title: 'Sistema de Favoritos',
      description: 'Marque suas criptomoedas favoritas para acesso rápido.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-400/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl">
                <Coins className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Converta <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Criptomoedas</span>
              <br />com Facilidade e Segurança
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              A plataforma mais moderna para conversão de criptomoedas. 
              Dados atualizados em tempo real, interface intuitiva e segurança máxima.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
              
              <NavLink
                to="/login"
                className="border border-slate-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Fazer Login
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Por que escolher o TuctorCripto?
            </h2>
            <p className="text-slate-300 text-lg">
              Oferecemos as melhores ferramentas para suas conversões de criptomoedas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all backdrop-blur-sm"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-xl">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-2xl p-8 lg:p-12 text-center backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Pronto para começar?
              </h2>
              
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de usuários que já confiam no TuctorCripto
                para suas conversões de criptomoedas.
              </p>
              
              <NavLink
                to="/register"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all group"
              >
                <span>Criar Conta Gratuita</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
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
    </div>
  );
};

export default Landing;
