import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
          <p className="text-xl text-slate-300 mb-6">Ops! Página não encontrada</p>
          <NavLink 
            to="/" 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all"
          >
            Voltar ao Início
          </NavLink>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
