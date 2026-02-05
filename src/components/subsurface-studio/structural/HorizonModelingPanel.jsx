import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, Plus, Save, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HorizonModelingPanel = ({ activeHorizon, setActiveHorizon, horizonList = [], onSave, onDelete }) => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-yellow-400">
                    <Layers className="w-4 h-4 mr-2" /> Horizon Modeling
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Managed Horizons</Label>
                    <div className="flex gap-2">
                        <Select value={activeHorizon?.id} onValueChange={(id) => setActiveHorizon(horizonList.find(h => h.id === id))}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
                                <SelectValue placeholder="Select Horizon" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                {horizonList.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button size="sm" variant="secondary" className="h-8 px-2" onClick={() => setActiveHorizon({ id: null, name: 'New Horizon', type: 'Seismic', depth: 2000 })}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Horizon Name</Label>
                    <Input 
                        value={activeHorizon?.name || ''} 
                        onChange={(e) => setActiveHorizon(prev => ({ ...prev, name: e.target.value }))}
                        className="h-8 bg-slate-800 border-slate-700" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Source Type</Label>
                         <Select value={activeHorizon?.type || 'Seismic'} onValueChange={(v) => setActiveHorizon(p => ({...p, type: v}))}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Seismic">Seismic Pick</SelectItem>
                                <SelectItem value="Well">Well Tops</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Approx Depth (m)</Label>
                        <Input 
                            type="number" 
                            value={activeHorizon?.depth || 0} 
                            onChange={(e) => setActiveHorizon(p => ({...p, depth: parseFloat(e.target.value)}))}
                            className="h-8 bg-slate-800 border-slate-700" 
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs" size="sm" onClick={onSave}>
                        <Save className="w-3 h-3 mr-2" /> Save Horizon
                    </Button>
                     {activeHorizon?.id && (
                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(activeHorizon.id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default HorizonModelingPanel;