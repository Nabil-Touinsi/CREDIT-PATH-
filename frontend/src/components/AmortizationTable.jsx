import React, { useState } from 'react';

export default function AmortizationTable({ schedule }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl flex justify-between items-center transition-colors border border-slate-600"
      >
        <span> Voir l'Échéancier (Tableau d'amortissement)</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="bg-slate-800 rounded-xl mt-2 overflow-hidden border border-slate-700 shadow-xl animate-fade-in">
          <div className="overflow-x-auto max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
            <table className="min-w-full text-sm text-gray-300">
              <thead className="bg-slate-900 text-xs uppercase font-semibold text-gray-400 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">Mois</th>
                  <th className="px-4 py-3 text-right">Mensualité</th>
                  <th className="px-4 py-3 text-right">Intérêts</th>
                  <th className="px-4 py-3 text-right">Capital</th>
                  <th className="px-4 py-3 text-right">Restant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {schedule.map((row) => (
                  <tr key={row.mois} className="hover:bg-slate-700/50">
                    <td className="px-4 py-2 font-mono text-blue-300">{row.mois}</td>
                    <td className="px-4 py-2 text-right">{row.mensualite} €</td>
                    <td className="px-4 py-2 text-right text-rose-300">{row.interet} €</td>
                    <td className="px-4 py-2 text-right text-emerald-300">{row.principal} €</td>
                    <td className="px-4 py-2 text-right font-bold text-gray-400">{row.restant} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}