import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ParameterHistoryTimeline = ({ history }) => {
  return (
    <ScrollArea className="h-32 w-full p-4 border-t border-slate-800 bg-slate-950">
        <h4 className="text-xs font-bold text-slate-400 mb-2 sticky top-0 bg-slate-950">Change History</h4>
        <div className="space-y-2">
            {history.slice().reverse().map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-500 font-mono">{entry.timestamp.toLocaleTimeString()}</span>
                    <span className="text-slate-300">{entry.change}</span>
                </div>
            ))}
            {history.length === 0 && <div className="text-[10px] text-slate-600 italic">No changes yet</div>}
        </div>
    </ScrollArea>
  );
};

export default ParameterHistoryTimeline;