import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Plus, Ruler } from 'lucide-react';

const FaultInterpretationTools = ({ activeFault, setActiveFault, onNewFault, onValidate }) => {
    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-amber-400">
                    <Activity className="w-4 h-4 mr-2" /> Fault Interpretation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Fault Name</Label>
                    <div className="flex gap-2">
                        <Input 
                            value={activeFault?.name || ''} 
                            onChange={(e) => setActiveFault(p => ({...p, name: e.target.value}))}
                            placeholder="New Fault"
                            className="h-8 bg-slate-800 border-slate-700 text-xs"
                        />
                        <Button size="sm" variant="outline" className="h-8 px-2" onClick={onNewFault}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Fault Type</Label>
                    <Select 
                        value={activeFault?.type || 'normal'} 
                        onValueChange={(v) => setActiveFault(p => ({...p, type: v}))}
                    >
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="reverse">Reverse</SelectItem>
                            <SelectItem value="strike-slip">Strike-Slip</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500">Throw</div>
                        <div className="text-sm font-mono text-amber-400">-- m</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-500">Dip</div>
                        <div className="text-sm font-mono text-amber-400">-- °</div>
                    </div>
                </div>
                
                <Button variant="secondary" size="sm" className="w-full text-xs h-7" onClick={onValidate}>
                    <Ruler className="w-3 h-3 mr-2" /> Validate Geometry
                </Button>

                <div className="text-[10px] text-slate-500 italic mt-2 bg-slate-950 p-2 rounded">
                    Click points to define the fault plane. Double-click to finish.
                </div>
            </CardContent>
        </Card>
    );
};

export default FaultInterpretationTools;