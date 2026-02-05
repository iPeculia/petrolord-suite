import React from 'react';
import { Plus, Trash2, MapPin, Database, FileDigit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const InputPanel = ({ project, setProject, wells, setWells, selectedWellId, setSelectedWellId }) => {
  
  const addWell = () => {
    const newWell = {
        id: crypto.randomUUID(),
        well_name: `New Well ${wells.length + 1}`,
        surface_x: 0,
        surface_y: 0,
        curves: [],
        tops: []
    };
    setWells([...wells, newWell]);
    setSelectedWellId(newWell.id);
  };

  const removeWell = (id) => {
    setWells(wells.filter(w => w.id !== id));
    if (selectedWellId === id) setSelectedWellId(null);
  };

  const updateWell = (id, field, value) => {
    setWells(wells.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  return (
    <div className="p-4 space-y-6">
        <div>
            <Label className="text-slate-400">Project Name</Label>
            <Input 
                value={project.name} 
                onChange={(e) => setProject({...project, name: e.target.value})} 
                className="bg-slate-800 border-slate-700 mt-1"
            />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label className="text-rose-400 font-semibold">Wells ({wells.length})</Label>
                <Button size="sm" variant="ghost" onClick={addWell} id="add-well-btn">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            
            <div className="space-y-2">
                {wells.map(well => (
                    <Card 
                        key={well.id} 
                        className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${selectedWellId === well.id ? 'ring-1 ring-rose-500 bg-slate-800' : 'hover:bg-slate-800'}`}
                        onClick={() => setSelectedWellId(well.id)}
                    >
                        <CardContent className="p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    <Database className="w-4 h-4 text-rose-400" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-white truncate">{well.well_name}</p>
                                    <p className="text-[10px] text-slate-500">{well.curves?.length || 0} curves • {well.tops?.length || 0} tops</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={(e) => { e.stopPropagation(); removeWell(well.id); }}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {selectedWellId && (
            <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-white mb-3">Selected Well Properties</h4>
                {wells.filter(w => w.id === selectedWellId).map(w => (
                    <div key={w.id} className="space-y-3">
                        <div>
                            <Label className="text-xs">Well Name</Label>
                            <Input 
                                value={w.well_name} 
                                onChange={(e) => updateWell(w.id, 'well_name', e.target.value)} 
                                className="h-8 bg-slate-900 border-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs">X Coord</Label>
                                <Input 
                                    type="number" 
                                    value={w.surface_x} 
                                    onChange={(e) => updateWell(w.id, 'surface_x', e.target.value)} 
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Y Coord</Label>
                                <Input 
                                    type="number" 
                                    value={w.surface_y} 
                                    onChange={(e) => updateWell(w.id, 'surface_y', e.target.value)} 
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                        </div>
                        
                        <div className="p-3 bg-slate-900 rounded border border-slate-800 text-center cursor-not-allowed opacity-50">
                            <FileDigit className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                            <p className="text-xs text-slate-500">Upload LAS File (Disabled in Audit Mode)</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default InputPanel;