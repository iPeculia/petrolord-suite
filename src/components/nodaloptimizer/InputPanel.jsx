import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import { Settings, Database, Target, Play, GitBranch } from 'lucide-react';

const InputPanel = ({ onOptimize, loading }) => {
  const [inputs, setInputs] = useState({
    projectName: "Central Field Optimization",
    wellName: "Well-12",
    iprModel: "Vogel",
    aofp: 10000,
    reservoirPressure: 3000,
    skin: 5,
    tubingID: 3.5,
    tubingLength: 8000,
    vlpCorrelation: "Hagedorn & Brown",
    optimizationGoal: "Maximize Oil Rate",
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOptimize(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Nodal Optimizer Setup</h2>

        <CollapsibleSection title="Well & Data Configuration" icon={<Settings />} defaultOpen>
          <div className="space-y-4">
            <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Well Name</Label><Input value={inputs.wellName} onChange={(e) => handleInputChange('wellName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Tubing ID (in)</Label><Input type="number" value={inputs.tubingID} onChange={(e) => handleInputChange('tubingID', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Tubing Length (ft)</Label><Input type="number" value={inputs.tubingLength} onChange={(e) => handleInputChange('tubingLength', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
            <div>
                <Label className="text-lime-300">VLP Correlation</Label>
                <select value={inputs.vlpCorrelation} onChange={(e) => handleInputChange('vlpCorrelation', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                    <option>Hagedorn & Brown</option><option>Beggs & Brill</option><option>Gray</option>
                </select>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Inflow Performance (IPR)" icon={<Database />} defaultOpen>
          <div className="space-y-4">
            <div>
                <Label className="text-lime-300">IPR Model</Label>
                <div className="flex space-x-2 mt-1">
                    {["Vogel", "Fetkovich", "Jones"].map(type => (
                        <Button key={type} type="button" size="sm" variant={inputs.iprModel === type ? 'default' : 'outline'} onClick={() => handleInputChange('iprModel', type)} className={`flex-1 ${inputs.iprModel === type ? 'bg-lime-600' : ''}`}>{type}</Button>
                    ))}
                </div>
            </div>
            <div><Label className="text-lime-300">AOFP (STB/day)</Label><Input type="number" value={inputs.aofp} onChange={(e) => handleInputChange('aofp', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Reservoir Pressure (psi)</Label><Input type="number" value={inputs.reservoirPressure} onChange={(e) => handleInputChange('reservoirPressure', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Skin Factor</Label><Input type="number" value={inputs.skin} onChange={(e) => handleInputChange('skin', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Optimization Targets" icon={<Target />}>
            <div className="space-y-4">
                <div>
                    <Label className="text-lime-300">Optimization Goal</Label>
                    <select value={inputs.optimizationGoal} onChange={(e) => handleInputChange('optimizationGoal', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                        <option>Maximize Oil Rate</option><option>Maximize Net Revenue</option>
                    </select>
                </div>
            </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <GitBranch className="w-5 h-5 mr-2" />}
            Run Optimization
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;