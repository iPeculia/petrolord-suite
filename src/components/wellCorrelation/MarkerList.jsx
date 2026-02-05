import React from 'react';
import { useMarkers, useHorizons } from '@/hooks/useWellCorrelation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';

const MarkerList = () => {
  const { markers, deleteMarker } = useMarkers();
  const { horizons } = useHorizons();

  const getHorizonName = (id) => horizons.find(h => h.id === id)?.name || 'Unassigned';

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase">Markers</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {markers.map(marker => (
            <div key={marker.id} className="flex items-center justify-between p-2 rounded bg-slate-900/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 group">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: marker.color }} />
                  <span className="text-sm font-medium text-slate-200">{marker.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{marker.depth}m</span>
                  <span className="text-slate-700">|</span>
                  <span>{getHorizonName(marker.horizonId)}</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-400 hover:text-red-400"
                  onClick={() => deleteMarker(marker.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {markers.length === 0 && (
            <div className="text-center p-4 text-slate-500 text-xs italic">
              No markers defined.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MarkerList;