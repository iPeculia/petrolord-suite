import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleSection from './CollapsibleSection';
import RegimeCard from './RegimeCard';
import { FileText, DollarSign, Plus, Copy, Trash2, GitCompare } from 'lucide-react';

const InputPanel = ({ onRunComparison, loading }) => {
  const [projectInputs, setProjectInputs] = useState({
    name: 'Deepwater Block XYZ Development',
    initialOil: 10000,
    declineRate: 10,
    capex: 500,
    opex: 20,
    oilPrice: 70,
    discountRate: 10,
  });

  const [regimes, setRegimes] = useState([
    { id: 1, name: 'Nigerian PIA (PSC)', royalty: 15, tax: 30, costRecoveryLimit: 70, profitSplit: 60 },
    { id: 2, name: 'Concessionary (Royalty/Tax)', royalty: 12.5, tax: 50, costRecoveryLimit: 100, profitSplit: 100 },
  ]);
  const [activeRegimeId, setActiveRegimeId] = useState(1);

  const handleAddRegime = () => {
    const newId = Math.max(0, ...regimes.map(s => s.id)) + 1;
    const newRegime = { id: newId, name: `New Regime ${newId}`, royalty: 10, tax: 35, costRecoveryLimit: 80, profitSplit: 50 };
    setRegimes([...regimes, newRegime]);
    setActiveRegimeId(newId);
  };

  const handleDuplicateRegime = () => {
    const regimeToDuplicate = regimes.find(s => s.id === activeRegimeId);
    if (!regimeToDuplicate) return;
    const newId = Math.max(0, ...regimes.map(s => s.id)) + 1;
    const duplicatedRegime = { ...regimeToDuplicate, id: newId, name: `${regimeToDuplicate.name} (Copy)` };
    setRegimes([...regimes, duplicatedRegime]);
    setActiveRegimeId(newId);
  };

  const handleDeleteRegime = () => {
    if (regimes.length <= 1) return;
    const newRegimes = regimes.filter(s => s.id !== activeRegimeId);
    setRegimes(newRegimes);
    setActiveRegimeId(newRegimes[0].id);
  };

  const handleRegimeChange = (id, field, value) => {
    setRegimes(regimes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  
  const handleProjectInputChange = (field, value) => {
    setProjectInputs(p => ({...p, [field]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunComparison({ projectInputs, regimes });
  };

  const activeRegime = regimes.find(s => s.id === activeRegimeId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CollapsibleSection title="Project Basis" icon={<FileText />} defaultOpen={true}>
        <div><Label className="text-lime-300">Project Name</Label><Input value={projectInputs.name} onChange={(e) => handleProjectInputChange('name', e.target.value)} className="bg-white/5 border-white/20"/></div>
        <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-lime-300">Initial Oil (STB/d)</Label><Input type="number" value={projectInputs.initialOil} onChange={(e) => handleProjectInputChange('initialOil', Number(e.target.value))} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Decline Rate (%/yr)</Label><Input type="number" value={projectInputs.declineRate} onChange={(e) => handleProjectInputChange('declineRate', Number(e.target.value))} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Total CAPEX ($MM)</Label><Input type="number" value={projectInputs.capex} onChange={(e) => handleProjectInputChange('capex', Number(e.target.value))} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Variable OPEX ($/boe)</Label><Input type="number" value={projectInputs.opex} onChange={(e) => handleProjectInputChange('opex', Number(e.target.value))} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Oil Price ($/STB)</Label><Input type="number" value={projectInputs.oilPrice} onChange={(e) => handleProjectInputChange('oilPrice', Number(e.target.value))} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Discount Rate (%)</Label><Input type="number" value={projectInputs.discountRate} onChange={(e) => handleProjectInputChange('discountRate', Number(e.target.value))} className="bg-white/5 border-white/20"/></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Fiscal Regime Definition" icon={<DollarSign />} defaultOpen={true}>
        <div className="flex items-center gap-2 mb-4">
            <select value={activeRegimeId} onChange={(e) => setActiveRegimeId(Number(e.target.value))} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                {regimes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Button type="button" size="icon" onClick={handleAddRegime} className="bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4"/></Button>
            <Button type="button" size="icon" onClick={handleDuplicateRegime} className="bg-blue-600 hover:bg-blue-700"><Copy className="w-4 h-4"/></Button>
            <Button type="button" size="icon" onClick={handleDeleteRegime} disabled={regimes.length <= 1} className="bg-red-600 hover:bg-red-700"><Trash2 className="w-4 h-4"/></Button>
        </div>
        {activeRegime && <RegimeCard regime={activeRegime} onChange={handleRegimeChange} />}
      </CollapsibleSection>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <GitCompare className="w-5 h-5 mr-2" />}
          Run Comparison
        </Button>
      </motion.div>
    </form>
  );
};

export default InputPanel;