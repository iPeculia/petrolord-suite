import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import CollapsibleSection from './CollapsibleSection';
    import { Settings, Beaker, Shield, Play, FolderOpen, Save } from 'lucide-react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
    import LoadProjectDialog from './LoadProjectDialog';


    const defaultInputs = {
        projectName: "Gas Condensate Pipeline Integrity",
        pipelineLength: 10000,
        inletPressure: 2000,
        inletTemperature: 150,
        outletPressure: 1000,
        ambientTemperature: 40,
        apiGravity: 45,
        gor: 2500,
        waterCut: 10,
        co2: 2.5,
        h2s: 0.1,
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
              results_data: null // Results will be saved from ResultsPanel
          };
          
          const { error } = await supabase.from('flow_assurance_projects').upsert(projectData, { onConflict: 'project_name, user_id' });

          if (error) {
              toast({ variant: 'destructive', title: 'Save Error', description: error.message });
          } else {
              toast({ title: 'Project Saved', description: `"${projectName}" has been saved.` });
              setIsSaveDialogOpen(false);
          }
      };

      return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Flow Assurance Setup</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
                    </div>
                </div>

                <CollapsibleSection title="Project & System Configuration" icon={<Settings />} defaultOpen>
                  <div className="space-y-4">
                    <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20 text-white" /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-lime-300">Length (ft)</Label><Input type="number" value={inputs.pipelineLength} onChange={(e) => handleInputChange('pipelineLength', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                        <div><Label className="text-lime-300">Inlet P (psi)</Label><Input type="number" value={inputs.inletPressure} onChange={(e) => handleInputChange('inletPressure', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                        <div><Label className="text-lime-300">Inlet T (°F)</Label><Input type="number" value={inputs.inletTemperature} onChange={(e) => handleInputChange('inletTemperature', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                        <div><Label className="text-lime-300">Ambient T (°F)</Label><Input type="number" value={inputs.ambientTemperature} onChange={(e) => handleInputChange('ambientTemperature', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Fluid Characterization" icon={<Beaker />} defaultOpen>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-lime-300">API Gravity</Label><Input type="number" value={inputs.apiGravity} onChange={(e) => handleInputChange('apiGravity', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                    <div><Label className="text-lime-300">GOR (scf/STB)</Label><Input type="number" value={inputs.gor} onChange={(e) => handleInputChange('gor', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                    <div><Label className="text-lime-300">Water Cut (%)</Label><Input type="number" value={inputs.waterCut} onChange={(e) => handleInputChange('waterCut', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                    <div><Label className="text-lime-300">CO₂ (mol%)</Label><Input type="number" value={inputs.co2} onChange={(e) => handleInputChange('co2', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                    <div><Label className="text-lime-300">H₂S (ppm)</Label><Input type="number" value={inputs.h2s} onChange={(e) => handleInputChange('h2s', Number(e.target.value))} className="bg-white/5 border-white/20 text-white" /></div>
                  </div>
                </CollapsibleSection>

                 <CollapsibleSection title="Risk Model Settings" icon={<Shield />}>
                    <div className="space-y-4">
                         <div>
                            <Label className="text-lime-300">Hydrate Risk Model</Label>
                            <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"><option>CSM-Hyd</option><option>Katz</option></select>
                        </div>
                        <div>
                            <Label className="text-lime-300">Corrosion Risk Model</Label>
                            <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"><option>Norsok M-506</option><option>De Waard-Milliams</option></select>
                        </div>
                    </div>
                </CollapsibleSection>
              </div>

              <div className="pt-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-semibold py-3 text-lg">
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
                    Predict & Monitor
                  </Button>
                </motion.div>
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