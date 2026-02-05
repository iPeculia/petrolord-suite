import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import BlockCard from './BlockCard';
import { Settings, Target, Play, PlusCircle, Briefcase } from 'lucide-react';

const InputPanel = ({ onAnalyze, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBlockChange = (id, field, value) => {
    setInputs(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const addBlock = () => {
    const newId = Math.max(0, ...inputs.blocks.map(b => b.id)) + 1;
    setInputs(prev => ({
        ...prev,
        blocks: [...prev.blocks, {
            id: newId, name: `New Block ${newId}`, posg: 20,
            oil_p10: 50, oil_p50: 150, oil_p90: 300,
            capex_p10: 500, capex_p50: 700, capex_p90: 1000,
            opex_p10: 9, opex_p50: 11, opex_p90: 14,
            bidAmount: 30,
        }]
    }));
  };

  const removeBlock = (id) => {
    if (inputs.blocks.length <= 1) {
        toast({ variant: "destructive", title: "Cannot remove last block." });
        return;
    }
    setInputs(prev => ({
        ...prev,
        blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Bid Strategy Setup</h2>

        <CollapsibleSection title="Bid Round & Blocks" icon={<Settings />} defaultOpen>
            <div className="space-y-4">
                <div><Label className="text-lime-300">Bid Round Name</Label><Input value={inputs.bidRoundName} onChange={(e) => handleInputChange('bidRoundName', e.target.value)} className="bg-white/5 border-white/20" /></div>
                <div className="space-y-3 mt-4">
                    {inputs.blocks.map(block => (
                        <BlockCard key={block.id} block={block} onChange={handleBlockChange} onRemove={removeBlock} />
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={addBlock} className="w-full mt-4 border-lime-400 text-lime-400 hover:bg-lime-400/10 hover:text-lime-300">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Block
                </Button>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Portfolio Constraints" icon={<Briefcase />}>
            <div className="space-y-4">
                <div><Label className="text-lime-300">Total Bid Budget ($MM)</Label><Input type="number" value={inputs.totalBidBudget} onChange={(e) => handleInputChange('totalBidBudget', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Risk Tolerance</Label>
                    <select value={inputs.riskTolerance} onChange={(e) => handleInputChange('riskTolerance', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
            </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Target className="w-5 h-5 mr-2" />}
            Optimize Bid Strategy
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;