import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Flag, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MARKER_TYPES = [
    { value: 'Formation', label: 'Formation Top', color: '#FFD700' },
    { value: 'Reservoir', label: 'Reservoir Top', color: '#FF4500' },
    { value: 'Pay', label: 'Net Pay', color: '#32CD32' },
    { value: 'GWC', label: 'Gas-Water Contact', color: '#1E90FF' },
    { value: 'OWC', label: 'Oil-Water Contact', color: '#0000CD' },
    { value: 'Fault', label: 'Fault', color: '#808080' }
];

const MarkerManager = ({ markers, onAddMarker, onDeleteMarker, selectedDepth }) => {
  const [newMarker, setNewMarker] = useState({
    name: '',
    depth: '',
    type: 'Formation',
    color: '#FFD700'
  });

  // Auto-fill depth if selected from log viewer
  React.useEffect(() => {
      if (selectedDepth) {
          setNewMarker(prev => ({ ...prev, depth: selectedDepth.toFixed(1) }));
      }
  }, [selectedDepth]);

  const handleAdd = () => {
      if (!newMarker.name || !newMarker.depth) return;
      onAddMarker(newMarker);
      setNewMarker({ name: '', depth: '', type: 'Formation', color: '#FFD700' });
  };

  const handleTypeChange = (type) => {
      const preset = MARKER_TYPES.find(t => t.value === type);
      setNewMarker(prev => ({ 
          ...prev, 
          type, 
          color: preset ? preset.color : prev.color 
      }));
  };

  return (
    <Card className="h-full flex flex-col bg-slate-900 border-slate-800">
        <CardHeader className="pb-2 border-b border-slate-800">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-yellow-500" /> Markers & Tops
            </CardTitle>
        </CardHeader>
        
        <div className="p-3 border-b border-slate-800 bg-slate-900/50 space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label className="text-xs text-slate-400">Name</Label>
                    <Input 
                        className="h-8 bg-slate-950 border-slate-800" 
                        placeholder="e.g. Top Austin Chalk"
                        value={newMarker.name}
                        onChange={e => setNewMarker({...newMarker, name: e.target.value})}
                    />
                </div>
                <div>
                    <Label className="text-xs text-slate-400">Depth (MD)</Label>
                    <div className="flex items-center gap-1">
                        <Input 
                            className="h-8 bg-slate-950 border-slate-800" 
                            type="number"
                            placeholder="0.00"
                            value={newMarker.depth}
                            onChange={e => setNewMarker({...newMarker, depth: e.target.value})}
                        />
                        {selectedDepth && (
                             <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-blue-400 hover:text-blue-300"
                                title="Use Selected Depth"
                                onClick={() => setNewMarker(prev => ({ ...prev, depth: selectedDepth.toFixed(1) }))}
                             >
                                 <MapPin className="w-4 h-4" />
                             </Button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                    <Label className="text-xs text-slate-400">Type</Label>
                    <Select value={newMarker.type} onValueChange={handleTypeChange}>
                        <SelectTrigger className="h-8 bg-slate-950 border-slate-800">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MARKER_TYPES.map(t => (
                                <SelectItem key={t.value} value={t.value}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: t.color}} />
                                        {t.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs text-slate-400 mb-1.5 block">Color</Label>
                    <div className="flex gap-2">
                         <Input 
                            type="color" 
                            className="h-8 w-12 p-1 bg-slate-950 border-slate-800 cursor-pointer"
                            value={newMarker.color}
                            onChange={e => setNewMarker({...newMarker, color: e.target.value})}
                         />
                         <Button onClick={handleAdd} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500 h-8">
                            <Plus className="w-3 h-3 mr-1" /> Add
                         </Button>
                    </div>
                </div>
            </div>
        </div>

        <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
                {markers.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                        No markers defined. <br/> Click chart or enter depth to add.
                    </div>
                ) : (
                    markers.map((marker) => (
                        <div 
                            key={marker.id} 
                            className="flex items-center justify-between p-2 rounded hover:bg-slate-800 group border border-transparent hover:border-slate-700 transition-all"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-1 h-8 rounded-full shrink-0" style={{backgroundColor: marker.color}} />
                                <div className="min-w-0">
                                    <div className="font-medium text-sm text-slate-200 truncate" title={marker.name}>{marker.name}</div>
                                    <div className="text-[10px] text-slate-500 flex gap-2">
                                        <span className="font-mono text-slate-400">{Number(marker.depth).toFixed(1)} ft</span>
                                        <span>• {marker.type}</span>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onDeleteMarker(marker.id)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
    </Card>
  );
};

export default MarkerManager;