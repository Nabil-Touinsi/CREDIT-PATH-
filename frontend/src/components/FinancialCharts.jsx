import React from 'react';
import { 
  PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  BarChart, Bar, ReferenceLine,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend 
} from 'recharts';

const COLORS = ['#10B981', '#F43F5E', '#3B82F6']; // Vert, Rouge, Bleu

export default function FinancialCharts({ data, result }) {
  
  // 1. DONNÉES POUR LE CAMEMBERT (Budget)
  const pieData = [
    { name: 'Reste à vivre', value: Math.max(0, (data.revenu_mensuel || 0) - ((data.dette_totale || 0) / 12)) },
    { name: 'Dettes', value: (data.dette_totale || 0) / 12 },
    { name: 'Épargne', value: (data.epargne || 0) / 10 },
  ];

  // 2. DONNÉES POUR LA JAUGE D'ENDETTEMENT (BarChart)
  const revenuAnnuel = (data.revenu_mensuel || 1) * 12;
  const ratioActuel = ((data.dette_totale || 0) / revenuAnnuel) * 100;
  const barData = [
    { name: 'Votre Ratio', value: ratioActuel, limit: 33 }
  ];

  // 3. DONNÉES POUR LA COURBE (AreaChart) - Seulement si on a un résultat IA
  const areaData = result?.finance?.tableau_amortissement?.filter((_, i) => i % 2 === 0) || []; // On prend 1 mois sur 2 pour alléger

  // 4. DONNÉES POUR LE RADAR (Profil Scoring) - Simulation de notation sur 100
  const radarData = [
    { subject: 'Revenus', A: Math.min(100, (data.revenu_mensuel / 4000) * 100), fullMark: 100 },
    { subject: 'Stabilité', A: Math.min(100, (data.anciennete_emploi / 5) * 100), fullMark: 100 },
    { subject: 'Épargne', A: Math.min(100, (data.epargne / 10000) * 100), fullMark: 100 },
    { subject: 'Sérénité', A: Math.max(0, 100 - ratioActuel), fullMark: 100 },
    { subject: 'Confiance IA', A: result ? result.score_confiance : 50, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      
      {/* GRAPHIQUE 1 : RÉPARTITION (Budget) */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2"> Budget Mensuel Estimé</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#fff' }} formatter={(val) => `${Math.round(val)} €`} />
              <Legend wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPHIQUE 2 : RISQUE D'ENDETTEMENT (Jauge) */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-200 mb-4"> Analyse du Risque</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" domain={[0, 60]} hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#fff' }} />
              <Legend />
              <ReferenceLine x={33} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Limite Max (33%)', fill: 'red', fontSize: 12 }} />
              <Bar dataKey="value" name="Endettement (%)" barSize={40} radius={[0, 10, 10, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 33 ? '#F43F5E' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">La ligne rouge représente le seuil d'alerte des banques.</p>
      </div>

      {/* GRAPHIQUE 3 : COURBE D'AMORTISSEMENT (Seulement si résultat) */}
      {result && (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold text-gray-200 mb-4"> Projection du Remboursement</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRestant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="mois" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="restant" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRestant)" name="Capital Restant Dû" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPHIQUE 4 : RADAR SCORING (Profil) */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 col-span-1 md:col-span-2 flex flex-col items-center">
         <h3 className="text-lg font-bold text-gray-200 mb-4"> Votre Profil Financier (Scoring IA)</h3>
         <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Votre Profil" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
         </div>
         <p className="text-xs text-gray-400 mt-2">Plus la surface violette est grande, plus votre dossier est solide.</p>
      </div>

    </div>
  );
}