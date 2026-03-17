import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  // On ajoute nom et prenom dans l'état du formulaire
  const [formData, setFormData] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    password: '' 
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Pour voir quand ça charge
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de page
    setError('');
    setSuccess('');
    setLoading(true); // Active l'état de chargement
    
    console.log("Envoi du formulaire...", formData); 

    try {
      const res = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Compte créé avec succès ! Redirection...");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.detail || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur. Vérifiez que le backend est lancé.");
    } finally {
      setLoading(false); // Désactive le chargement
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-fade-in border border-white/10">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Création de compte</h2>
        <p className="text-gray-400 text-center mb-8">Rejoignez la plateforme CreditPath.</p>
        
        {error && <div className="bg-rose-500/20 text-rose-300 p-3 rounded-lg text-sm mb-4 border border-rose-500/30 text-center">{error}</div>}
        {success && <div className="bg-emerald-500/20 text-emerald-300 p-3 rounded-lg text-sm mb-4 border border-emerald-500/30 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* LIGNE NOM / PRENOM */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold ml-1">Prénom</label>
              <input 
                type="text" required 
                className="w-full mt-2 p-3 glass-input rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
                placeholder="Jean"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold ml-1">Nom</label>
              <input 
                type="text" required 
                className="w-full mt-2 p-3 glass-input rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
                placeholder="Dupont"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Email</label>
            <input 
              type="email" required 
              className="w-full mt-2 p-3 glass-input rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold ml-1">Mot de passe</label>
            <input 
              type="password" required 
              className="w-full mt-2 p-3 glass-input rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg mt-4 ${loading ? 'bg-slate-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {loading ? "TRAITEMENT..." : "VALIDER L'INSCRIPTION"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Vous avez déjà un compte ? <Link to="/login" className="text-blue-400 hover:text-white font-bold ml-1">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}