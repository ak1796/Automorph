import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { Car, Sliders, User, LogOut, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, logoutUser, selectedCar } = useCarContext();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0c10]/95 backdrop-blur-md border-b border-white/10 py-3.5">
        <div className="w-[93%] max-w-[1600px] mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 font-bold text-lg tracking-wider text-slate-100 cursor-pointer select-none"
            onClick={() => handleNavClick('/')}
          >
            <Car className="w-6 h-6 text-slate-200" />
            <span>AUTOMORPH AI</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold bg-white/10 text-slate-300 px-2 py-0.5 rounded">
              STUDIO
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-medium">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? 'text-white font-semibold border-b-2 border-white pb-1' : 'text-slate-400 hover:text-slate-200 transition'
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cars"
                  className={({ isActive }) =>
                    isActive ? 'text-white font-semibold border-b-2 border-white pb-1' : 'text-slate-400 hover:text-slate-200 transition'
                  }
                >
                  Models
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/customize"
                  className={({ isActive }) =>
                    isActive ? 'text-white font-semibold border-b-2 border-white pb-1' : 'text-slate-400 hover:text-slate-200 transition'
                  }
                >
                  Configurator
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? 'text-white font-semibold border-b-2 border-white pb-1' : 'text-slate-400 hover:text-slate-200 transition'
                  }
                >
                  Engineering ML
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/garage"
                  className={({ isActive }) =>
                    isActive ? 'text-white font-semibold border-b-2 border-white pb-1' : 'text-slate-400 hover:text-slate-200 transition'
                  }
                >
                  My Garage
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Right Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">{user.name}</span>
                <button
                  className="p-2 text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition"
                  onClick={logoutUser}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/30 px-3.5 py-2 rounded-md transition"
                onClick={() => setIsAuthOpen(true)}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              className="flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2 rounded-md transition shadow-sm"
              onClick={() => handleNavClick('/customize')}
            >
              <Sliders className="w-4 h-4" />
              <span>Configure {selectedCar ? selectedCar.name.split(' ')[0] : 'Car'}</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#0a0c10]/95 backdrop-blur-xl border-b border-white/10 p-6 z-40 flex flex-col gap-4 shadow-2xl">
          <button
            onClick={() => handleNavClick('/')}
            className="text-left text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-white/5"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('/cars')}
            className="text-left text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-white/5"
          >
            Models
          </button>
          <button
            onClick={() => handleNavClick('/customize')}
            className="text-left text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-white/5"
          >
            Configurator
          </button>
          <button
            onClick={() => handleNavClick('/dashboard')}
            className="text-left text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-white/5"
          >
            Engineering ML
          </button>
          <button
            onClick={() => handleNavClick('/garage')}
            className="text-left text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-white/5"
          >
            My Garage
          </button>

          <div className="pt-2 flex flex-col gap-3">
            {user.isLoggedIn ? (
              <button
                onClick={logoutUser}
                className="w-full flex items-center justify-center gap-2 border border-white/10 text-slate-300 py-2.5 rounded-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 border border-white/10 text-slate-300 py-2.5 rounded-md text-sm font-medium"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('/customize')}
              className="w-full flex items-center justify-center gap-2 bg-white text-slate-950 py-2.5 rounded-md text-sm font-semibold"
            >
              <Sliders className="w-4 h-4" />
              <span>Configure {selectedCar ? selectedCar.name.split(' ')[0] : 'Car'}</span>
            </button>
          </div>
        </div>
      )}

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </>
  );
};

export default Navbar;
