import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Upload, Database, FileText, CheckCircle, Wifi, Play, Thermometer, Wind } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const DataIngestionHub = ({ onRunAnalysis, loading }) => {
  const [productionFile, setProductionFile] = useState(null);
  const [wellTestFile, setWellTestFile] = useState(null);
  const { toast } = useToast();

  const onDrop = (acceptedFiles, setFile) => {
    setFile(acceptedFiles[0]);
    toast({
      title: 'File Ready',
      description: `${acceptedFiles[0].name} is ready for upload.`,
    });
  };

  const { getRootProps: prodRootProps, getInputProps: prodInputProps } = useDropzone({ onDrop: (files) => onDrop(files, setProductionFile), multiple: false });
  const { getRootProps: testRootProps, getInputProps: testInputProps } = useDropzone({ onDrop: (files) => onDrop(files, setWellTestFile), multiple: false });

  const handleRun = () => {
    if (!productionFile || !wellTestFile) {
      toast({
        variant: 'destructive',
        title: 'Missing Data',
        description: 'Please upload both production and well test data files.',
      });
      return;
    }
    onRunAnalysis({
      refProdOil: 120000, 
    });
  };

  const handleToast = (feature) => {
    toast({
        title: "🚧 Feature Coming Soon!",
        description: `${feature} isn't implemented yet.`,
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-lime-300"><Wifi className="mr-2" /> Real-time Data Connectors</CardTitle>
          <CardDescription>Connect to live data historians and SCADA systems.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleToast('OSIsoft PI Connector')} className="flex-col h-24"><Database className="w-6 h-6 mb-1"/>OSIsoft PI</Button>
          <Button variant="outline" onClick={() => handleToast('OPC-UA Connector')} className="flex-col h-24"><Wind className="w-6 h-6 mb-1"/>OPC-UA</Button>
          <Button variant="outline" onClick={() => handleToast('Emerson DeltaV Connector')} className="flex-col h-24"><Thermometer className="w-6 h-6 mb-1"/>Emerson DeltaV</Button>
          <Button variant="outline" onClick={() => handleToast('Custom API')} className="flex-col h-24"><Play className="w-6 h-6 mb-1"/>Custom API</Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lime-300"><Upload className="mr-2" /> Manual Data Upload</CardTitle>
            <CardDescription>Import daily production test data and manual readings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div {...prodRootProps()} className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-800">
              <input {...prodInputProps()} />
              <FileText className="mx-auto h-12 w-12 text-slate-500" />
              <p className="mt-2 text-sm text-slate-400">{productionFile ? productionFile.name : 'Drop daily production CSV here'}</p>
            </div>
             <div {...testRootProps()} className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-800">
              <input {...testInputProps()} />
              <FileText className="mx-auto h-12 w-12 text-slate-500" />
              <p className="mt-2 text-sm text-slate-400">{wellTestFile ? wellTestFile.name : 'Drop well test data CSV here'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lime-300"><CheckCircle className="mr-2" /> Data Validation</CardTitle>
            <CardDescription>Automated rules to flag erroneous or missing data.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full" onClick={() => handleToast('Configure Validation Rules')}>Configure Validation Rules</Button>
             <Button onClick={handleRun} disabled={loading} className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                {loading ? 'Processing...' : 'Process & Validate Data'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataIngestionHub;