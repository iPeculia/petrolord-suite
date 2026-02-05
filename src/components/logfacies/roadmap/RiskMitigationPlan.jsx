import React from 'react';
import { AlertTriangle, ShieldAlert, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const risks = [
    {
        phase: "Phase 2",
        risk: "Model Overfitting",
        prob: "High",
        impact: "Poor generalization to new wells.",
        mitigation: "Implement rigorous Cross-Validation (K-Fold) and regularization (L1/L2). Enforce separate Test/Train sets."
    },
    {
        phase: "Phase 3",
        risk: "Browser Memory Limits",
        prob: "Medium",
        impact: "Crash on large projects (100+ wells).",
        mitigation: "Use WebGL for rendering. Implement data virtualization/windowing (only load visible depth range)."
    },
    {
        phase: "Phase 5",
        risk: "Interpretation Subjectivity",
        prob: "Medium",
        impact: "User distrust in automated results.",
        mitigation: "Provide 'Confidence Scores' and 'Feature Contributions' (Why did the model predict this?). Allow manual overrides."
    },
    {
        phase: "Phase 7",
        risk: "API Rate Limiting",
        prob: "Low",
        impact: "Service denial during batch jobs.",
        mitigation: "Implement token bucket rate limiting on backend. Queue system for heavy jobs."
    }
];

const RiskMitigationPlan = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto h-full">
            {risks.map((r, i) => (
                <Card key={i} className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" /> {r.risk}
                            </CardTitle>
                            <span className="text-xs font-mono text-slate-500">{r.phase}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-4 text-xs">
                            <div>
                                <span className="text-slate-500 block">Probability</span>
                                <span className={r.prob === 'High' ? 'text-red-400' : 'text-yellow-400'}>{r.prob}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Impact</span>
                                <span className="text-slate-300">{r.impact}</span>
                            </div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <h4 className="text-xs font-bold text-green-400 uppercase mb-1 flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" /> Mitigation
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{r.mitigation}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default RiskMitigationPlan;