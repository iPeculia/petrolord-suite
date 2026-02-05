import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import CollapsibleSection from './CollapsibleSection';
import { Settings, FolderTree, UploadCloud, ShieldCheck, Play, Folder, FileText as FileIcon, Plus } from 'lucide-react';

const InputPanel = ({ onGenerate, loading, initialInputs }) => {
  const [inputs, setInputs] = useState(initialInputs);
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    toast({
      title: `${acceptedFiles.length} file(s) added.`,
      description: "Ready for AI categorization upon generation."
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(inputs);
  };
  
  const structure = [
    { name: "Commercial & Legal", icon: <Folder /> },
    { name: "Geoscience", icon: <Folder />, children: [{ name: "Maps", icon: <Folder /> }] },
    { name: "Reservoir Engineering", icon: <Folder /> },
    { name: "Drilling", icon: <Folder /> },
  ];

  const renderStructure = (items, level = 0) => (
    items.map((item, index) => (
      <div key={index} style={{ marginLeft: `${level * 20}px` }} className="flex items-center text-white p-1">
        {item.icon}
        <span className="ml-2">{item.name}</span>
        {item.children && renderStructure(item.children, level + 1)}
      </div>
    ))
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Data Room Setup</h2>

        <CollapsibleSection title="Project Overview" icon={<Settings />} defaultOpen>
          <div className="space-y-4">
            <div><Label className="text-lime-300">Data Room Name</Label><Input value={inputs.dataRoomName} onChange={(e) => handleInputChange('dataRoomName', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Seller/Divesting Entity</Label><Input value={inputs.seller} onChange={(e) => handleInputChange('seller', e.target.value)} className="bg-white/5 border-white/20" /></div>
            <div><Label className="text-lime-300">Description</Label><Textarea value={inputs.description} onChange={(e) => handleInputChange('description', e.target.value)} className="bg-white/5 border-white/20" /></div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Structure & Categories" icon={<FolderTree />}>
          <div className="p-2 bg-slate-900/50 rounded-lg">
            {renderStructure(structure)}
          </div>
           <Button type="button" size="sm" variant="outline" className="w-full mt-2 border-lime-400 text-lime-400 hover:bg-lime-400/10">
            <Plus className="w-4 h-4 mr-2" />Add Top-Level Category
          </Button>
        </CollapsibleSection>

        <CollapsibleSection title="Document Upload" icon={<UploadCloud />}>
          <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-lime-400 bg-lime-500/10' : 'border-white/20 hover:border-lime-400/50'}`}>
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 text-white">Drag & drop files here, or click to select</p>
          </div>
          <div className="mt-2 space-y-1">
            {uploadedFiles.map(file => (
              <div key={file.path} className="flex items-center text-sm text-slate-300 bg-white/5 p-1 rounded">
                <FileIcon className="w-4 h-4 mr-2 text-lime-300"/>{file.path} - {Math.round(file.size / 1024)} KB
              </div>
            ))}
          </div>
        </CollapsibleSection>

         <CollapsibleSection title="Access & Permissions" icon={<ShieldCheck />}>
           <p className="text-sm text-slate-400 text-center">User and permissions management will be available after creating the data room.</p>
        </CollapsibleSection>
      </div>

      <div className="pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
            Create Data Room & Generate Analytics
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default InputPanel;