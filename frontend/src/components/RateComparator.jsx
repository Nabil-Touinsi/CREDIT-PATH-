import React from 'react';

export default function RateComparator({ finance }) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 mt-6 animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         Comparateur de Taux
      </h3>

      <div className="flex flex-col gap-4">
        {/* Taux Utilisateur */}
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Votre Taux (IA)</span>
            <span className="font-bold text-emerald-400">{finance.taux_obtenu}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${(finance.taux_obtenu / 6) * 100}%` }}></div>
          </div>
        </div>

        {/* Taux Marché */}
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Moyenne Nationale</span>
            <span className="font-bold text-gray-400">{finance.taux_marche}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div className="bg-gray-500 h-full" style={{ width: `${(finance.taux_marche / 6) * 100}%` }}></div>
          </div>
        </div>

        {/* Économies */}
        <div className="bg-emerald-900/30 border border-emerald-500/30 p-4 rounded-xl mt-2 text-center">
          <p className="text-emerald-200 text-sm">
            Grâce à votre profil, vous économisez environ <span className="font-bold text-lg">{finance.economie} €</span> d'intérêts par rapport à la moyenne ! 💰
          </p>
        </div>
      </div>
    </div>
  );
}