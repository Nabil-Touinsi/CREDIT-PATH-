import React from 'react';
import AIAssistant from '../components/AIAssistant';

const fields = [
  {
    label: "Revenu mensuel",
    name: "revenu_mensuel",
    unit: "€",
    placeholder: "Ex. 2500",
    help: "Indiquez votre revenu net mensuel moyen. Cela aide à estimer votre capacité de remboursement.",
    min: 0,
    step: 100,
  },
  {
    label: "Dettes totales",
    name: "dette_totale",
    unit: "€",
    placeholder: "Ex. 5000",
    help: "Renseignez le total de vos dettes ou crédits en cours. Un niveau d’endettement élevé peut réduire vos chances d’accord.",
    min: 0,
    step: 100,
  },
  {
    label: "Épargne disponible",
    name: "epargne",
    unit: "€",
    placeholder: "Ex. 8000",
    help: "Votre épargne disponible peut renforcer votre dossier, notamment comme apport ou réserve de sécurité.",
    min: 0,
    step: 100,
  },
  {
    label: "Ancienneté d’emploi",
    name: "anciennete_emploi",
    unit: "ans",
    placeholder: "Ex. 3",
    help: "Indiquez depuis combien de temps vous êtes en poste. Une situation professionnelle stable rassure généralement davantage.",
    min: 0,
    step: 1,
  },
  {
    label: "Montant du crédit demandé",
    name: "montant_demande",
    unit: "€",
    placeholder: "Ex. 120000",
    help: "Saisissez le montant total que vous souhaitez emprunter.",
    min: 0,
    step: 1000,
  },
  {
    label: "Durée du prêt",
    name: "duree_pret",
    unit: "mois",
    placeholder: "Ex. 180",
    help: "Plus la durée est longue, plus la mensualité baisse, mais le coût total du crédit augmente souvent.",
    min: 1,
    step: 1,
  },
];

export default function Home({ formData, handleChange, handleSubmit, loading, result }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* FORMULAIRE */}
      <div className="lg:col-span-8 glass-panel p-8 rounded-2xl">
        <div className="mb-6 pb-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Configuration de la simulation</h2>
          <p className="text-sm text-gray-400 mt-2">
            Complétez ce formulaire pour obtenir une estimation automatique de votre dossier de crédit.
            Les informations ci-dessous permettent au moteur IA d’évaluer votre profil financier.
          </p>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-200 leading-relaxed">
            Cette simulation est une aide à la décision. Elle ne remplace pas l’analyse finale d’un organisme prêteur,
            mais elle vous permet de mieux comprendre les points forts et les points de vigilance de votre dossier.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="col-span-1">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                {field.label}
              </label>

              <div className="relative">
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  onChange={handleChange}
                  required
                  min={field.min}
                  step={field.step}
                  className="w-full p-3 pr-14 glass-input rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm text-white"
                  placeholder={field.placeholder}
                />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">
                  {field.unit}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                {field.help}
              </p>
            </div>
          ))}

          <div className="col-span-1 md:col-span-2 mt-2">
            <div className="rounded-xl bg-slate-800/60 border border-white/5 p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Avant de lancer l’analyse</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Vérifiez que les montants saisis correspondent bien à votre situation actuelle.
                Des données plus réalistes donnent une estimation plus utile et plus cohérente.
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-medium text-sm tracking-wide transition-all shadow-lg ${
                loading
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20'
              }`}
            >
              {loading ? 'TRAITEMENT EN COURS...' : "LANCER L'ANALYSE"}
            </button>
          </div>
        </form>
      </div>

      {/* COLONNE DROITE */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <AIAssistant result={result} data={formData} />
        
        {result && (
          <div
            className={`glass-panel p-6 rounded-2xl border-l-4 ${
              result.decision === "ACCORDÉ" ? 'border-emerald-500' : 'border-rose-500'
            }`}
          >
            <h3 className="text-white font-bold text-sm uppercase mb-2">Résultat préliminaire</h3>

            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-2xl font-bold ${
                  result.decision === "ACCORDÉ" ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.decision}
              </span>
              <span className="text-gray-400 text-sm">
                {result.score_confiance}% confiance
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {result.decision === "ACCORDÉ"
                ? "Votre profil semble globalement compatible avec une acceptation du crédit selon l’analyse automatique."
                : "Votre profil présente actuellement des signaux de risque qui peuvent expliquer un refus dans cette simulation."}
            </p>

            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Consultez l’analyse détaillée pour mieux comprendre les indicateurs financiers et les recommandations proposées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}