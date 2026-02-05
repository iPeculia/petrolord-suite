import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, AlertCircle, Check, X, Table } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import Papa from 'papaparse';

const CheckshotVSPImporter = ({ onDataLoaded }) => {
  const { toast } = useToast();
  const [fileData, setFileData] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        Papa.parse(text, {
          header: true,
          preview: 10,
          skipEmptyLines: true,
          complete: (results) => {
            setColumns(results.meta.fields);
            setPreviewData(results.data);
            setFileData(file);
            toast({ title: "File Analyzed", description: `Found ${results.meta.fields.length} columns.` });
          }
        });
      } else {
        toast({ variant: "destructive", title: "Unsupported Format", description: "Please upload CSV or TXT files for checkshots." });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'], 'text/plain': ['.txt', '.las'] } });

  const handleImport = () => {
    if (onDataLoaded && fileData) {
        // Here we would parse the full file
        onDataLoaded({ name: fileData.name, type: 'checkshot', columns });
        setFileData(null);
        setPreviewData([]);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {!fileData ? (
        <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors h-64 flex flex-col items-center justify-center ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'}`}
        >
            <input {...getInputProps()} />
            <div className="bg-slate-800 p-4 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-white">Drag & drop Checkshot or VSP files</p>
            <p className="text-xs text-slate-500 mt-1">Supports CSV, TXT, LAS (Time-Depth pairs)</p>
            <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
        </div>
      ) : (
        <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col min-h-0">
            <CardHeader className="py-3 border-b border-slate-800 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400"/> {fileData.name}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setFileData(null)}><X className="w-4 h-4"/></Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full">
                    <div className="p-4">
                        <div className="mb-4 text-xs text-slate-400">Preview (First 10 rows)</div>
                        <div className="rounded-md border border-slate-800 overflow-hidden">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-950 text-slate-300">
                                    <tr>
                                        {columns.map((col, i) => <th key={i} className="p-2 font-medium">{col}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {previewData.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-800/50">
                                            {columns.map((col, j) => <td key={j} className="p-2 text-slate-400">{row[col]}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setFileData(null)}>Cancel</Button>
                <Button onClick={handleImport} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    <Check className="w-4 h-4 mr-2"/> Import Data
                </Button>
            </div>
        </Card>
      )}
    </div>
  );
};

export default CheckshotVSPImporter;