import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check, X, GitMerge } from 'lucide-react';

const MOCK_SUGGESTIONS = [
  { id: 1, name: 'Top Cretaceous', well: 'Well-A2', depth: 1245, confidence: 0.88 },
  { id: 2, name: 'Base Cretaceous', well: 'Well-A2', depth: 1395, confidence: 0.75 },
  { id: 3, name: 'Seabed', well: 'Well-A2', depth: 1075, confidence: 0.95 }
];

const HorizonSuggestions = () => {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300">Suggested Picks</h4>
        <span className="text-[10px] text-slate-500">{MOCK_SUGGESTIONS.length} found</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {MOCK_SUGGESTIONS.map(s => (
            <div key={s.id} className="p-3 bg-slate-900 rounded border border-slate-800 hover:border-purple-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-3 h-3 text-purple-400" />
                    <span className="text-sm font-medium text-slate-200">{s.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {s.well} @ <span className="text-slate-300 font-mono">{s.depth}m</span>
                  </div>
                </div>
                <div className={`text-[10px] font-bold ${s.confidence > 0.8 ? 'text-green-400' : 'text-amber-400'}`}>
                  {(s.confidence * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Button size="sm" className="h-6 flex-1 bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-900/50 text-[10px]">
                  <Check className="w-3 h-3 mr-1" /> Accept
                </Button>
                <Button size="sm" className="h-6 flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 text-[10px]">
                  <X className="w-3 h-3 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HorizonSuggestions;