import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from '@/components/coreannotator/CollapsibleSection';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, UploadCloud, Play, FileText as FileIcon, ListChecks, SlidersHorizontal } from 'lucide-react';

const InputPanel = ({ onGenerate, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles.map(f => ({ name: f.name, curves: Math.floor(Math.random() * 10) + 5 }))]);
    toast({
      title: `${acceptedFiles.length} LAS file(s) added.`,
      description: "Ready for QC and plotting."
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/octet-stream': ['.las'] } });

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(inputs);
  };
  
  const curves = ['GR', 'RESD', 'RESM', 'RHOB', 'NPHI', 'DT', 'SP'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Log Data Setup</h2>

        <CollapsibleSection title="Project & Data Input" icon={<Settings />} defaultOpen>
          <div className="space-y-4">
            <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Well Name/ID</Label><Input value={inputs.wellName} onChange={(e) => handleInputChange('wellName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div {...getRootProps()} className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-lime-400 bg-lime-500/10' : 'border-white/20 hover:border-lime-400/50'}`}>
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-white">Drag & drop .las files here, or click to select</p>
            </div>
             <div className="mt-2 space-y-1">
              {uploadedFiles.map(file => (
                <div key={file.name} className="flex items-center justify-between text-sm text-slate-300 bg-white/5 p-2 rounded">
                  <div className="flex items-center"><FileIcon className="w-4 h-4 mr-2 text-lime-300"/>{file.name}</div>
                  <span className="text-xs text-slate-400">{file.curves} curves</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Curve Selection" icon={<ListChecks />}>
            <div className="grid grid-cols-3 gap-2">
                {curves.map(curve => (
                    <div key={curve} className="flex items-center space-x-2">
                        <Checkbox id={curve} defaultChecked className="border-lime-300" />
                        <label htmlFor={curve} className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{curve}</label>
                    </div>
                ))}
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="QC Settings" icon={<SlidersHorizontal />}>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><Label className="text-white">Spike Detection</Label><Checkbox defaultChecked /></div>
              <div className="flex items-center justify-between"><Label className="text-white">Flat Line Detection</Label><Checkbox defaultChecked /></div>
              <div className="flex items-center justify-between"><Label className="text-white">Missing Data</Label><Checkbox /></div>
            </div>
        </CollapsibleSection>

      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
            Run QC & Plot
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;