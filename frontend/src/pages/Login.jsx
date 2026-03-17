import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('isAuthenticated', 'true'); // On sauvegarde la session
        localStorage.setItem('userId', data.user_id);
        setIsAuthenticated(true);
        navigate('/'); // On envoie vers l'accueil
      } else {
        setError(data.detail);
      }
    } catch (err) { setError("Erreur serveur"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Bon retour</h2>
        <p className="text-gray-400 text-center mb-8">Connectez-vous à votre espace CreditPath.</p>
        
        {error && <div className="bg-rose-500/20 text-rose-300 p-3 rounded-lg text-sm mb-4 border border-rose-500/30 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Email</label>
            <input 
              type="email" required 
              className="w-full mt-2 p-3 glass-input rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="exemple@email.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Mot de passe</label>
            <input 
              type="password" required 
              className="w-full mt-2 p-3 glass-input rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/50">
            SE CONNECTER
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Pas encore de compte ? <Link to="/register" className="text-blue-400 hover:text-white font-bold ml-1">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}