import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import FinancialCharts from '../components/FinancialCharts';
import RateComparator from '../components/RateComparator';
import AmortizationTable from '../components/AmortizationTable';
import ActionPlan from '../components/ActionPlan';

export default function Dashboard({ result, formData }) {
  const formatCurrency = (value) => {
    const number = Number(value || 0);
    return `${number.toLocaleString('fr-FR')} €`;
  };

  const formatPercent = (value) => {
    const number = Number(value || 0);
    return `${number.toFixed(1)}%`;
  };

  if (!result) {
    return (
      <div className="bg-slate-800 rounded-2xl border border-slate-700 animate-fade-in p-10 text-center">
        <p className="text-6xl mb-4">📊</p>
        <h2 className="text-2xl font-bold text-white mb-3">Aucune analyse disponible</h2>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Cette page présente les indicateurs détaillés de votre simulation de crédit :
          budget estimé, niveau de risque, comparaison de taux et projection de remboursement.
          Pour afficher ces éléments, lancez d’abord une simulation depuis la page d’accueil.
        </p>
      </div>
    );
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('CreditPath AI', 105, 20, null, null, 'center');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text("Certificat d'Éligibilité & Analyse Financière", 105, 30, null, null, 'center');

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Date du rapport : ${new Date().toLocaleDateString()}`, 15, 50);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DÉTAILS DU PROFIL :', 15, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Revenu Mensuel : ${formData.revenu_mensuel} €`, 15, 68);
      doc.text(`• Dettes Actuelles : ${formData.dette_totale} €`, 15, 76);
      doc.text(`• Épargne Disponible : ${formData.epargne} €`, 15, 84);
      doc.text(`• Demande : ${formData.montant_demande} € sur ${formData.duree_pret} mois`, 15, 92);

      if (result.decision === 'ACCORDÉ') {
        doc.setFillColor(220, 252, 231);
        doc.rect(15, 100, 180, 15, 'F');
        doc.setTextColor(21, 128, 61);
        doc.setFont('helvetica', 'bold');
        doc.text(`DÉCISION : ACCORDÉ (Confiance IA : ${result.score_confiance}%)`, 20, 110);
      } else {
        doc.setFillColor(254, 226, 226);
        doc.rect(15, 100, 180, 15, 'F');
        doc.setTextColor(185, 28, 28);
        doc.setFont('helvetica', 'bold');
        doc.text(`DÉCISION : REFUSÉ (Confiance IA : ${result.score_confiance}%)`, 20, 110);
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('ÉCHÉANCIER (12 premiers mois) :', 15, 130);

      const tableData = result.finance?.tableau_amortissement || [];

      autoTable(doc, {
        startY: 135,
        head: [['Mois', 'Mensualité', 'Intérêts', 'Capital', 'Restant']],
        body: tableData.slice(0, 12).map((row) => [
          row.mois,
          `${row.mensualite} €`,
          `${row.interet} €`,
          `${row.principal} €`,
          `${row.restant} €`,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 9 },
      });

      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Document généré automatiquement par CreditPath AI.', 105, 280, null, null, 'center');

      doc.save('CreditPath_Analyse.pdf');
    } catch (error) {
      console.error('ERREUR PDF DÉTAILLÉE :', error);
      alert("Erreur lors de la génération. Ouvrez la console (F12) pour voir le détail.");
    }
  };

  const monthlyIncome = Number(formData?.revenu_mensuel || 0);
  const totalDebt = Number(formData?.dette_totale || 0);
  const savings = Number(formData?.epargne || 0);
  const requestedAmount = Number(formData?.montant_demande || 0);
  const duration = Number(formData?.duree_pret || 0);
  const jobSeniority = Number(formData?.anciennete_emploi || 0);

  const debtRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0;
  const savingsCoverage = requestedAmount > 0 ? (savings / requestedAmount) * 100 : 0;

  const summaryCards = [
    {
      title: 'Décision IA',
      value: result.decision,
      description:
        result.decision === 'ACCORDÉ'
          ? "Votre dossier présente un niveau de compatibilité favorable selon l'analyse automatique."
          : "Votre dossier présente plusieurs points de vigilance dans l'analyse automatique.",
      accent:
        result.decision === 'ACCORDÉ'
          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
          : 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      title: 'Confiance du modèle',
      value: `${result.score_confiance}%`,
      description: "Indique le niveau de confiance de l'IA dans l’évaluation produite.",
      accent: 'text-blue-300 border-blue-500/30 bg-blue-500/10',
    },
    {
      title: 'Ancienneté professionnelle',
      value: `${jobSeniority} an${jobSeniority > 1 ? 's' : ''}`,
      description: 'Une situation professionnelle stable peut renforcer la solidité du dossier.',
      accent: 'text-violet-300 border-violet-500/30 bg-violet-500/10',
    },
    {
      title: 'Épargne mobilisable',
      value: formatCurrency(savings),
      description: `Soit environ ${formatPercent(savingsCoverage)} du montant demandé.`,
      accent: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800 p-6 rounded-2xl border-l-4 border-purple-500 shadow-xl gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analyse Approfondie</h2>
          <p className="text-gray-400 text-sm mt-1">
            Consultez les indicateurs détaillés de votre simulation et comprenez plus facilement les forces et les
            points de vigilance de votre dossier.
          </p>
        </div>

        <button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Télécharger le PDF
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-5">
        <h3 className="text-white font-semibold text-base mb-2">Lecture rapide de votre dossier</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Cette page vous aide à interpréter les résultats de votre simulation. Les graphiques ci-dessous détaillent
          votre équilibre budgétaire, votre niveau de risque estimé, le positionnement de votre taux et la projection
          de remboursement sur la durée du prêt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className={`rounded-2xl border p-4 ${card.accent}`}>
            <p className="text-xs uppercase tracking-wide opacity-80 mb-2">{card.title}</p>
            <p className="text-xl font-bold mb-2">{card.value}</p>
            <p className="text-sm text-gray-200/80 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Revenu mensuel déclaré</p>
          <p className="text-white text-xl font-bold">{formatCurrency(monthlyIncome)}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Dettes totales déclarées</p>
          <p className="text-white text-xl font-bold">{formatCurrency(totalDebt)}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Taux d’endettement indicatif</p>
          <p className="text-white text-xl font-bold">{formatPercent(debtRatio)}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Durée demandée</p>
          <p className="text-white text-xl font-bold">{duration} mois</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
            <h3 className="text-white font-semibold mb-2">Budget et équilibre financier</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ce graphique montre comment vos revenus, vos dettes et votre épargne se répartissent. Il permet de mieux
              comprendre si votre situation actuelle laisse une marge de manœuvre suffisante pour absorber un nouveau crédit.
            </p>
          </div>
          <FinancialCharts data={formData} result={result} />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
            <h3 className="text-white font-semibold mb-2">Taux et positionnement de votre offre</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ce comparateur situe votre taux estimé par rapport à une moyenne de référence. Il permet d’évaluer si
              votre profil vous donne accès à une proposition compétitive ou non.
            </p>
          </div>
          <RateComparator finance={result.finance} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
          <h3 className="text-white font-semibold mb-2">Projection de remboursement</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Le tableau ci-dessous détaille l’évolution de vos mensualités et la répartition entre intérêts, capital remboursé
            et capital restant dû. C’est un bon outil pour comprendre le coût du crédit dans le temps.
          </p>
        </div>
        <AmortizationTable schedule={result.finance.tableau_amortissement} />
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
          <h3 className="text-white font-semibold mb-2">Plan d’action recommandé</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Cette section traduit l’analyse en recommandations concrètes. Elle vous aide à savoir quoi améliorer en priorité
            avant une future demande ou comment consolider un dossier déjà favorable.
          </p>
        </div>
        <ActionPlan actions={result.plan_action} decision={result.decision} />
      </div>
    </div>
  );
}