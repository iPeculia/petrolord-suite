import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { PlusCircle, Edit2, Trash2, AlertCircle, ArrowDown, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const LOAD_CASE_TYPES = [
    "Drilling", "Production", "Cementing", "Pressure Test", "Kick", "Stimulation", "Collapse"
];

const LoadCasesTab = () => {
    const { loadCases, saveLoadCase, deleteLoadCase } = useCasingTubingDesign();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentCase, setCurrentCase] = useState(null);

    // Form State for Editor
    const [formData, setFormData] = useState({
        name: '',
        type: 'Drilling',
        internal_fluid_density: 8.5,
        surface_pressure: 0,
        external_profile: 'Pore Pressure',
        axial_force_klb: 0
    });

    const handleNewCase = () => {
        setFormData({
            name: `Load Case ${loadCases.length + 1}`,
            type: 'Drilling',
            internal_fluid_density: 8.5,
            surface_pressure: 0,
            external_profile: 'Pore Pressure',
            axial_force_klb: 0
        });
        setCurrentCase(null);
        setIsEditorOpen(true);
    };

    const handleEditCase = (lc) => {
        setFormData({ ...lc });
        setCurrentCase(lc);
        setIsEditorOpen(true);
    };

    const handleSave = () => {
        saveLoadCase({ ...formData, id: currentCase?.id });
        setIsEditorOpen(false);
    };

    return (
        <div className="h-full flex flex-col space-y-6 p-1">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div>
                    <h3 className="text-lg font-medium text-white">Design Load Cases</h3>
                    <p className="text-sm text-slate-400">Define scenarios to verify casing integrity.</p>
                </div>
                <Button onClick={handleNewCase} className="bg-lime-600 hover:bg-lime-700 text-white shadow-lg shadow-lime-900/20">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Load Case
                </Button>
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
                    {loadCases.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                            <AlertCircle className="w-10 h-10 text-slate-600 mb-4" />
                            <p className="text-slate-500 font-medium">No load cases defined yet.</p>
                            <Button variant="link" onClick={handleNewCase} className="text-blue-400">Create your first case</Button>
                        </div>
                    )}
                    
                    {loadCases.map((lc) => (
                        <Card key={lc.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-800/30 group">
                            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-800/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-sm font-bold text-white flex items-center">
                                            {lc.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs mt-1.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                lc.type === 'Production' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900/50' : 
                                                lc.type === 'Kick' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                                'bg-blue-900/20 text-blue-400 border-blue-900/50'
                                            }`}>
                                                {lc.type.toUpperCase()}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700" onClick={() => handleEditCase(lc)}>
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-slate-700" onClick={() => deleteLoadCase(lc.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-3 px-4 pb-4 text-xs space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                                        <span className="text-[10px] text-slate-500 block mb-1 flex items-center"><ShieldAlert className="w-3 h-3 mr-1"/> Int. Density</span>
                                        <span className="text-slate-200 font-mono font-medium">{lc.internal_fluid_density} ppg</span>
                                    </div>
                                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                                        <span className="text-[10px] text-slate-500 block mb-1 flex items-center"><ArrowDown className="w-3 h-3 mr-1"/> Surf. Press</span>
                                        <span className="text-slate-200 font-mono font-medium">{lc.surface_pressure} psi</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-slate-400 text-[10px]">
                                    <span className="w-2 h-2 rounded-full bg-slate-600 mr-2"></span>
                                    External: {lc.external_profile}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>

            {/* Editor Dialog */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="max-w-3xl bg-slate-950 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{currentCase ? 'Edit Load Case' : 'New Load Case'}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-6 py-4">
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Case Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-900 border-slate-700 focus:border-lime-500" />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                                    <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {LOAD_CASE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Tabs defaultValue="internal" className="w-full">
                                <TabsList className="bg-slate-900 w-full justify-start border-b border-slate-800 rounded-none h-10 p-0">
                                    <TabsTrigger value="internal" className="data-[state=active]:bg-slate-800 data-[state=active]:text-lime-400 rounded-none h-10 border-b-2 border-transparent data-[state=active]:border-lime-400 px-4 text-xs">Internal Pressure</TabsTrigger>
                                    <TabsTrigger value="external" className="data-[state=active]:bg-slate-800 data-[state=active]:text-lime-400 rounded-none h-10 border-b-2 border-transparent data-[state=active]:border-lime-400 px-4 text-xs">External Pressure</TabsTrigger>
                                    <TabsTrigger value="axial" className="data-[state=active]:bg-slate-800 data-[state=active]:text-lime-400 rounded-none h-10 border-b-2 border-transparent data-[state=active]:border-lime-400 px-4 text-xs">Axial & Thermal</TabsTrigger>
                                </TabsList>
                                
                                <div className="p-6 border border-t-0 border-slate-800 bg-slate-900/30 rounded-b-md min-h-[250px]">
                                    <TabsContent value="internal" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-slate-400">Fluid Density (ppg)</Label>
                                                <Input type="number" step="0.1" value={formData.internal_fluid_density} onChange={e => setFormData({...formData, internal_fluid_density: parseFloat(e.target.value)})} className="bg-slate-900 border-slate-700" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-slate-400">Surface Pressure (psi)</Label>
                                                <Input type="number" step="100" value={formData.surface_pressure} onChange={e => setFormData({...formData, surface_pressure: parseFloat(e.target.value)})} className="bg-slate-900 border-slate-700" />
                                            </div>
                                        </div>
                                        <div className="bg-blue-900/10 border border-blue-900/30 p-3 rounded text-xs text-blue-300">
                                            <p>Internal pressure profile will be calculated based on fluid density gradient + surface pressure.</p>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="external" className="mt-0 space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-400">Backup Profile</Label>
                                            <Select value={formData.external_profile} onValueChange={v => setFormData({...formData, external_profile: v})}>
                                                <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-700">
                                                    <SelectItem value="Pore Pressure">Pore Pressure (Standard)</SelectItem>
                                                    <SelectItem value="Mud Gradient">Mud Gradient</SelectItem>
                                                    <SelectItem value="Fresh Water">Fresh Water (0.433 psi/ft)</SelectItem>
                                                    <SelectItem value="Cement Slurry">Cement Slurry (Mixed)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="axial" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-slate-400">Axial Force Adjustment (klb)</Label>
                                                <Input type="number" value={formData.axial_force_klb} onChange={e => setFormData({...formData, axial_force_klb: parseFloat(e.target.value)})} className="bg-slate-900 border-slate-700" />
                                                <p className="text-[10px] text-slate-500 pt-1">Positive = Tension, Negative = Compression</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditorOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</Button>
                        <Button onClick={handleSave} className="bg-lime-600 hover:bg-lime-700 text-white">Save Case</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoadCasesTab;