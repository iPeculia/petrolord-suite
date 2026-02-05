import React from 'react';
import { Activity, CheckCircle2, Database, AlertTriangle } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const MBBottomPanel = () => {
  const { dataStatus, currentProject } = useMaterialBalance();

  return (
    <div className="h-8 bg-slate-950 border-t border-slate-800 flex items-center px-4 justify-between text-[10px] text-slate-500 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Database className="w-3 h-3" />
          <span>Data: {dataStatus?.production === 'Complete' ? 'Ready' : 'Incomplete'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3" />
          <span>Engine: Idle</span>
        </div>
        {currentProject && (
            <div className="flex items-center gap-1.5 text-slate-600">
                <span>ID: {currentProject.id.substring(0,8)}...</span>
            </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>System Online</span>
        </div>
      </div>
    </div>
  );
};

export default MBBottomPanel;