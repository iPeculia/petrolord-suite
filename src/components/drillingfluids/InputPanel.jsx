import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleSection from './CollapsibleSection';
import { MapPin, FlaskConical, Plus, Trash2, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const initialAdditive = { id: 1, name: 'Bentonite', concentration: 25, cost: 50 };

const InputPanel = ({ onCalculate, loading, initialInputs }) => {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('Deepwater Well 001');
  const [maxTemp, setMaxTemp] = useState(250);
  const [totalVolume, setTotalVolume] = useState(1000);
  const [baseFluid, setBaseFluid] = useState('Fresh Water');
  const [additives, setAdditives] = useState([initialAdditive, { id: 2, name: 'Barite', concentration: 100, cost: 80 }]);

  useEffect(() => {
    if (initialInputs) {
      setProjectName(initialInputs.projectName || 'Deepwater Well 001');
      setMaxTemp(initialInputs.maxTemp || 250);
      setTotalVolume(initialInputs.totalVolume || 1000);
      setBaseFluid(initialInputs.baseFluid || 'Fresh Water');
      setAdditives(initialInputs.additives || [initialAdditive]);
    }
  }, [initialInputs]);

  const addAdditive = () => {
    setAdditives(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(a => a.id)) + 1 : 1;
      return [...prev, { id: newId, name: 'Bentonite', concentration: 10, cost: 50 }];
    });
    toast({ title: "Additive Added", description: "A new additive has been added to the formulation." });
  };

  const removeAdditive = (id) => {
    setAdditives(prev => {
      if (prev.length <= 1) {
        toast({ title: "Cannot Remove", description: "At least one additive is required.", variant: "destructive" });
        return prev;
      }
      return prev.filter(a => a.id !== id);
    });
    toast({ title: "Additive Removed", description: "The selected additive has been removed." });
  };

  const handleAdditiveChange = (id, e) => {
    const { name, value } = e.target;
    setAdditives(prev => prev.map(a => a.id === id ? { ...a, [name]: value } : a));
  };
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onCalculate({ projectName, maxTemp, totalVolume, baseFluid, additives });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CollapsibleSection title="Well Parameters" icon={<MapPin />} defaultOpen={true}>
        <div><Label htmlFor="project-name" className="text-lime-300">Project Name</Label><Input id="project-name" name="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-white/5 border-white/20"/></div>
        <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="max-temp" className="text-lime-300">Max Temp (°F)</Label><Input id="max-temp" name="maxTemp" type="number" value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} className="bg-white/5 border-white/20"/></div>
            <div><Label htmlFor="total-volume" className="text-lime-300">Total Volume (bbl)</Label><Input id="total-volume" name="totalVolume" type="number" value={totalVolume} onChange={(e) => setTotalVolume(e.target.value)} className="bg-white/5 border-white/20"/></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Fluid Formulation" icon={<FlaskConical />} defaultOpen={true}>
        <div>
            <Label htmlFor="base-fluid" className="text-lime-300">Base Fluid</Label>
            <select id="base-fluid" name="baseFluid" value={baseFluid} onChange={(e) => setBaseFluid(e.target.value)} className="w-full h-10 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white">
                <option value="Fresh Water">Fresh Water</option>
                <option value="Brine">Brine</option>
                <option value="Synthetic Oil">Synthetic Oil</option>
            </select>
        </div>
        <h4 className="text-md font-semibold text-white mt-4 mb-2">Additives</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {additives.map(additive => (
                <div key={additive.id} className="bg-black/20 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <select name="name" value={additive.name} onChange={e => handleAdditiveChange(additive.id, e)} className="w-2/3 h-10 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white font-semibold">
                            <option>Bentonite</option><option>Barite</option><option>Xanthan Gum</option><option>PAC</option><option>Lignosulfonate</option>
                        </select>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeAdditive(additive.id)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-lime-300 text-xs">Conc (lb/bbl)</Label><Input name="concentration" type="number" value={additive.concentration} onChange={e => handleAdditiveChange(additive.id, e)} className="bg-white/5 border-white/20"/></div>
                        <div><Label className="text-lime-300 text-xs">Cost ($/unit)</Label><Input name="cost" type="number" value={additive.cost} onChange={e => handleAdditiveChange(additive.id, e)} className="bg-white/5 border-white/20"/></div>
                    </div>
                </div>
            ))}
        </div>
        <Button type="button" variant="outline" className="w-full mt-2 border-lime-400/50 text-lime-300 hover:bg-lime-500/20" onClick={addAdditive}><Plus className="w-4 h-4 mr-2"/>Add Additive</Button>
      </CollapsibleSection>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
          Calculate Properties & Cost
        </Button>
      </motion.div>
    </form>
  );
};

export default InputPanel;