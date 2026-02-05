import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, ServerCrash, DatabaseZap } from 'lucide-react';

const RiskMitigationVelocity = () => {
  const risks = [
    {
      id: 1,
      title: "Data Quality Issues",
      impact: "High",
      prob: "High",
      mitigation: "Implement rigorous LAS quality checkers (Phase 1) and misfit analysis dashboards (Phase 6) to flag outliers automatically.",
      icon: DatabaseZap,
      color: "text-red-400"
    },
    {
      id: 2,
      title: "Scalability Bottlenecks",
      impact: "High",
      prob: "Medium",
      mitigation: "Use Web Workers for client-side calc and offload massive grid operations to Supabase Edge Functions or GPU-accelerated compute (Phase 10).",
      icon: ServerCrash,
      color: "text-orange-400"
    },
    {
      id: 3,
      title: "User Adoption Resistance",
      impact: "Medium",
      prob: "Medium",
      mitigation: "Introduce Guided Mode (Phase 5) for non-experts and ensure UI familiarity with legacy tools like Petrel via integration (Phase 8).",
      icon: AlertTriangle,
      color: "text-yellow-400"
    },
    {
      id: 4,
      title: "Model Accuracy Variance",
      impact: "High",
      prob: "Low",
      mitigation: "Enforce blind well testing protocols and utilize Uncertainty Analysis (Phase 3) to quantify P10/P90 ranges.",
      icon: ShieldCheck,
      color: "text-blue-400"
    }
  ];

  return (
    <div className="p-4 h-full bg-slate-950 overflow-y-auto space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Risk Management Plan</h2>
      {risks.map(risk => (
        <Card key={risk.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-slate-200">
                    <risk.icon className={`w-5 h-5 ${risk.color}`} />
                    {risk.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 text-xs text-slate-500 mb-3">
                    <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Impact: <span className="text-slate-300">{risk.impact}</span></span>
                    <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Probability: <span className="text-slate-300">{risk.prob}</span></span>
                </div>
                <p className="text-sm text-slate-400 bg-slate-950/50 p-3 rounded border border-slate-800/50">
                    <span className="font-semibold text-emerald-500">Mitigation Strategy:</span> {risk.mitigation}
                </p>
            </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RiskMitigationVelocity;