import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import { Settings, Database, Bot, FilePlus2, BarChart3, Droplets, Hammer as Drill, Factory, Banknote, Shield, ListChecks } from 'lucide-react';

const InputPanel = ({ onGenerate, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleImport = (dataType) => {
    toast({
      title: `Importing ${dataType} Data`,
      description: "This is a placeholder. In a real app, this would open a data selection modal.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">FDP Accelerator Setup</h2>

        <CollapsibleSection title="Project Information" icon={<Settings />} defaultOpen>
            <div className="space-y-4">
                <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Region/Country</Label><Input value={inputs.regionCountry} onChange={(e) => handleInputChange('regionCountry', e.target.value)} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Development Concept</Label><Input value={inputs.developmentConcept} onChange={(e) => handleInputChange('developmentConcept', e.target.value)} className="bg-white/5 border-white/20" /></div>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Discipline Inputs" icon={<Database />}>
            <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-white flex items-center mb-2"><BarChart3 className="w-4 h-4 mr-2 text-lime-300"/>Geoscience & Reservoir</h4>
                    <div><Label className="text-lime-300 text-xs">STOOIP (MMbbl)</Label><Input type="number" value={inputs.stoip} onChange={(e) => handleInputChange('stoip', Number(e.target.value))} className="bg-white/10 border-white/20" /></div>
                    <Button type="button" size="sm" variant="outline" className="mt-2 w-full border-lime-400 text-lime-400 hover:bg-lime-400/10" onClick={() => handleImport('Reserves')}>Import Reserves Data</Button>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-white flex items-center mb-2"><Drill className="w-4 h-4 mr-2 text-lime-300"/>Wells & Drilling</h4>
                    <div><Label className="text-lime-300 text-xs">Number of Producers</Label><Input type="number" value={inputs.numProducers} onChange={(e) => handleInputChange('numProducers', Number(e.target.value))} className="bg-white/10 border-white/20" /></div>
                    <Button type="button" size="sm" variant="outline" className="mt-2 w-full border-lime-400 text-lime-400 hover:bg-lime-400/10" onClick={() => handleImport('Drilling Program')}>Import Drilling Program</Button>
                </div>
                 <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="font-semibold text-white flex items-center mb-2"><Banknote className="w-4 h-4 mr-2 text-lime-300"/>Economics</h4>
                    <div><Label className="text-lime-300 text-xs">Project CAPEX ($MM)</Label><Input type="number" value={inputs.capex} onChange={(e) => handleInputChange('capex', Number(e.target.value))} className="bg-white/10 border-white/20" /></div>
                    <Button type="button" size="sm" variant="outline" className="mt-2 w-full border-lime-400 text-lime-400 hover:bg-lime-400/10" onClick={() => handleImport('Economics')}>Import Economic Summary</Button>
                </div>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Generation Settings" icon={<ListChecks />}>
            <div className="space-y-4">
                <div>
                    <Label className="text-lime-300">FDP Standard Template</Label>
                    <select value={inputs.fdpStandard} onChange={(e) => handleInputChange('fdpStandard', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                        <option>General Industry Standard</option>
                        <option>NUPRC FDP Guidelines</option>
                        <option>Company Internal Standard</option>
                    </select>
                </div>
            </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Bot className="w-5 h-5 mr-2" />}
            AI Generate FDP Draft
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;