import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileType, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { detectFileType, parseProductionHistory, parsePressureData, parsePVTData, parseContactObservations } from '@/utils/materialBalance/csvParser';
import { useToast } from '@/components/ui/use-toast';
import SampleDataDownloader from './SampleDataDownloader';

const MBADataImporter = () => {
  const [isParsing, setIsParsing] = useState(false);
  const { importProductionHistory, importPressureData, importPVTData, importContactObservations, updateDataQualityStatus } = useMaterialBalance();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // 1. Basic Validation
    if (!file.name.endsWith('.csv')) {
        toast({ title: "Invalid File", description: "Please upload a CSV file.", variant: "destructive" });
        return;
    }
    if (file.size === 0) {
        toast({ title: "Empty File", description: "The file appears to be empty.", variant: "destructive" });
        return;
    }

    setIsParsing(true);

    try {
      // 2. Read file for detection
      const text = await file.text();
      const firstLine = text.split('\n')[0];
      // Create simple mock object for detection based on header line
      const mockData = [firstLine.split(',').reduce((acc, curr) => ({...acc, [curr.trim()]: ''}), {})];
      
      const type = detectFileType(mockData);
      console.log(`File: ${file.name}, Detected Type: ${type}`);

      if (type === 'unknown') {
          throw new Error("Could not detect file type. Check column headers.");
      }

      let parsedData;
      let count = 0;
      let typeLabel = "";

      // 3. Parse based on detected type
      switch (type) {
        case 'production':
          parsedData = await parseProductionHistory(file);
          importProductionHistory(parsedData);
          count = parsedData.dates.length;
          typeLabel = "Production History";
          break;
        case 'pressure':
          parsedData = await parsePressureData(file);
          importPressureData(parsedData);
          count = parsedData.dates.length;
          typeLabel = "Pressure Data";
          break;
        case 'pvt':
          parsedData = await parsePVTData(file);
          importPVTData(parsedData);
          count = parsedData.pressure.length;
          typeLabel = "PVT Data";
          break;
        case 'contacts':
          parsedData = await parseContactObservations(file);
          importContactObservations(parsedData);
          count = parsedData.dates.length;
          typeLabel = "Contact Observations";
          break;
        default:
          throw new Error("Unknown file format. Please check column headers or download sample files.");
      }

      // 4. Update Context Status
      // (If updateDataQualityStatus is exposed from hook, call it. 
      // Otherwise the import functions above should trigger context updates which triggers re-renders)
      
      // Success Toast - High Contrast Green
      toast({
        title: `✓ ${typeLabel} Imported`,
        description: `Successfully loaded ${count} records.`,
        className: "bg-emerald-600 text-white border-emerald-700 font-medium shadow-lg",
        duration: 4000
      });

    } catch (error) {
      console.error("Import Error:", error);
      // Error Toast - High Contrast Red
      toast({
        title: "✗ Import Failed",
        description: error.message || "Failed to parse file. Please check format.",
        className: "bg-red-600 text-white border-red-700 font-medium shadow-lg",
        duration: 5000
      });
    } finally {
      setIsParsing(false);
    }
  }, [importProductionHistory, importPressureData, importPVTData, importContactObservations, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv', '.xls', '.xlsx']
    },
    multiple: false
  });

  return (
    <Card className="bg-slate-900 border-slate-800 mb-4">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
          <UploadCloud className="w-3.5 h-3.5 text-blue-400" /> Data Import
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}
          `}
        >
          <input {...getInputProps()} />
          {isParsing ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="text-xs">Parsing file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <FileType className="w-8 h-8 text-slate-500" />
              <div className="text-xs">
                <p className="font-medium text-slate-300">Drag & drop CSV file</p>
                <p className="text-slate-500 mt-1">Production, Pressure, PVT, or Contacts</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-[10px] text-slate-500 flex gap-2 justify-center">
          <div className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Auto-detect format</div>
          <div className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Validate data</div>
        </div>

        {/* Sample Data Downloader Section */}
        <SampleDataDownloader />
        
      </CardContent>
    </Card>
  );
};

export default MBADataImporter;