import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleSection from './CollapsibleSection';
import { Map, Share2, TestTube2, Zap, Plus, Trash2, Save, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import LoadProjectDialog from './LoadProjectDialog';

const initialDrillPipe = { id: 1, type: '5" 19.50 ppf', length: 10000, grade: 'S-135' };
const initialBHA = { id: 1, type: 'Drill Collar', length: 500, od: 8, id: 2.8125, weight: 147 };
const defaultInputs = {
    projectName: 'Onshore Dev Well Cluster A',
    wellName: 'Well D-1H (Horizontal)',
    kop: 2500,
    bur: 10,
    targetInclination: 90,
    tangentLength: 4000,
    targetMD: 12000,
};

const InputPanel = ({ onCalculate, loading, onProjectLoad, initialInputs }) => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState(initialInputs || defaultInputs);
  const [drillPipe, setDrillPipe] = useState(initialInputs?.drillPipe || [initialDrillPipe]);
  const [bha, setBha] = useState(initialInputs?.bha || [initialBHA]);
  const [fluidParams, setFluidParams] = useState(initialInputs?.fluidParams || { mudWeight: 10.5, pv: 20, yp: 15, cof_s: 0.3, cof_d: 0.2 });
  const [scenarios, setScenarios] = useState(initialInputs?.scenarios || {
    rotaryDrilling: true,
    slideDrilling: true,
    trippingIn: true,
    trippingOut: true,
  });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState(inputs.projectName);

  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
      setDrillPipe(initialInputs.drillPipe);
      setBha(initialInputs.bha);
      setFluidParams(initialInputs.fluidParams);
      setScenarios(initialInputs.scenarios);
      setProjectName(initialInputs.projectName);
    }
  }, [initialInputs]);

  const handleInputChange = (e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFluidChange = (e) => setFluidParams(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addComponent = (setState, initialComponent) => {
    setState(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
      return [...prev, { ...initialComponent, id: newId }];
    });
  };

  const removeComponent = (setState, id) => {
    setState(prev => {
      if (prev.length <= 1) {
        toast({ title: "Cannot Remove", description: "At least one component is required.", variant: "destructive" });
        return prev;
      }
      return prev.filter(c => c.id !== id);
    });
  };
  
  const handleComponentChange = (setState, id, e) => {
    const { name, value } = e.target;
    setState(prev => prev.map(c => c.id === id ? { ...c, [name]: value } : c));
  };
  
  const handleScenarioChange = (scenario) => {
      setScenarios(prev => ({...prev, [scenario]: !prev[scenario]}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ ...inputs, drillPipe, bha, fluidParams, scenarios, projectName });
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
        inputs_data: { ...inputs, drillPipe, bha, fluidParams, scenarios, projectName },
        results_data: null
    };
    
    const { error } = await supabase.from('torque_drag_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

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
              <h2 className="text-2xl font-bold text-white">T&D Predictor</h2>
              <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
              </div>
          </div>
          <CollapsibleSection title="Well Trajectory" icon={<Map />} defaultOpen={true}>
            <div><Label className="text-red-300">Well Name</Label><Input name="wellName" value={inputs.wellName} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-red-300">KOP (ft)</Label><Input name="kop" type="number" value={inputs.kop} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                <div><Label className="text-red-300">BUR (°/100ft)</Label><Input name="bur" type="number" value={inputs.bur} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-red-300">Target Inc (°)</Label><Input name="targetInclination" type="number" value={inputs.targetInclination} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                <div><Label className="text-red-300">Target MD (ft)</Label><Input name="targetMD" type="number" value={inputs.targetMD} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Drill String & BHA" icon={<Share2 />} defaultOpen={true}>
            <h4 className="text-md font-semibold text-white mb-2">Drill Pipe</h4>
            <div className="space-y-2">
                {drillPipe.map(dp => (
                    <div key={dp.id} className="bg-black/20 p-2 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-red-300 text-xs">Type</Label>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeComponent(setDrillPipe, dp.id)}><Trash2 className="w-4 h-4"/></Button>
                        </div>
                        <Input name="type" value={dp.type} onChange={e => handleComponentChange(setDrillPipe, dp.id, e)} className="bg-white/10 border-white/20 font-semibold"/>
                        <div><Label className="text-red-300 text-xs">Length (ft)</Label><Input name="length" type="number" value={dp.length} onChange={e => handleComponentChange(setDrillPipe, dp.id, e)} className="bg-white/5 border-white/20"/></div>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" className="w-full mt-2 border-red-400/50 text-red-300 hover:bg-red-500/20" onClick={() => addComponent(setDrillPipe, initialDrillPipe)}><Plus className="w-4 h-4 mr-2"/>Add Drill Pipe</Button>
            
            <h4 className="text-md font-semibold text-white mt-4 mb-2">BHA</h4>
            <div className="space-y-2">
                {bha.map(b => (
                    <div key={b.id} className="bg-black/20 p-2 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-red-300 text-xs">Component</Label>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeComponent(setBha, b.id)}><Trash2 className="w-4 h-4"/></Button>
                        </div>
                        <Input name="type" value={b.type} onChange={e => handleComponentChange(setBha, b.id, e)} className="bg-white/10 border-white/20 font-semibold"/>
                        <div className="grid grid-cols-2 gap-2">
                            <div><Label className="text-red-300 text-xs">Length (ft)</Label><Input name="length" type="number" value={b.length} onChange={e => handleComponentChange(setBha, b.id, e)} className="bg-white/5 border-white/20"/></div>
                            <div><Label className="text-red-300 text-xs">Weight (lb/ft)</Label><Input name="weight" type="number" value={b.weight} onChange={e => handleComponentChange(setBha, b.id, e)} className="bg-white/5 border-white/20"/></div>
                        </div>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" className="w-full mt-2 border-red-400/50 text-red-300 hover:bg-red-500/20" onClick={() => addComponent(setBha, initialBHA)}><Plus className="w-4 h-4 mr-2"/>Add BHA Component</Button>
          </CollapsibleSection>

          <CollapsibleSection title="Fluid & Friction" icon={<TestTube2 />}>
            <div><Label className="text-red-300">Mud Weight (ppg)</Label><Input name="mudWeight" type="number" value={fluidParams.mudWeight} onChange={handleFluidChange} className="bg-white/5 border-white/20"/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-red-300">Static COF</Label><Input name="cof_s" type="number" step="0.01" value={fluidParams.cof_s} onChange={handleFluidChange} className="bg-white/5 border-white/20"/></div>
                <div><Label className="text-red-300">Dynamic COF</Label><Input name="cof_d" type="number" step="0.01" value={fluidParams.cof_d} onChange={handleFluidChange} className="bg-white/5 border-white/20"/></div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Operational Scenarios" icon={<Zap/>}>
            <div className="grid grid-cols-2 gap-2">
                {Object.keys(scenarios).map(key => (
                    <div key={key} className="flex items-center space-x-2 bg-black/20 p-2 rounded-md">
                        <Checkbox id={key} checked={scenarios[key]} onCheckedChange={() => handleScenarioChange(key)} />
                        <Label htmlFor={key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                    </div>
                ))}
            </div>
          </CollapsibleSection>
        </div>
        
        <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 text-lg">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
              Calculate & Simulate
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