import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleSection from './CollapsibleSection';
import VariableCard from './VariableCard';
import { FileText, SlidersHorizontal, Settings, Plus, Zap, Percent, DollarSign } from 'lucide-react';

const initialVariables = [
  { id: 1, name: 'Oil Reserves (MMSTB)', dist: 'Triangular', p10: 80, p50: 100, p90: 120 },
  { id: 2, name: 'Initial Oil Price ($/STB)', dist: 'Triangular', p10: 60, p50: 70, p90: 85 },
  { id: 3, name: 'CAPEX ($MM)', dist: 'Triangular', p10: 450, p50: 500, p90: 600 },
  { id: 4, name: 'OPEX ($/boe)', dist: 'Triangular', p10: 18, p50: 20, p90: 25 },
  { id: 5, name: 'Decline Rate (%/yr)', dist: 'Triangular', p10: 8, p50: 10, p90: 12 },
];

const InputPanel = ({ onRunSimulation, loading }) => {
  const [projectName, setProjectName] = useState('Offshore Discovery Prospect');
  const [variables, setVariables] = useState(initialVariables);
  const [iterations, setIterations] = useState(5000);
  const [discountRate, setDiscountRate] = useState(10);
  const [taxRate, setTaxRate] = useState(30);
  const [royaltyRate, setRoyaltyRate] = useState(12.5);
  const [projectLife, setProjectLife] = useState(20);

  const handleVariableChange = (id, field, value) => {
    setVariables(vars => vars.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleAddVariable = () => {
    const newId = Math.max(0, ...variables.map(v => v.id)) + 1;
    const newVariable = { id: newId, name: 'New Variable', dist: 'Triangular', p10: 0, p50: 0, p90: 0 };
    setVariables([...variables, newVariable]);
  };

  const handleDeleteVariable = (id) => {
    setVariables(vars => vars.filter(v => v.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunSimulation({
      projectName,
      variables,
      economicSettings: { discountRate, taxRate, royaltyRate, projectLife },
      simulationSettings: { iterations },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CollapsibleSection title="Project Definition" icon={<FileText />} defaultOpen={true}>
        <div>
          <Label className="text-lime-300">Project Name</Label>
          <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-white/5 border-white/20"/>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Probabilistic Variables" icon={<SlidersHorizontal />} defaultOpen={true}>
        <div className="space-y-3">
          {variables.map(v => (
            <VariableCard 
              key={v.id} 
              variable={v} 
              onChange={handleVariableChange} 
              onDelete={handleDeleteVariable}
            />
          ))}
        </div>
        <Button type="button" variant="outline" onClick={handleAddVariable} className="w-full mt-2 border-dashed border-lime-400/50 text-lime-300 hover:bg-lime-500/10">
          <Plus className="w-4 h-4 mr-2"/> Add Variable
        </Button>
      </CollapsibleSection>

      <CollapsibleSection title="Economic & Simulation Settings" icon={<Settings />} defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-lime-300">Discount Rate</Label>
            <Input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="bg-white/5 border-white/20" icon={<Percent className="h-4 w-4 text-slate-400" />}/>
          </div>
          <div>
            <Label className="text-lime-300">Tax Rate</Label>
            <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="bg-white/5 border-white/20" icon={<Percent className="h-4 w-4 text-slate-400" />}/>
          </div>
          <div>
            <Label className="text-lime-300">Royalty Rate</Label>
            <Input type="number" value={royaltyRate} onChange={(e) => setRoyaltyRate(Number(e.target.value))} className="bg-white/5 border-white/20" icon={<Percent className="h-4 w-4 text-slate-400" />}/>
          </div>
           <div>
            <Label className="text-lime-300">Project Life (yrs)</Label>
            <Input type="number" value={projectLife} onChange={(e) => setProjectLife(Number(e.target.value))} className="bg-white/5 border-white/20"/>
          </div>
          <div className="col-span-2">
            <Label className="text-lime-300">Iterations</Label>
            <Input type="number" value={iterations} onChange={(e) => setIterations(Number(e.target.value))} className="bg-white/5 border-white/20"/>
          </div>
        </div>
      </CollapsibleSection>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
          Run Simulation
        </Button>
      </motion.div>
    </form>
  );
};

export default InputPanel;