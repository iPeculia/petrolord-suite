import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Beaker, Droplet, Layers, Package, Plus, Save, FolderOpen, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import LoadProjectDialog from './LoadProjectDialog';
import CollapsibleSection from './CollapsibleSection';

const initialSlurry = { id: 1, type: 'Lead Slurry', density: 14.5, volume: 800, yieldPoint: 20, plasticViscosity: 40 };
const initialSpacer = { id: 1, type: 'Weighted Spacer', density: 12, volume: 150 };

const defaultInputs = {
    projectName: 'Offshore Exploration Well Z-1',
    wellName: 'Well Z-1',
    casingOD: 9.625,
    holeDiameter: 12.25,
    toc: 5000,
    shoeDepth: 10000,
    pumpRate: 5,
};

const InputPanel = ({ onCalculate, loading, onProjectLoad, initialInputs }) => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState(initialInputs || defaultInputs);
  const [slurries, setSlurries] = useState(initialInputs?.slurries || [initialSlurry]);
  const [spacers, setSpacers] = useState(initialInputs?.spacers || [initialSpacer]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState(inputs.projectName);

  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
      setSlurries(initialInputs.slurries || [initialSlurry]);
      setSpacers(initialInputs.spacers || [initialSpacer]);
      setProjectName(initialInputs.projectName);
    }
  }, [initialInputs]);

  const handleInputChange = (e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addComponent = (setState, initialComponent) => {
    setState(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
      return [...prev, { ...initialComponent, id: newId }];
    });
  };

  const removeComponent = (setState, id) => {
    setState(prev => {
      if (prev.length <= 1) {
        toast({ title: "Cannot Remove", description: "At least one fluid is required.", variant: "destructive" });
        return prev;
      }
      return prev.filter(c => c.id !== id);
    });
  };
  
  const handleComponentChange = (setState, id, e) => {
    const { name, value } = e.target;
    setState(prev => prev.map(c => c.id === id ? { ...c, [name]: value } : c));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ ...inputs, slurries, spacers, projectName });
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
        inputs_data: { ...inputs, slurries, spacers, projectName },
        results_data: null
    };
    
    const { error } = await supabase.from('cementing_simulation_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

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
              <h2 className="text-2xl font-bold text-white">Cementing Simulator</h2>
              <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
              </div>
          </div>

          <CollapsibleSection title="Wellbore Geometry" icon={<Layers />} defaultOpen={true}>
            <div><Label className="text-yellow-300">Well Name</Label><Input name="wellName" value={inputs.wellName} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-yellow-300">Casing OD (in)</Label><Input name="casingOD" type="number" step="0.001" value={inputs.casingOD} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                <div><Label className="text-yellow-300">Hole Diameter (in)</Label><Input name="holeDiameter" type="number" step="0.001" value={inputs.holeDiameter} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-yellow-300">TOC (ft)</Label><Input name="toc" type="number" value={inputs.toc} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                <div><Label className="text-yellow-300">Shoe Depth (ft)</Label><Input name="shoeDepth" type="number" value={inputs.shoeDepth} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Fluid Train" icon={<Beaker />} defaultOpen={true}>
            <h4 className="text-md font-semibold text-white mb-2">Spacers / Washes</h4>
            {spacers.map(spacer => (
                <div key={spacer.id} className="bg-black/20 p-2 rounded-lg space-y-2 mb-2">
                    <div className="flex justify-between items-center">
                        <Input name="type" value={spacer.type} onChange={e => handleComponentChange(setSpacers, spacer.id, e)} className="bg-white/10 border-white/20 font-semibold"/>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeComponent(setSpacers, spacer.id)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-yellow-300 text-xs">Density (ppg)</Label><Input name="density" type="number" step="0.1" value={spacer.density} onChange={e => handleComponentChange(setSpacers, spacer.id, e)} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-yellow-300 text-xs">Volume (bbl)</Label><Input name="volume" type="number" value={spacer.volume} onChange={e => handleComponentChange(setSpacers, spacer.id, e)} className="bg-white/5 border-white/20"/></div>
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" className="w-full mt-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20" onClick={() => addComponent(setSpacers, initialSpacer)}><Plus className="w-4 h-4 mr-2"/>Add Spacer</Button>

            <h4 className="text-md font-semibold text-white mt-4 mb-2">Cement Slurries</h4>
            {slurries.map(slurry => (
                <div key={slurry.id} className="bg-black/20 p-2 rounded-lg space-y-2 mb-2">
                    <div className="flex justify-between items-center">
                       <Input name="type" value={slurry.type} onChange={e => handleComponentChange(setSlurries, slurry.id, e)} className="bg-white/10 border-white/20 font-semibold"/>
                       <Button type="button" variant="destructive" size="icon" onClick={() => removeComponent(setSlurries, slurry.id)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-yellow-300 text-xs">Density (ppg)</Label><Input name="density" type="number" step="0.1" value={slurry.density} onChange={e => handleComponentChange(setSlurries, slurry.id, e)} className="bg-white/5 border-white/20"/></div>
                      <div><Label className="text-yellow-300 text-xs">Volume (bbl)</Label><Input name="volume" type="number" value={slurry.volume} onChange={e => handleComponentChange(setSlurries, slurry.id, e)} className="bg-white/5 border-white/20"/></div>
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" className="w-full mt-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20" onClick={() => addComponent(setSlurries, initialSlurry)}><Plus className="w-4 h-4 mr-2"/>Add Slurry</Button>
          </CollapsibleSection>

          <CollapsibleSection title="Pumping Schedule" icon={<Package />}>
            <div><Label className="text-yellow-300">Pump Rate (bpm)</Label><Input name="pumpRate" type="number" step="0.1" value={inputs.pumpRate} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
          </CollapsibleSection>
        </div>
        
        <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 text-lg">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Droplet className="w-5 h-5 mr-2" />}
              Simulate Job
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