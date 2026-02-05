import React from 'react';
import { FolderOpen, History, Clock, GitBranch } from 'lucide-react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';

const StatCard = ({ icon: Icon, label, value, subValue }) => (
  <div className="bg-[#252541] border border-slate-700/50 rounded-lg p-4 flex items-center gap-4 hover:border-[#FFC107]/50 transition-all group shadow-sm">
    <div className="p-3 bg-[#1a1a2e] rounded-md group-hover:bg-[#FFC107]/10 transition-colors">
      <Icon className="w-5 h-5 text-[#FFC107]" />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-lg font-bold text-slate-100 leading-tight">{value}</p>
      {subValue && <p className="text-[10px] text-slate-500">{subValue}</p>}
    </div>
  </div>
);

const QuickStats = () => {
  const { projects, activeWearCase, scenarios } = useCasingWearAnalyzer();

  // Safely derive stats from context data
  const totalProjects = projects ? projects.length : 0;
  const activeVersionName = activeWearCase ? activeWearCase.name : 'No Version Selected';
  
  // Try to find a last calculation timestamp safely
  let lastCalcText = 'Not yet calculated';
  if (activeWearCase?.wearProfile?.summary) {
    // Assuming calculation happened if results exist, using current time if timestamp missing
    // In a real scenario, this would come from activeWearCase.lastCalculatedAt
    lastCalcText = 'Results Available'; 
  }

  const totalScenarios = scenarios ? scenarios.length : 0;

  return (
    <div className="bg-[#1a1a2e] border-b border-slate-800 px-6 py-4 shrink-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={FolderOpen} 
          label="Total Projects" 
          value={totalProjects} 
          subValue="Active Database"
        />
        <StatCard 
          icon={History} 
          label="Active Version" 
          value={activeVersionName}
          subValue={activeWearCase ? 'Ready for Analysis' : 'Select a case'}
        />
        <StatCard 
          icon={Clock} 
          label="Last Calculation" 
          value={lastCalcText}
          subValue="Status"
        />
        <StatCard 
          icon={GitBranch} 
          label="Total Scenarios" 
          value={totalScenarios}
          subValue="Comparisons"
        />
      </div>
    </div>
  );
};

export default QuickStats;