import React from 'react';
import { Button } from '@/components/ui/button';
import { Ruler, MousePointer2, Maximize } from 'lucide-react';

const MapMeasurementTools = ({ activeTool, setActiveTool, measurePoints, setMeasurePoints }) => {
    const clear = () => {
        if (setActiveTool) setActiveTool('none');
        if (setMeasurePoints) setMeasurePoints([]);
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                <Button 
                    variant={activeTool === 'none' ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={clear} 
                    className="h-8 text-xs"
                >
                    <MousePointer2 className="w-3 h-3 mr-1" /> None
                </Button>
                <Button 
                    variant={activeTool === 'dist' ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => { if(setActiveTool) setActiveTool('dist'); if(setMeasurePoints) setMeasurePoints([]); }}
                    className={`h-8 text-xs ${activeTool === 'dist' ? 'bg-lime-500/20 text-lime-300 border-lime-500/50' : ''}`}
                >
                    <Ruler className="w-3 h-3 mr-1" /> Dist
                </Button>
                <Button 
                    variant={activeTool === 'area' ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => { if(setActiveTool) setActiveTool('area'); if(setMeasurePoints) setMeasurePoints([]); }}
                    className={`h-8 text-xs ${activeTool === 'area' ? 'bg-lime-500/20 text-lime-300 border-lime-500/50' : ''}`}
                >
                    <Maximize className="w-3 h-3 mr-1" /> Area
                </Button>
            </div>
            
            {activeTool !== 'none' && (
                <div className="text-[10px] text-lime-400/80 bg-lime-500/10 p-2 rounded border border-lime-500/20">
                    Click map to measure. 
                    {measurePoints && measurePoints.length > 0 && <span className="block mt-1 font-bold">{measurePoints.length} points added.</span>}
                </div>
            )}
        </div>
    );
};

export default MapMeasurementTools;