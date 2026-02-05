import React from 'react';
import { useHorizons } from '@/hooks/useWellCorrelation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, EyeOff, Plus } from 'lucide-react';

const HorizonList = () => {
  const { horizons, deleteHorizon } = useHorizons();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase">Horizons</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {horizons.map(horizon => (
            <div key={horizon.id} className="flex items-center justify-between p-2 rounded bg-slate-900/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 group">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-1" 
                  style={{ 
                    backgroundColor: horizon.color, 
                    borderStyle: horizon.style === 'solid' ? 'solid' : 'dashed' 
                  }} 
                />
                <span className="text-sm font-medium text-slate-200">{horizon.name}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-400 hover:text-red-400"
                  onClick={() => deleteHorizon(horizon.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HorizonList;