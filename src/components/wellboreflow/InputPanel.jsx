import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CollapsibleSection from '@/components/flowassurance/CollapsibleSection';
import { Play, Thermometer, Waves, Save, FolderOpen, Wind } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import LoadProjectDialog from './LoadProjectDialog';

const defaultInputs = {
    projectName: 'Deepwater Well Start-up',
    simulationType: 'Start-up',
    simulationTime: 120, // minutes
    wellDepth: 12000, // ft
    tubingID: 4.5, // inches
    casingID: 7, // inches
    geothermalGradient: 1.5, // °F/100ft
    surfaceTemp: 60, // °F
    seabedTemp: 40, // °F
    waterDepth: 3000, // ft
    inflowRate: 5000, // bbl/d
    gasOilRatio: 1200, // scf/stb
    waterCut: 15, // %
    sandProduction: 10, // lb/1000bbl
};

const InputPanel = ({ onAnalyze, loading, onProjectLoad, initialInputs }) => {
    const [inputs, setInputs] = useState(initialInputs || defaultInputs);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
    const [projectName, setProjectName] = useState(inputs.projectName);
    const { toast } = useToast();

    useEffect(() => {
        if(initialInputs) {
            setInputs(initialInputs);
            setProjectName(initialInputs.projectName);
        }
    }, [initialInputs]);

    const handleInputChange = (field, value) => {
        const newInputs = { ...inputs, [field]: value };
        setInputs(newInputs);
        if (field === 'projectName') {
            setProjectName(value);
        }
    };
    
    const handleSelectChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAnalyze(inputs);
    };

    const handleSaveProject = async () => {
        if (!projectName) {
            toast({ variant: 'destructive', title: 'Error', description: 'Project name is required.' });
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save.' });
            return;
        }

        const projectData = {
            user_id: user.id,
            project_name: projectName,
            inputs_data: { ...inputs, projectName },
            results_data: null // Can be updated from ResultsPanel
        };
        
        const { error } = await supabase.from('wellbore_flow_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

        if (error) {
            toast({ variant: 'destructive', title: 'Save Error', description: error.message });
        } else {
            toast({ title: 'Project Saved', description: `"${projectName}" has been saved.` });
            setIsSaveDialogOpen(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col text-white">
                <div className="flex-grow space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Wellbore Flow Simulator</h2>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                            <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
                        </div>
                    </div>
                
                    <CollapsibleSection title="Scenario Setup" icon={<Wind />} defaultOpen>
                        <div className="space-y-4 p-2">
                            <div>
                                <Label className="text-red-300">Project Name</Label>
                                <Input value={inputs.projectName} onChange={e => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" />
                            </div>
                            <div>
                                <Label className="text-red-300">Simulation Scenario</Label>
                                <Select value={inputs.simulationType} onValueChange={value => handleSelectChange('simulationType', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Start-up">Start-up</SelectItem><SelectItem value="Shut-in">Shut-in</SelectItem><SelectItem value="Ramp-up">Ramp-up</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-red-300">Simulation Time (minutes)</Label>
                                <Input type="number" value={inputs.simulationTime} onChange={e => handleInputChange('simulationTime', Number(e.target.value))} className="bg-white/5 border-white/20" />
                            </div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Well & Thermal Model" icon={<Thermometer />} defaultOpen>
                        <div className="grid grid-cols-2 gap-4 p-2">
                            <div><Label className="text-red-300">Well Depth (ft)</Label><Input type="number" value={inputs.wellDepth} onChange={e => handleInputChange('wellDepth', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">Tubing ID (in)</Label><Input type="number" value={inputs.tubingID} onChange={e => handleInputChange('tubingID', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">Water Depth (ft)</Label><Input type="number" value={inputs.waterDepth} onChange={e => handleInputChange('waterDepth', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">Seabed Temp (°F)</Label><Input type="number" value={inputs.seabedTemp} onChange={e => handleInputChange('seabedTemp', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">Geo. Grad. (°F/100ft)</Label><Input type="number" step="0.1" value={inputs.geothermalGradient} onChange={e => handleInputChange('geothermalGradient', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                        </div>
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Fluid & Solids Model" icon={<Waves />}>
                        <div className="grid grid-cols-2 gap-4 p-2">
                            <div><Label className="text-red-300">Inflow Rate (bbl/d)</Label><Input type="number" value={inputs.inflowRate} onChange={e => handleInputChange('inflowRate', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">GOR (scf/stb)</Label><Input type="number" value={inputs.gasOilRatio} onChange={e => handleInputChange('gasOilRatio', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">Water Cut (%)</Label><Input type="number" value={inputs.waterCut} onChange={e => handleInputChange('waterCut', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-red-300">Sand (lb/1kbbl)</Label><Input type="number" value={inputs.sandProduction} onChange={e => handleInputChange('sandProduction', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                        </div>
                    </CollapsibleSection>
                </div>
                
                <div className="pt-4">
                     <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 text-lg">
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
                        Run Transient Simulation
                    </Button>
                </div>
            </form>

            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Save Project</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveProject}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <LoadProjectDialog isOpen={isLoadDialogOpen} onClose={() => setIsLoadDialogOpen(false)} onProjectLoad={onProjectLoad} />
        </>
    );
};

export default InputPanel;