import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, FolderOpen, Zap, Settings, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';
import LoadProjectDialog from './LoadProjectDialog';
import CollapsibleSection from './CollapsibleSection';
import { Checkbox } from '@/components/ui/checkbox';


const defaultInputs = {
    projectName: 'Deepwater Driller X-9',
    wellName: 'Well DW-34H',
    wob_min_klbf: 20,
    wob_max_klbf: 60,
    rpm_min: 80,
    rpm_max: 150,
    td_warn_klbf: 220,
    td_crit_klbf: 240,
    enabled: true,
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
    
    const { error } = await supabase.from('rto_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

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
                    <h2 className="text-2xl font-bold text-white">RTO Console</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsLoadDialogOpen(true)}><FolderOpen className="h-4 w-4"/></Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => setIsSaveDialogOpen(true)}><Save className="h-4 w-4"/></Button>
                    </div>
                </div>

                <CollapsibleSection title="Operational Parameters" icon={<Settings />} defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-lime-300">WOB Min (klbf)</Label><Input name="wob_min_klbf" type="number" value={inputs.wob_min_klbf} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-lime-300">WOB Max (klbf)</Label><Input name="wob_max_klbf" type="number" value={inputs.wob_max_klbf} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-lime-300">RPM Min</Label><Input name="rpm_min" type="number" value={inputs.rpm_min} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-lime-300">RPM Max</Label><Input name="rpm_max" type="number" value={inputs.rpm_max} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Safety Thresholds" icon={<Shield />} defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-lime-300">T&D Warn (klbf)</Label><Input name="td_warn_klbf" type="number" value={inputs.td_warn_klbf} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-lime-300">T&D Critical (klbf)</Label><Input name="td_crit_klbf" type="number" value={inputs.td_crit_klbf} onChange={handleInputChange} className="bg-white/5 border-white/20"/></div>
                    </div>
                </CollapsibleSection>
                 <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="enabled" checked={inputs.enabled} onCheckedChange={checked => setInputs({...inputs, enabled: checked})} />
                    <Label htmlFor="enabled" className="text-white">Enable Digital Driller AI</Label>
                </div>
            </div>
            <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-semibold py-3 text-lg">
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
                    Connect to Live Stream
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