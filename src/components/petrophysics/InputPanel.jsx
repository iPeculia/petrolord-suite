import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from '@/components/logdataviz/CollapsibleSection';
import { Settings, UploadCloud, Play, FileText as FileIcon, SlidersHorizontal, Droplets, Percent } from 'lucide-react';

const InputPanel = ({ onGenerate, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    toast({
      title: `${acceptedFiles.length} LAS file(s) added.`,
      description: "Ready for petrophysical analysis."
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/plain': ['.las'] } });

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Petrophysics Estimator</h2>

        <CollapsibleSection title="Project & Log Data" icon={<Settings />} defaultOpen>
          <div className="space-y-4">
            <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Well Name/ID</Label><Input value={inputs.wellName} onChange={(e) => handleInputChange('wellName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-lime-400 bg-lime-500/10' : 'border-white/20 hover:border-lime-400/50'}`}>
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm text-white">Drag & drop .las file(s) here</p>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Vshale Model" icon={<SlidersHorizontal />} defaultOpen>
          <div className="space-y-4">
            <select value={inputs.vshModel} onChange={(e) => handleInputChange('vshModel', e.target.value)} className="w-full bg-white/5 border-white/20 p-2 rounded">
              <option>Linear</option>
              <option>Clavier</option>
              <option>Stieber</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-lime-300">GR Matrix</Label><Input type="number" value={inputs.grMatrix} onChange={(e) => handleInputChange('grMatrix', e.target.value)} className="bg-white/5 border-white/20" /></div>
              <div><Label className="text-lime-300">GR Shale</Label><Input type="number" value={inputs.grShale} onChange={(e) => handleInputChange('grShale', e.target.value)} className="bg-white/5 border-white/20" /></div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Porosity Model" icon={<Percent />}>
          <div className="space-y-4">
            <select value={inputs.porosityModel} onChange={(e) => handleInputChange('porosityModel', e.target.value)} className="w-full bg-white/5 border-white/20 p-2 rounded">
              <option>Neutron-Density</option>
              <option>Density</option>
              <option>Sonic</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-lime-300">Matrix Density</Label><Input type="number" step="0.01" value={inputs.matrixDensity} onChange={(e) => handleInputChange('matrixDensity', e.target.value)} className="bg-white/5 border-white/20" /></div>
              <div><Label className="text-lime-300">Fluid Density</Label><Input type="number" step="0.01" value={inputs.fluidDensity} onChange={(e) => handleInputChange('fluidDensity', e.target.value)} className="bg-white/5 border-white/20" /></div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Water Saturation Model" icon={<Droplets />}>
          <div className="space-y-4">
            <select value={inputs.swModel} onChange={(e) => handleInputChange('swModel', e.target.value)} className="w-full bg-white/5 border-white/20 p-2 rounded">
              <option>Archie</option>
              <option>Simandoux</option>
              <option>Indonesia</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-lime-300">Rw</Label><Input type="number" step="0.01" value={inputs.rw} onChange={(e) => handleInputChange('rw', e.target.value)} className="bg-white/5 border-white/20" /></div>
              <div><Label className="text-lime-300">a</Label><Input type="number" step="0.1" value={inputs.a} onChange={(e) => handleInputChange('a', e.target.value)} className="bg-white/5 border-white/20" /></div>
              <div><Label className="text-lime-300">m</Label><Input type="number" step="0.1" value={inputs.m} onChange={(e) => handleInputChange('m', e.target.value)} className="bg-white/5 border-white/20" /></div>
              <div><Label className="text-lime-300">n</Label><Input type="number" step="0.1" value={inputs.n} onChange={(e) => handleInputChange('n', e.target.value)} className="bg-white/5 border-white/20" /></div>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
            Run Petrophysics
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;