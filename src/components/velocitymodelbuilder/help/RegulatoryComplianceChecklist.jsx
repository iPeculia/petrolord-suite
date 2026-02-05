import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const RegulatoryComplianceChecklist = () => {
  const items = [
    "Traceability of all velocity input data sources",
    "Versioning of final velocity models used for reserves booking",
    "Documentation of uncertainty ranges (P10/P90)",
    "Secure storage of proprietary checkshot data",
    "Audit logs of user access and modifications"
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">Regulatory Compliance Checklist</h3>
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default RegulatoryComplianceChecklist;