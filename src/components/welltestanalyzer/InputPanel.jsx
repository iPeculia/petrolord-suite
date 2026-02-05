import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleSection from './CollapsibleSection';
import { FileText, Droplets, SlidersHorizontal, Play, FolderArchive, Save, Flame, HelpCircle, BookOpen } from 'lucide-react';
import DataUpload from './DataUpload';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LoadProjectDialog from './LoadProjectDialog';
import { useNavigate } from 'react-router-dom';

const InputPanel = ({ onRunDemo, onDataLoaded, onSave, onLoad, loading, inputs, setInputs, isProjectLoaded }) => {
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };
  
  const handleRunDemoClick = () => {
    onRunDemo(inputs);
  }

  return (
    <TooltipProvider>
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Well Test Analyzer</h2>
        <Button variant="ghost" onClick={() => navigate('/dashboard/production/well-test-analyzer/guide')} className="text-slate-400 hover:text-lime-300">
          <BookOpen className="w-5 h-5 mr-2" />
          <span className="text-sm">Guide</span>
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button type="button" variant="outline" className="w-full text-lime-300 border-lime-400/50 hover:bg-lime-900/50" onClick={() => setIsLoadDialogOpen(true)}>
          <FolderArchive className="w-4 h-4 mr-2" /> Load Project
        </Button>
        <Button type="button" variant="outline" className="w-full text-slate-300 border-slate-600 hover:bg-slate-700" onClick={onSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" /> {isProjectLoaded ? 'Update' : 'Save'}
        </Button>
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto pr-2">
        <CollapsibleSection title="Project & Data Input" icon={<FileText />} defaultOpen>
          <div className="space-y-4 p-1">
            <div><Label className="text-slate-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} /></div>
            <div><Label className="text-slate-300">Well Name/ID</Label><Input value={inputs.wellName} onChange={(e) => handleInputChange('wellName', e.target.value)} /></div>
            <div>
                <Label className="text-slate-300">Test Type</Label>
                <select value={inputs.testType} onChange={(e) => handleInputChange('testType', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white">
                    <option>Drawdown</option><option>Buildup</option><option>Injection</option><option>Interference</option>
                </select>
            </div>
            <DataUpload onDataLoaded={onDataLoaded} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Fluid & Reservoir Properties" icon={<Droplets />} defaultOpen>
          <div className="grid grid-cols-2 gap-4 p-1">
            <div className="flex items-center space-x-2 col-span-2">
                <Switch id="gas-well-toggle" checked={inputs.isGasWell} onCheckedChange={(checked) => handleInputChange('isGasWell', checked)} />
                <Label htmlFor="gas-well-toggle" className="flex items-center text-orange-400 font-semibold"><Flame className="w-4 h-4 mr-2" />Gas Well</Label>
                <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-400" /></TooltipTrigger>
                    <TooltipContent><p>Enables pseudo-pressure & pseudo-time calculations.</p></TooltipContent>
                </Tooltip>
            </div>
            <div><Label className="text-slate-300">Viscosity (cP)</Label><Input type="number" step="0.1" value={inputs.viscosity} onChange={(e) => handleInputChange('viscosity', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Comp. (1/psi)</Label><Input type="number" step="1e-6" format="scientific" value={inputs.compressibility} onChange={(e) => handleInputChange('compressibility', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">FVF (bbl/STB)</Label><Input type="number" step="0.01" value={inputs.fvf} onChange={(e) => handleInputChange('fvf', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Porosity (fr)</Label><Input type="number" step="0.01" value={inputs.porosity} onChange={(e) => handleInputChange('porosity', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Thickness (ft)</Label><Input type="number" value={inputs.thickness} onChange={(e) => handleInputChange('thickness', Number(e.target.value))} /></div>
            <div><Label className="text-slate-300">Radius (ft)</Label><Input type="number" step="0.05" value={inputs.wellboreRadius} onChange={(e) => handleInputChange('wellboreRadius', Number(e.target.value))} /></div>
            <div className="col-span-2"><Label className="text-slate-300">Initial Pressure (psi)</Label><Input type="number" value={inputs.initialPressure} onChange={(e) => handleInputChange('initialPressure', Number(e.target.value))} /></div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Analysis Settings & Models" icon={<SlidersHorizontal />}>
            <div className="p-1 space-y-4">
                <p className="text-sm text-slate-400">Analysis settings are configured in the QC panel after data upload.</p>
            </div>
        </CollapsibleSection>
      </div>

      <div className="pt-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="button" onClick={handleRunDemoClick} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
            Run Analysis
          </Button>
        </motion.div>
      </div>
    </div>
    <LoadProjectDialog isOpen={isLoadDialogOpen} setIsOpen={setIsLoadDialogOpen} onLoadProject={onLoad} />
  </TooltipProvider>
  );
};

export default InputPanel;