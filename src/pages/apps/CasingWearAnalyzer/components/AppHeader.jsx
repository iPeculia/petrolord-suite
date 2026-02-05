import React from 'react';
import { Activity } from 'lucide-react';

const AppHeader = () => {
  return (
    <div className="bg-[#252541] border-b border-slate-800 px-6 py-6 flex items-center gap-5 shrink-0">
      <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5">
        <Activity className="w-8 h-8 text-[#FFC107]" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Casing Wear Analyzer</h1>
        <p className="text-sm text-slate-400 mt-1">Predict and mitigate casing wear in deviated wells with advanced contact force modeling.</p>
      </div>
    </div>
  );
};

export default AppHeader;