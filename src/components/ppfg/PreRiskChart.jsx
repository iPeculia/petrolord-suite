import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, AlertOctagon, BadgeCheck, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PreRiskChart = ({ risks }) => {
  const getSeverityIcon = (sev) => {
    if (sev === 'Critical') return <AlertOctagon className="w-5 h-5 text-red-500" />;
    if (sev === 'Warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <BadgeCheck className="w-5 h-5 text-emerald-500" />;
  };

  const getSeverityColor = (sev) => {
    if (sev === 'Critical') return 'bg-red-950 border-red-900 text-red-200';
    if (sev === 'Warning') return 'bg-yellow-950 border-yellow-900 text-yellow-200';
    return 'bg-emerald-950 border-emerald-900 text-emerald-200';
  };

  return (
    <div className="w-full h-full bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col">
      <h3 className="text-slate-100 font-bold text-sm mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-purple-500 rounded-sm"></span>
        Pre-Drilling Risk Register
      </h3>

      <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 border-b border-slate-800 pb-2 px-2">
        <div className="col-span-2">Depth (ft)</div>
        <div className="col-span-3">Hazard</div>
        <div className="col-span-1 text-center">Severity</div>
        <div className="col-span-4">Mitigation</div>
        <div className="col-span-2">Notes</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 mt-2">
          {risks.map((risk, idx) => (
            <div key={idx} className={`grid grid-cols-12 gap-4 p-3 rounded border ${getSeverityColor(risk.severity)} items-center`}>
              <div className="col-span-2 font-mono text-xs">
                {risk.startDepth} - {risk.endDepth}
              </div>
              <div className="col-span-3 font-medium text-sm flex items-center gap-2">
                {risk.hazard}
              </div>
              <div className="col-span-1 flex justify-center">
                {getSeverityIcon(risk.severity)}
              </div>
              <div className="col-span-4 text-xs opacity-90">
                {risk.mitigation}
              </div>
              <div className="col-span-2 text-xs opacity-70 flex items-center gap-1">
                <Info className="w-3 h-3" /> {risk.comments}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PreRiskChart;