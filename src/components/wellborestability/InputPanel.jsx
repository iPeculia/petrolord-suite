import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, FolderOpen, Zap, Layers, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import LoadProjectDialog from './LoadProjectDialog';
import CollapsibleSection from './CollapsibleSection';

const defaultInputs = {
    projectName: 'Onshore Exploration Well 002',
    wellName: 'Well A-2 (Planned)',
    tvd: 12000,
    inclination: 30,
    porePressureGradient: 0.45,
    fractureGradient: 0.85,
    ucs: 8000,
    shmin: 0.7,
    shmax: 0.9,
    overburden: 1.0,
    poisson: 0.25,
};

const InputPanel = ({ onCalculate, loading, onProjectLoad, initialInputs }) => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState(initialInputs || defaultInputs);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState(inputs.projectName);

  useEffect(() => {
    if (initialInputs) {
        setInputs(initialInputs);
        setProjectName(initialInputs.projectName);
    }
  }, [initialInputs]);

  const handleInputChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ ...inputs, projectName });
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
        results_data: null
    };
    
    const { error } = await supabase.from('geomechanics_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

    if (error) {
        toast({ variant: 'destructive', title: 'Save Error', description: error.message });
    } else {
        toast({ title: 'Project Saved', description: `"${projectName}" has been saved.` });
        setIsSaveDialogOpen(false);
    }
  };

  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col text-white">
            <div className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Stability Analyzer</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
                    </div>
                </div>

                <CollapsibleSection title="Wellbore Information" icon={<MapPin />} defaultOpen={true}>
                    <div><Label className="text-purple-300">Well Name</Label><Input name="wellName" value={inputs.wellName} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-purple-300">TVD (ft)</Label><Input name="tvd" type="number" value={inputs.tvd} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-purple-300">Inclination (°)</Label><Input name="inclination" type="number" value={inputs.inclination} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Geomechanical Inputs" icon={<Layers />} defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-purple-300">Pore Pressure (psi/ft)</Label><Input name="porePressureGradient" type="number" step="0.01" value={inputs.porePressureGradient} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-purple-300">Fracture Grad (psi/ft)</Label><Input name="fractureGradient" type="number" step="0.01" value={inputs.fractureGradient} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-purple-300">Min Stress (Shmin) (psi/ft)</Label><Input name="shmin" type="number" step="0.01" value={inputs.shmin} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-purple-300">Max Stress (SHmax) (psi/ft)</Label><Input name="shmax" type="number" step="0.01" value={inputs.shmax} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-purple-300">UCS (psi)</Label><Input name="ucs" type="number" value={inputs.ucs} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-purple-300">Poisson's Ratio</Label><Input name="poisson" type="number" step="0.01" value={inputs.poisson} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                </CollapsibleSection>
            </div>
            <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg">
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
                    Calculate Safe Window
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