import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSV, detectColumns, mapColumns, validateData } from '@/utils/declineCurve/csvParser';
import { generateQCSummary } from '@/utils/declineCurve/dataQuality';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { useToast } from '@/components/ui/use-toast';

const DCADataImporter = () => {
  const { currentWell, importProductionData, setDataQuality } = useDeclineCurve();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!currentWell) {
      toast({ title: "No well selected", description: "Please select a well first.", variant: "destructive" });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const { headers, rows } = await parseCSV(text);
      
      const mapping = detectColumns(headers);
      
      if (!mapping.date || !mapping.rate) {
        throw new Error("Could not auto-detect Date or Rate columns. Please verify CSV format.");
      }

      const mappedData = mapColumns(rows, mapping);
      const validation = validateData(mappedData);

      if (!validation.valid) {
        toast({ title: "Data Validation Failed", description: validation.errors[0], variant: "destructive" });
        return;
      }

      const qc = generateQCSummary(mappedData);
      setDataQuality(qc);
      
      importProductionData(currentWell.id, mappedData);
      toast({ title: "Import Successful", description: `Loaded ${mappedData.length} records.` });

    } catch (error) {
      console.error(error);
      toast({ title: "Import Error", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [currentWell, importProductionData, setDataQuality, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.csv']}, 
    multiple: false 
  });

  if (!currentWell) return null;

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Upload size={24} />
          <p className="text-sm">Drop CSV file here or click to upload</p>
          <span className="text-xs text-slate-500">Required: Date, Rate</span>
        </div>
      </div>
      
      {isProcessing && <div className="text-xs text-center text-blue-400">Processing...</div>}
    </div>
  );
};

export default DCADataImporter;