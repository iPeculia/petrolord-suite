import React from 'react';
import { useAdvancedVisualization } from '@/hooks/useAdvancedVisualization';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Trash2 } from 'lucide-react';

const AnalysisPanel = ({ onClose, cursorData }) => {
  const { measurements, clearMeasurements } = useAdvancedVisualization();

  return (
    <div className="w-64 bg-slate-950 border-l border-slate-800 flex flex-col h-full shadow-2xl z-20">
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-3 bg-slate-900">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Analysis</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          
          {/* Cursor Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase">Cursor</h4>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Depth (MD)</span>
                <span className="font-mono text-blue-400">{cursorData?.depth?.toFixed(1) || '-'} m</span>
              </div>
              {cursorData?.values && Object.entries(cursorData.values).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-400">{key}</span>
                  <span className="font-mono text-slate-200">{val?.toFixed(2) || '-'}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Measurements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Measurements</h4>
              {measurements.length > 0 && (
                <Button variant="ghost" size="xs" className="h-5 text-[10px] text-red-400" onClick={clearMeasurements}>
                  Clear
                </Button>
              )}
            </div>
            
            {measurements.length === 0 ? (
              <div className="text-xs text-slate-600 italic text-center py-2">No measurements</div>
            ) : (
              <div className="space-y-1">
                {measurements.map((m, idx) => (
                  <div key={m.id} className="bg-slate-900 p-2 rounded border border-slate-800 text-xs flex justify-between">
                    <span className="text-slate-400">#{idx + 1} Depth Diff</span>
                    <span className="font-mono text-emerald-400">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </ScrollArea>
    </div>
  );
};

export default AnalysisPanel;