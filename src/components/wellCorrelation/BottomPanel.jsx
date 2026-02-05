import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Info, CheckCircle2 } from 'lucide-react';

const BottomPanel = ({ height }) => {
  const logs = [
    { id: 1, type: 'info', message: 'Project "North Sea Correlation" loaded successfully.', time: '10:30:05' },
    { id: 2, type: 'success', message: 'Well-A1 added to correlation panel.', time: '10:30:12' },
    { id: 3, type: 'warning', message: 'Well-A2: Missing sonic log curve.', time: '10:31:00' }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'warning': return <AlertCircle className="w-3 h-3 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <div className="bg-slate-950 border-t border-slate-800 flex flex-col" style={{ height }}>
      <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Activity Log</span>
        <span className="text-[10px] text-slate-600">Ready</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {logs.map(log => (
            <div key={log.id} className="flex items-center gap-2 px-3 py-1 hover:bg-slate-900/50 border-b border-slate-900/50">
              <span className="text-[10px] font-mono text-slate-600 min-w-[50px]">{log.time}</span>
              {getIcon(log.type)}
              <span className="text-xs text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BottomPanel;