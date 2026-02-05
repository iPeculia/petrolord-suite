import React from 'react';
import { useMarkers, useHorizons } from '@/hooks/useWellCorrelation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, MapPin, Plus, Trash2, Edit2 } from 'lucide-react';

const HorizonsMarkersTab = () => {
  const { markers, removeMarker } = useMarkers();
  const { horizons, removeHorizon } = useHorizons();

  return (
    <div className="h-full w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 overflow-hidden">
      {/* Markers Section */}
      <Card className="bg-slate-900/50 border-slate-800 h-full flex flex-col shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800 bg-slate-900">
          <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <div className="p-1.5 rounded bg-yellow-500/10">
              <MapPin className="w-4 h-4 text-yellow-500" />
            </div>
            Markers (Formation Tops)
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8 border-slate-700 hover:bg-slate-800 text-slate-300">
            <Plus className="w-3 h-3 mr-1" /> Add New
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {markers.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MapPin className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No markers defined.</p>
                  <p className="text-slate-600 text-xs mt-1">Import markers or pick them in the correlation panel.</p>
                </div>
              ) : (
                markers.map(marker => (
                  <div key={marker.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-800/60 hover:border-slate-600 hover:bg-slate-800 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full ring-2 ring-slate-900 shadow-sm" style={{ backgroundColor: marker.color }} />
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 font-medium">{marker.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span className="bg-slate-900 px-1 rounded">MD: {marker.depth}m</span>
                          <span>•</span>
                          <span>Well: {marker.wellId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-400 hover:bg-slate-700">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-slate-700"
                        onClick={() => removeMarker(marker.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Horizons Section */}
      <Card className="bg-slate-900/50 border-slate-800 h-full flex flex-col shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800 bg-slate-900">
          <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-500/10">
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            Horizons (Stratigraphy)
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8 border-slate-700 hover:bg-slate-800 text-slate-300">
            <Plus className="w-3 h-3 mr-1" /> Add New
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {horizons.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Layers className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No horizons defined.</p>
                </div>
              ) : (
                horizons.map(horizon => (
                  <div key={horizon.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-800/60 hover:border-slate-600 hover:bg-slate-800 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-1.5 rounded-full shadow-sm ring-1 ring-slate-900/50" style={{ backgroundColor: horizon.color }} />
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 font-medium">{horizon.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span>Ref Depth: {horizon.depth}m</span>
                          <span>•</span>
                          <span className="capitalize">{horizon.style || 'solid'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-400 hover:bg-slate-700">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-slate-700"
                        onClick={() => removeHorizon(horizon.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorizonsMarkersTab;