import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GitCommit, MapPin, Wrench, DollarSign, BrainCircuit, Zap, Percent } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAiSuggestions } from '@/utils/wellCostIQCalculations';

const Section = ({ title, icon, children }) => (
  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl p-6">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center">{React.cloneElement(icon, { className: "w-5 h-5 mr-3 text-cyan-300" })}{title}</h3>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const InputPanel = ({ onCalculate, loading }) => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    projectName: 'Well X-1',
    region: 'Gulf of Mexico',
    wellType: 'Deepwater',
    waterDepth: 3000,
    measuredDepth: 25000,
    rigRate: 450000,
    serviceSpread: 200000,
    drillingDays: 75,
    rigMoveCost: 5000000,
    completionCost: 20000000,
    contingency: 15,
  });
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'region' || name === 'wellType' || name === 'projectName' ? value : parseFloat(value) }));
  };

  const handleSliderChange = (value) => {
    setInputs(prev => ({ ...prev, contingency: value[0] }));
  };
  
  const handleGetSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const suggestions = await getAiSuggestions(inputs.region, inputs.wellType, inputs.measuredDepth);
      setInputs(prev => ({
        ...prev,
        rigRate: suggestions.suggestedRigRate,
        serviceSpread: suggestions.suggestedServiceSpread,
        drillingDays: suggestions.suggestedDrillingDays
      }));
      toast({
        title: "Suggestions Applied! 🤖",
        description: "Cost drivers have been updated with market estimates.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch suggestions.",
        variant: "destructive",
      });
    } finally {
      setSuggestionsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Project & Well Type" icon={<GitCommit />}>
        <div><Label htmlFor="projectName" className="text-lime-300">Project/Well Name</Label><Input id="projectName" name="projectName" value={inputs.projectName} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <div>
          <Label htmlFor="region-country-dropdown" className="text-lime-300">Region/Country</Label>
          <select id="region-country-dropdown" name="region" value={inputs.region} onChange={handleChange} className="w-full h-10 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white">
            <option>Gulf of Mexico</option><option>North Sea</option><option>West Africa</option><option>Brazil</option><option>Permian Basin</option>
          </select>
        </div>
        <div>
          <Label htmlFor="well-type-dropdown" className="text-lime-300">Well Type</Label>
          <select id="well-type-dropdown" name="wellType" value={inputs.wellType} onChange={handleChange} className="w-full h-10 px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white">
            <option>Deepwater</option><option>Onshore</option><option>Offshore Shelf</option><option>Exploration</option><option>Development - Vertical</option><option>Development - Horizontal</option>
          </select>
        </div>
      </Section>

      <Section title="Key Cost Drivers" icon={<Wrench />}>
        {inputs.wellType.includes("Offshore") || inputs.wellType.includes("Deepwater") ? <div><Label htmlFor="water-depth-input" className="text-lime-300">Water Depth (ft)</Label><Input id="water-depth-input" name="waterDepth" type="number" value={inputs.waterDepth} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div> : null}
        <div><Label htmlFor="measured-depth-input" className="text-lime-300">Measured Depth (ft)</Label><Input id="measured-depth-input" name="measuredDepth" type="number" value={inputs.measuredDepth} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <div><Label htmlFor="rig-rate-input" className="text-lime-300">Rig Rate ($/day)</Label><Input id="rig-rate-input" name="rigRate" type="number" value={inputs.rigRate} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <div><Label htmlFor="service-spread-input" className="text-lime-300">Service Spread ($/day)</Label><Input id="service-spread-input" name="serviceSpread" type="number" value={inputs.serviceSpread} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <div><Label htmlFor="drilling-days-input" className="text-lime-300">Drilling Days</Label><Input id="drilling-days-input" name="drillingDays" type="number" value={inputs.drillingDays} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <Button onClick={handleGetSuggestions} disabled={suggestionsLoading} variant="outline" className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20">
          {suggestionsLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <BrainCircuit className="w-4 h-4 mr-2" />}
          {suggestionsLoading ? "Fetching..." : "Get AI Suggestions"}
        </Button>
      </Section>

      <Section title="Other Costs & Contingency" icon={<DollarSign />}>
        <div><Label htmlFor="rig-move-cost-input" className="text-lime-300">Rig Move Cost ($)</Label><Input id="rig-move-cost-input" name="rigMoveCost" type="number" value={inputs.rigMoveCost} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <div><Label htmlFor="completion-cost-input" className="text-lime-300">Completion Cost ($)</Label><Input id="completion-cost-input" name="completionCost" type="number" value={inputs.completionCost} onChange={handleChange} className="bg-white/5 border-white/20 text-white" /></div>
        <div><Label htmlFor="contingency-slider" className="text-lime-300 flex justify-between"><span>Contingency</span><span className="text-white font-bold">{inputs.contingency}%</span></Label><Slider id="contingency-slider" name="contingency" value={[inputs.contingency]} onValueChange={handleSliderChange} max={40} step={1} /></div>
      </Section>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Button id="calculate-cost-button" onClick={() => onCalculate(inputs)} disabled={loading} className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
          Calculate Cost
        </Button>
      </motion.div>
    </div>
  );
};

export default InputPanel;