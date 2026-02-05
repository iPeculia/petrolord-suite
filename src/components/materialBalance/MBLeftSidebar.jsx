import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Layers, Settings2 } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const MBLeftSidebar = () => {
  const { currentTank, setCurrentTank, currentProject } = useMaterialBalance();

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 bg-slate-900/30">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-3 h-3 text-blue-500" /> Project Explorer
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Tank Selector */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold mb-2 px-1">TANKS / RESERVOIRS</div>
            <div className="space-y-1">
              {(currentProject?.tanks || ['Tank 1']).map((tank, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-xs transition-colors ${
                    currentTank === tank 
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                  onClick={() => setCurrentTank(tank)}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {tank}
                </div>
              ))}
            </div>
          </div>

          {/* Data Quick View */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold mb-2 px-1 mt-4">DATA SUMMARY</div>
            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-300">Oil</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Points</span>
                <span className="text-slate-300">0</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last Date</span>
                <span className="text-slate-300">-</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-slate-800 bg-slate-900/20">
        <button className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 py-1">
          <Settings2 className="w-3.5 h-3.5" /> Project Settings
        </button>
      </div>
    </div>
  );
};

export default MBLeftSidebar;