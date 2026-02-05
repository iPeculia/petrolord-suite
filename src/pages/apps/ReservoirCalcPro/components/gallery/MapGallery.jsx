import React from 'react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map } from 'lucide-react';

const MapGallery = () => {
    const { state } = useReservoirCalc();
    
    // FIX: Ensure maps is always an array
    const maps = Array.isArray(state.results) ? state.results : [];

    if (!maps || maps.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-4 border border-dashed border-slate-800 rounded-lg m-2">
                <Map className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No maps generated yet.</p>
                <p className="text-xs mt-1">Go to the Map Generator tab to create property maps.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {maps.map((map) => (
                    <Card key={map.id} className="bg-slate-900 border-slate-800 overflow-hidden hover:border-blue-500/50 transition-colors">
                        <div className="h-32 bg-slate-950 relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Map className="w-8 h-8 text-slate-700" />
                            </div>
                            <Badge className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-slate-300 border-slate-700">
                                {map.unit}
                            </Badge>
                        </div>
                        <CardContent className="p-3">
                            <h4 className="font-bold text-sm text-slate-200 truncate" title={map.name}>{map.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1">
                                Type: {map.type}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default MapGallery;