import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { parseFile } from '@/utils/fileParser';
import { SAMPLE_DATASETS } from '@/utils/sampleDatasets';

const FileUploadWizard = ({ onDataLoaded, isProcessing, setIsProcessing }) => {
  
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
        setIsProcessing(true);
        try {
            const file = acceptedFiles[0];
            const result = await parseFile(file);
            onDataLoaded(result.data, result.curves, file.name);
        } catch (error) {
            console.error(error);
            // Handle error toast here if available
        } finally {
            setIsProcessing(false);
        }
    }
  }, [onDataLoaded, setIsProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop,
      accept: {
          'text/plain': ['.las', '.txt', '.asc'],
          'text/csv': ['.csv'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          'application/json': ['.json']
      }
  });

  const loadSample = (key) => {
      const sample = SAMPLE_DATASETS[key];
      if(sample) {
          onDataLoaded(sample.data, sample.curves, sample.name);
      }
  };

  return (
    <div className="flex flex-col gap-6 h-full p-6">
        <div 
            {...getRootProps()} 
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 transition-colors cursor-pointer
            ${isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}`}
        >
            <input {...getInputProps()} />
            <div className="bg-slate-800 p-4 rounded-full mb-4">
                {isProcessing ? <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /> : <UploadCloud className="w-8 h-8 text-slate-400" />}
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">
                {isDragActive ? 'Drop file here' : 'Drag & Drop Log File'}
            </h3>
            <p className="text-slate-500 text-center max-w-md mb-6">
                Supports LAS 2.0, CSV, Excel, JSON. Optimized for large datasets (up to 100MB).
            </p>
            <Button variant="outline" className="border-emerald-600 text-emerald-500 hover:bg-emerald-600 hover:text-white">
                Browse Files
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(SAMPLE_DATASETS).map(([key, sample]) => (
                <Card key={key} className="bg-slate-900 border-slate-800 p-4 hover:border-slate-600 transition-colors cursor-pointer" onClick={() => loadSample(key)}>
                    <div className="flex items-start justify-between mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-mono text-slate-500 uppercase">{sample.type}</span>
                    </div>
                    <h4 className="font-bold text-slate-200 text-sm mb-1">{sample.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{sample.description}</p>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default FileUploadWizard;