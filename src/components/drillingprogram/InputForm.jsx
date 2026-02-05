import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CollapsibleSection from './CollapsibleSection';
import { FileText, Layers, Droplets, Hammer as Drill, Compass, FileCheck, ShieldAlert, Zap } from 'lucide-react';

const initialInputs = {
  wellMetadata: { field: 'North Sea Block 7', wellName: 'A-12Z', latitude: '58.96', longitude: '1.49', totalDepth: '4500' },
  casingPlan: { sections: [{ size: '13 3/8"', weight: '68#', grade: 'L80', depth: '1500' }] },
  fluidProgram: { sections: [{ interval: '0-1500m', type: 'WBM', density: '9.5 ppg' }] },
  bhaSpec: { bit: 'PDC 12 1/4"', motor: '7.0" 5/6 7.0 Stg', mwd: 'Standard Pulser' },
  directionalPlan: { kickoffMD: '1600', buildRate: '3.0 deg/30m', targetCoords: '58.97, 1.51' },
  loggingProcedures: { logs: 'Gamma Ray, Resistivity, Density-Neutron' },
  hseConsiderations: { notes: 'Shallow gas hazard identified at 800m. Follow all safety protocols.' },
};

const InputForm = ({ onGenerate, loading }) => {
  const [inputs, setInputs] = useState(initialInputs);

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, wellMetadata: { ...prev.wellMetadata, [name]: value } }));
  };

  // Simplified handlers for demonstration. A real app would have more complex state management for arrays.
  const handleCasingChange = (e, index) => {
    const { name, value } = e.target;
    const newSections = [...inputs.casingPlan.sections];
    newSections[index][name] = value;
    setInputs(prev => ({ ...prev, casingPlan: { sections: newSections } }));
  };
  
  const handleFluidChange = (e, index) => {
    const { name, value } = e.target;
    const newSections = [...inputs.fluidProgram.sections];
    newSections[index][name] = value;
    setInputs(prev => ({ ...prev, fluidProgram: { sections: newSections } }));
  };

  const handleSimpleChange = (section, e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CollapsibleSection title="Well Metadata" icon={<FileText />} defaultOpen={true}>
        <div><Label className="text-lime-300">Field</Label><Input name="field" value={inputs.wellMetadata.field} onChange={handleMetadataChange} className="bg-white/5 border-white/20"/></div>
        <div><Label className="text-lime-300">Well Name</Label><Input name="wellName" value={inputs.wellMetadata.wellName} onChange={handleMetadataChange} className="bg-white/5 border-white/20"/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-lime-300">Latitude</Label><Input name="latitude" value={inputs.wellMetadata.latitude} onChange={handleMetadataChange} className="bg-white/5 border-white/20"/></div>
          <div><Label className="text-lime-300">Longitude</Label><Input name="longitude" value={inputs.wellMetadata.longitude} onChange={handleMetadataChange} className="bg-white/5 border-white/20"/></div>
        </div>
        <div><Label className="text-lime-300">Planned Total Depth (m)</Label><Input name="totalDepth" type="number" value={inputs.wellMetadata.totalDepth} onChange={handleMetadataChange} className="bg-white/5 border-white/20"/></div>
      </CollapsibleSection>

      <CollapsibleSection title="Casing & Cementing" icon={<Layers />}>
        {inputs.casingPlan.sections.map((sec, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 p-2 bg-black/20 rounded-md">
            <div><Label className="text-lime-300">Size</Label><Input name="size" value={sec.size} onChange={(e) => handleCasingChange(e, i)} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Depth (m)</Label><Input name="depth" value={sec.depth} onChange={(e) => handleCasingChange(e, i)} className="bg-white/5 border-white/20"/></div>
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="Drilling Fluid Program" icon={<Droplets />}>
         {inputs.fluidProgram.sections.map((sec, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 p-2 bg-black/20 rounded-md">
            <div><Label className="text-lime-300">Interval</Label><Input name="interval" value={sec.interval} onChange={(e) => handleFluidChange(e, i)} className="bg-white/5 border-white/20"/></div>
            <div><Label className="text-lime-300">Density</Label><Input name="density" value={sec.density} onChange={(e) => handleFluidChange(e, i)} className="bg-white/5 border-white/20"/></div>
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="BHA & Bit Specs" icon={<Drill />}>
         <div><Label className="text-lime-300">Bit</Label><Input name="bit" value={inputs.bhaSpec.bit} onChange={(e) => handleSimpleChange('bhaSpec', e)} className="bg-white/5 border-white/20"/></div>
         <div><Label className="text-lime-300">Motor</Label><Input name="motor" value={inputs.bhaSpec.motor} onChange={(e) => handleSimpleChange('bhaSpec', e)} className="bg-white/5 border-white/20"/></div>
      </CollapsibleSection>

      <CollapsibleSection title="Directional Plan" icon={<Compass />}>
        <div><Label className="text-lime-300">Kickoff MD (m)</Label><Input name="kickoffMD" value={inputs.directionalPlan.kickoffMD} onChange={(e) => handleSimpleChange('directionalPlan', e)} className="bg-white/5 border-white/20"/></div>
        <div><Label className="text-lime-300">Build Rate (deg/30m)</Label><Input name="buildRate" value={inputs.directionalPlan.buildRate} onChange={(e) => handleSimpleChange('directionalPlan', e)} className="bg-white/5 border-white/20"/></div>
      </CollapsibleSection>

      <CollapsibleSection title="Logging & Testing" icon={<FileCheck />}>
        <div><Label className="text-lime-300">Logs to run</Label><Textarea name="logs" value={inputs.loggingProcedures.logs} onChange={(e) => handleSimpleChange('loggingProcedures', e)} className="bg-white/5 border-white/20"/></div>
      </CollapsibleSection>
      
      <CollapsibleSection title="HSE Considerations" icon={<ShieldAlert />}>
        <div><Label className="text-lime-300">Operational Notes & Risks</Label><Textarea name="notes" value={inputs.hseConsiderations.notes} onChange={(e) => handleSimpleChange('hseConsiderations', e)} className="bg-white/5 border-white/20"/></div>
      </CollapsibleSection>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Zap className="w-5 h-5 mr-2" />}
          Generate Program
        </Button>
      </motion.div>
    </form>
  );
};

export default InputForm;