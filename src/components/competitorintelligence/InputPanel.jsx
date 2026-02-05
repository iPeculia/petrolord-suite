import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import { Users, Database, Search, BarChart, Play } from 'lucide-react';

const InputPanel = ({ onAnalyze, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCompetitorChange = (index, field, value) => {
    const newCompetitors = [...inputs.competitors];
    newCompetitors[index][field] = value;
    setInputs(prev => ({ ...prev, competitors: newCompetitors }));
  };

  const addCompetitor = () => {
    setInputs(prev => ({
      ...prev,
      competitors: [...prev.competitors, { name: '', type: 'Independent', regions: '' }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Intelligence Setup</h2>

        <CollapsibleSection title="Competitor Watchlist" icon={<Users />} defaultOpen>
          <div className="space-y-4">
            {inputs.competitors.map((comp, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg space-y-2">
                <Input placeholder="Company Name" value={comp.name} onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)} className="bg-white/10 border-white/20" />
                <Input placeholder="Operating Regions" value={comp.regions} onChange={(e) => handleCompetitorChange(index, 'regions', e.target.value)} className="bg-white/10 border-white/20" />
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" className="w-full border-lime-400 text-lime-400 hover:bg-lime-400/10" onClick={addCompetitor}>Add Competitor</Button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Data Sources" icon={<Database />}>
          <p className="text-sm text-slate-400">Backend data sources are pre-configured. Customize keyword monitoring below.</p>
        </CollapsibleSection>

        <CollapsibleSection title="Keywords for Monitoring" icon={<Search />}>
          <div className="space-y-4">
            <div>
              <Label className="text-lime-300">Strategic Keywords</Label>
              <Textarea value={inputs.strategicKeywords} onChange={(e) => handleInputChange('strategicKeywords', e.target.value)} className="bg-white/5 border-white/20" rows={3} />
            </div>
            <div>
              <Label className="text-lime-300">Operational Keywords</Label>
              <Textarea value={inputs.operationalKeywords} onChange={(e) => handleInputChange('operationalKeywords', e.target.value)} className="bg-white/5 border-white/20" rows={3} />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
            Generate Insights
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;