import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Save, Trash2, Plus } from 'lucide-react';

const FaultModelingPanel = ({ activeFault, setActiveFault, onSave, onDelete, faultList = [] }) => {
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-red-400">
                    <Activity className="w-4 h-4 mr-2" /> Fault Modeling
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Existing Faults</Label>
                    <div className="flex gap-2">
                        <Select value={activeFault?.id} onValueChange={(id) => setActiveFault(faultList.find(f => f.id === id))}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
                                <SelectValue placeholder="Select Fault" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                {faultList.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button size="sm" variant="secondary" className="h-8 px-2" onClick={() => setActiveFault({ id: null, name: 'New Fault', type: 'Normal', dip: 60, throw: 0 })}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Fault Name</Label>
                    <Input 
                        value={activeFault?.name || ''} 
                        onChange={(e) => setActiveFault(prev => ({ ...prev, name: e.target.value }))}
                        className="h-8 bg-slate-800 border-slate-700" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Type</Label>
                        <Select value={activeFault?.type || 'Normal'} onValueChange={(v) => setActiveFault(p => ({...p, type: v}))}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="Reverse">Reverse</SelectItem>
                                <SelectItem value="Strike-Slip">Strike-Slip</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Dip (deg)</Label>
                        <Input 
                            type="number" 
                            value={activeFault?.dip || 0} 
                            onChange={(e) => setActiveFault(p => ({...p, dip: parseFloat(e.target.value)}))}
                            className="h-8 bg-slate-800 border-slate-700" 
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-xs" size="sm" onClick={onSave}>
                        <Save className="w-3 h-3 mr-2" /> Save Fault
                    </Button>
                    {activeFault?.id && (
                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(activeFault.id)}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default FaultModelingPanel;