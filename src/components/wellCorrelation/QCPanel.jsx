import React from 'react';
import { useMarkers } from '@/hooks/useWellCorrelation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Info, Ruler, Search, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const QCPanel = ({ selectedMarkerId }) => {
  const { markers } = useMarkers();
  const selectedMarker = markers.find(m => m.id === selectedMarkerId);
  
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Quality Control</h3>
        </div>
        <Info className="w-3 h-3 text-slate-600 cursor-help" />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Selected Item Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Selection</h4>
            {selectedMarker ? (
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedMarker.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{selectedMarker.id}</span>
                  </div>
                  <div className="w-4 h-4 rounded-full ring-2 ring-slate-800" style={{ backgroundColor: selectedMarker.color }} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Quality Status</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/50">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Measured Depth</span>
                    <span className="font-mono text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{selectedMarker.depth} m</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">True Vertical Depth</span>
                    <span className="font-mono text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{(selectedMarker.depth * 0.98).toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Well ID</span>
                    <span className="font-mono text-blue-300 hover:underline cursor-pointer">{selectedMarker.wellId}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-10 border border-dashed border-slate-800 rounded-lg bg-slate-900/30 flex flex-col items-center">
                <Search className="w-8 h-8 mb-2 opacity-20" />
                <p>No marker selected</p>
                <p className="text-[10px] opacity-60 mt-1">Click a marker in the correlation panel</p>
              </div>
            )}
          </div>

          <Separator className="bg-slate-800" />

          {/* Project Health Stats */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Project Health</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-300">Marker Consistency</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-medium">98%</span>
              </div>
              
              <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-300">Loop Closure Error</span>
                </div>
                <span className="text-xs text-amber-400 font-mono font-medium">1.2m</span>
              </div>
              
              <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-300">Missing Curves</span>
                </div>
                <span className="text-xs text-rose-400 font-mono font-medium">3 Wells</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default QCPanel;