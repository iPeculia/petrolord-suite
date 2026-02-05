import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, FolderOpen, Wind, SlidersHorizontal, Package, TestTube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import LoadProjectDialog from './LoadProjectDialog';
import CollapsibleSection from './CollapsibleSection';

const defaultInputs = {
    projectName: 'Wolfcamp Shale Well 4H',
    wellName: 'Well 4H',
    lateralLength: 9500,
    stages: 50,
    clustersPerStage: 4,
    pumpRate: 85,
    fluidSystem: 'Slickwater',
    proppantType: '40/70 Northern White',
    proppantConcentration: 1.5,
    totalFluidVolume: 25000,
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

  const handleInputChange = (e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
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
    
    const { error } = await supabase.from('frac_completion_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

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
              <h2 className="text-2xl font-bold text-white">Frac Designer</h2>
              <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
              </div>
          </div>

          <CollapsibleSection title="Well & Completion Design" icon={<SlidersHorizontal />} defaultOpen={true}>
            <div><Label className="text-rose-300">Well Name</Label><Input name="wellName" value={inputs.wellName} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-rose-300">Lateral Length (ft)</Label><Input name="lateralLength" type="number" value={inputs.lateralLength} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                <div><Label className="text-rose-300">Stages</Label><Input name="stages" type="number" value={inputs.stages} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            </div>
            <div><Label className="text-rose-300">Clusters / Stage</Label><Input name="clustersPerStage" type="number" value={inputs.clustersPerStage} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
          </CollapsibleSection>
          
          <CollapsibleSection title="Pumping Schedule" icon={<Package />} defaultOpen={true}>
            <div><Label className="text-rose-300">Pump Rate (bpm)</Label><Input name="pumpRate" type="number" value={inputs.pumpRate} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-rose-300">Total Fluid Volume (bbl)</Label><Input name="totalFluidVolume" type="number" value={inputs.totalFluidVolume} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
          </CollapsibleSection>
          
          <CollapsibleSection title="Fluid & Proppant" icon={<TestTube />}>
            <div><Label className="text-rose-300">Fluid System</Label><Input name="fluidSystem" value={inputs.fluidSystem} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-rose-300">Proppant Type</Label><Input name="proppantType" value={inputs.proppantType} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-rose-300">Avg. Prop. Conc. (ppa)</Label><Input name="proppantConcentration" type="number" step="0.1" value={inputs.proppantConcentration} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
          </CollapsibleSection>
        </div>
        
        <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold py-3 text-lg">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Wind className="w-5 h-5 mr-2" />}
              Simulate Frac Job
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