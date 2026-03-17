import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" : "text-gray-400 hover:text-white hover:bg-slate-800";

  return (
    <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            CreditPath AI
          </div>
          <div className="flex space-x-4">
            <Link to="/" className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/')}`}>Accueil</Link>
            <Link to="/dashboard" className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/dashboard')}`}>Analyse Détaillée</Link>
            <Link to="/history" className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/history')}`}>Historique</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}