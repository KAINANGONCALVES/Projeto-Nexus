
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Star, History, BarChart3 } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  return (
    <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TuctorCripto</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/favorites" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Star className="w-4 h-4" />
                  <span>Favoritos</span>
                </NavLink>
                <NavLink 
                  to="/history" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <History className="w-4 h-4" />
                  <span>Histórico</span>
                </NavLink>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-300 text-sm hidden sm:block">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink 
                to="/login" 
                className="text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all"
              >
                Cadastrar
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden border-t border-slate-800 py-2">
            <div className="flex space-x-1">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/favorites" 
                className={({ isActive }) => 
                  `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                Favoritos
              </NavLink>
              <NavLink 
                to="/history" 
                className={({ isActive }) => 
                  `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                Histórico
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
