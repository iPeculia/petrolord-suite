import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud } from 'lucide-react';

const DataUpload = ({ onDataLoaded }) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const file = acceptedFiles[0];
    
    if (!['text/csv', 'text/plain'].some(type => file.type.startsWith(type)) && !file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.txt')) {
       toast({
            variant: "destructive",
            title: "Unsupported File Type",
            description: "Please upload a .csv or .txt file.",
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimiter: (file.name.toLowerCase().endsWith('.txt')) ? "" : ",",
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("PapaParse errors:", results.errors);
            toast({
                variant: "destructive",
                title: "Parsing Error",
                description: `Could not parse file. Check format. Error: ${results.errors[0].message}`,
            });
            return;
          }
          if (!results.data || results.data.length === 0 || !results.meta.fields) {
            toast({
                variant: "destructive",
                title: "Parsing Error",
                description: "File is empty or headers are missing. Please ensure the file is correctly formatted.",
            });
            return;
          }
          onDataLoaded({
            data: results.data,
            headers: results.meta.fields,
            fileName: file.name
          });
        },
        error: (err) => {
             toast({
                variant: "destructive",
                title: "File Reading Error",
                description: err.message,
            });
        }
      });
    };
    reader.readAsText(file);

  }, [onDataLoaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: {'text/csv': ['.csv'], 'text/plain': ['.txt']} });

  return (
    <div 
      {...getRootProps()} 
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-lime-400 bg-lime-900/30' : 'border-slate-600 hover:border-lime-500 hover:bg-slate-800/50'}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto w-10 h-10 text-slate-400 mb-2" />
      {isDragActive ? (
        <p className="text-lime-300">Drop the file here ...</p>
      ) : (
        <p className="text-slate-400 text-sm">Drag & drop a test file here, or click to select</p>
      )}
      <p className="text-xs text-slate-500 mt-1">Supports .csv, .txt</p>
    </div>
  );
};

export default DataUpload;