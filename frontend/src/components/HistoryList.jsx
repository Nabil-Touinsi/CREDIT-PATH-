import React from 'react';

export default function HistoryList({ history }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl mt-8 border border-slate-700 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
         Historique des Simulations
      </h3>
      
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-slate-900/80">
            <tr>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Montant</th>
              <th className="px-6 py-4 font-bold">Durée</th>
              <th className="px-6 py-4 font-bold">Décision</th>
              <th className="px-6 py-4 font-bold">Confiance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {history.map((item, index) => (
              <tr key={index} className="bg-slate-800 hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.date_simulation).toLocaleDateString()} <span className="text-gray-600">|</span> {new Date(item.date_simulation).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  {item.montant_demande.toLocaleString()} €
                </td>
                <td className="px-6 py-4">
                  {item.duree_pret} mois
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.decision === "ACCORDÉ" ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-rose-900/30 text-rose-400 border-rose-800'}`}>
                    {item.decision}
                  </span>
                </td>
                <td className="px-6 py-4 text-blue-300">
                  {item.score_confiance}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}