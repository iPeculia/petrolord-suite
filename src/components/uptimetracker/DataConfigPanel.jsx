import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import { Settings, BarChart, Upload, Database } from 'lucide-react';

const DataConfigPanel = ({ onRunAnalysis, loading }) => {
  const [inputs, setInputs] = useState({
    projectName: 'Akpo Field Production',
    assetType: 'Facility',
    refProdOil: 150000,
    refProdGas: 300000,
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunAnalysis(inputs);
  };

  const handleToast = (feature) => {
    toast({
        title: "🚧 Feature Coming Soon!",
        description: `${feature} isn't implemented yet.`,
        duration: 3000,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Configuration</h2>

        <CollapsibleSection title="Project & Asset Selection" icon={<Settings />} defaultOpen>
          <div className="space-y-4">
            <div>
              <Label className="text-lime-300">Project Name</Label>
              <Input
                value={inputs.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="e.g., Akpo Field Production"
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-lime-300">Asset Type</Label>
              <select 
                value={inputs.assetType}
                onChange={(e) => handleInputChange('assetType', e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white"
              >
                <option>Individual Well</option>
                <option>Platform</option>
                <option>Facility</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Data Ingestion" icon={<Database />} defaultOpen>
            <div className="space-y-3">
                 <Button type="button" variant="outline" className="w-full" onClick={() => handleToast('Real-time SCADA Integration')}>Connect to SCADA/IoT</Button>
                 <Button type="button" variant="outline" className="w-full" onClick={() => handleToast('Log Downtime Event')}>Log Downtime Event</Button>
                 <Button type="button" variant="outline" className="w-full" onClick={() => handleToast('Batch Data Upload')}><Upload className="w-4 h-4 mr-2" />Batch Upload CSV</Button>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Production Baselines" icon={<BarChart />}>
          <div className="space-y-4">
            <div>
              <Label className="text-lime-300">Reference Production Rate (Oil, STB/day)</Label>
              <Input
                type="number"
                value={inputs.refProdOil}
                onChange={(e) => handleInputChange('refProdOil', Number(e.target.value))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-lime-300">Reference Production Rate (Gas, Mscf/day)</Label>
              <Input
                type="number"
                value={inputs.refProdGas}
                onChange={(e) => handleInputChange('refProdGas', Number(e.target.value))}
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 text-lg">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Settings className="w-5 h-5 mr-2" />
            )}
            Run Analysis
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default DataConfigPanel;