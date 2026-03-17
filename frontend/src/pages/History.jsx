import React from 'react';
import HistoryList from '../components/HistoryList';

export default function History({ history }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-2"> Historique des Dossiers</h2>
        <p className="text-gray-400">Retrouvez toutes vos anciennes simulations ici.</p>
      </div>
      
      {/* On utilise le composant HistoryList qu'on a déjà créé */}
      <HistoryList history={history} />
    </div>
  );
}