import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const AdvancedInputHandler = ({ onDataLoaded }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (newFiles) => {
    const processed = newFiles.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: detectFileType(file.name),
      status: 'valid' // mock validation
    }));
    setFiles(prev => [...prev, ...processed]);
    toast({ title: "Files Analyzed", description: `${newFiles.length} files queued for import.` });
  };

  const detectFileType = (filename) => {
    const lower = filename.toLowerCase();
    if (lower.includes('.las')) return 'Well Log';
    if (lower.includes('.csv') || lower.includes('.txt')) {
        if(lower.includes('checkshot') || lower.includes('vsp')) return 'Checkshot/VSP';
        if(lower.includes('tops')) return 'Well Tops';
        return 'Table Data';
    }
    if (lower.includes('.sgy') || lower.includes('.segy')) return 'Seismic Velocity';
    return 'Unknown';
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-slate-800 p-3 rounded-full">
            <UploadCloud className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Drag & drop files here</p>
            <p className="text-xs text-slate-500 mt-1">Supports LAS, CSV, ASCII, SEGY</p>
          </div>
          <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
        </div>
      </div>

      <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col min-h-0">
        <div className="p-3 border-b border-slate-800 bg-slate-950/50 font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Staged Data
        </div>
        <ScrollArea className="flex-1 p-2">
            {files.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-sm italic">
                    No files staged for import.
                </div>
            ) : (
                <div className="space-y-2">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium text-white">{file.name}</div>
                                    <div className="text-[10px] text-slate-400 flex gap-2">
                                        <span>{file.size}</span>
                                        <span className="text-emerald-400">{file.type}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={() => removeFile(idx)}>
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" disabled={files.length === 0}>
                Import {files.length} Files
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedInputHandler;