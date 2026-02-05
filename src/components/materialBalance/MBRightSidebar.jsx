import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Info } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const MBRightSidebar = () => {
  const { reservoirMetadata, getOOIPEstimate } = useMaterialBalance();

  return (
    <div className="w-64 bg-slate-950 border-l border-slate-800 flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 bg-slate-900/30">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3 h-3 text-purple-500" /> Parameters Summary
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Metadata Display */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold mb-2 px-1">PROPERTIES</div>
            <div className="space-y-2 p-2 bg-slate-900/30 rounded border border-slate-800/50">
              <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-1">
                <span className="text-slate-500">Porosity</span>
                <span className="text-slate-200 font-mono">{reservoirMetadata.phi}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-1">
                <span className="text-slate-500">Swi</span>
                <span className="text-slate-200 font-mono">{reservoirMetadata.Swi}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-1">
                <span className="text-slate-500">Comp. (cf)</span>
                <span className="text-slate-200 font-mono">{reservoirMetadata.cf?.toExponential(1)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-500">Drive</span>
                <span className="text-slate-200 capitalize">{reservoirMetadata.driveType}</span>
              </div>
            </div>
          </div>

          {/* Results Preview */}
          <div>
            <div className="text-[10px] text-slate-500 font-semibold mb-2 px-1 mt-2">VOLUMETRIC ESTIMATE</div>
            <div className="p-3 bg-green-900/10 rounded border border-green-900/30 space-y-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500">STOIIP (Volumetric)</span>
                <span className="text-lg font-bold text-green-400">{getOOIPEstimate()}</span>
              </div>
            </div>
          </div>

          {/* Help / Info */}
          <div className="p-3 bg-blue-900/10 rounded border border-blue-900/30 flex gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Ensure all PVT and Production data is loaded before proceeding to Diagnostics tab.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MBRightSidebar;