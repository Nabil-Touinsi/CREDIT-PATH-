import React from 'react';

export default function ActionPlan({ actions, decision }) {
  const safeActions = actions && actions.length > 0 ? actions : ["Analyse en cours..."];

  // Fonction pour mettre en gras ce qui est entre ** **
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl mt-6 border-l-4 border-blue-500 shadow-lg">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.443m-1.5.443c.995 0 1.973-.223 2.85-.63m2.85-6.364a3 3 0 00-4.95-3.003M6.75 6.75a3 3 0 00-4.95 3.003m15.45 6.365a3 3 0 01-4.95 3.003m-10.5 0a3 3 0 004.95 3.003m2.25-10.5a3 3 0 014.95-3.003M7.5 15h9" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recommandations Stratégiques</h3>
            <p className="text-xs text-gray-400">Analyse générée par le moteur expert CreditPath</p>
          </div>
      </div>
      
      <div className="space-y-4">
        {safeActions.map((conseil, index) => (
          <div key={index} className="flex cross-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all duration-300">
            {/* Numéro ou Puce */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold mt-1">
              {index + 1}
            </div>
            
            {/* Le texte formaté */}
            <p className="text-gray-300 text-sm leading-relaxed">
              {formatText(conseil)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}