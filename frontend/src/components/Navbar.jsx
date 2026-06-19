import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Common styling for active vs inactive links
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <nav class="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          
          {/* Brand Logo */}
          <div class="flex items-center">
            <NavLink to="/dashboard" class="flex items-center gap-2 font-bold text-xl text-slate-800 tracking-tight">
              <span class="text-2xl">💼</span>
              <span class="bg-gradient-to-r from-brand-600 to-blue-500 bg-clip-text text-transparent">CareerPulse</span>
            </NavLink>
          </div>

          {/* Desktop Nav Links */}
          <div class="hidden md:flex items-center gap-4">
            <NavLink to="/dashboard" class={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/jobs" class={linkClass}>
              Jobs
            </NavLink>
            
            {/* User Details & Logout */}
            <div class="h-6 w-px bg-slate-200 mx-2"></div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-slate-700">
                Hi, {user?.name || 'User'}
              </span>
              <button
                onClick={handleLogout}
                class="px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div class="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              class="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none transition-all cursor-pointer"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <span class="text-xl">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div class="md:hidden border-t border-slate-100 bg-white px-2 pt-2 pb-4 space-y-1 shadow-inner animate-slide-down">
          <NavLink
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            class={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-base font-semibold transition-all ${
                isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/jobs"
            onClick={() => setIsOpen(false)}
            class={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-base font-semibold transition-all ${
                isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            Jobs
          </NavLink>
          <div class="border-t border-slate-100 my-2 pt-2 px-4 flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-700">
              Hi, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              class="px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
