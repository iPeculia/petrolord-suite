import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import { Settings, UploadCloud, Play, FileText as FileIcon } from 'lucide-react';

const InputPanel = ({ onGenerate, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    toast({
      title: `${acceptedFiles.length} core image(s) added.`,
      description: "Ready for AI analysis."
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.jpeg', '.png', '.jpg'] } });

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
        <h2 className="text-2xl font-bold text-white mb-4">Core Analysis Setup</h2>

        <CollapsibleSection title="Project & Core Data" icon={<Settings />} defaultOpen>
          <div className="space-y-4">
            <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Well Name/ID</Label><Input value={inputs.wellName} onChange={(e) => handleInputChange('wellName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-lime-300">Top Depth (MD)</Label><Input type="number" value={inputs.topDepth} onChange={(e) => handleInputChange('topDepth', e.target.value)} className="bg-white/5 border-white/20" /></div>
              <div><Label className="text-lime-300">Base Depth (MD)</Label><Input type="number" value={inputs.baseDepth} onChange={(e) => handleInputChange('baseDepth', e.target.value)} className="bg-white/5 border-white/20" /></div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Image Upload" icon={<UploadCloud />} defaultOpen>
          <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-lime-400 bg-lime-500/10' : 'border-white/20 hover:border-lime-400/50'}`}>
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 text-white">Drag & drop core photos, or click to select</p>
          </div>
          <div className="mt-2 space-y-1">
            {uploadedFiles.map(file => (
              <div key={file.path} className="flex items-center text-sm text-slate-300 bg-white/5 p-1 rounded">
                <FileIcon className="w-4 h-4 mr-2 text-lime-300"/>{file.path}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
            Analyze & Generate Strip Log
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;