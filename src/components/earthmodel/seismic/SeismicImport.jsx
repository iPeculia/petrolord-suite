import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Waves, FileCheck } from 'lucide-react';

const SeismicImport = () => {
  return (
    <Card className="h-full bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Seismic Data Import</CardTitle>
        <CardDescription>Upload and process SEG-Y files</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-6">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-700">
          <Waves className="w-10 h-10 text-slate-500" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-slate-200">Drag and drop SEG-Y files</h3>
          <p className="text-sm text-slate-500 max-w-md">
            Support for standard SEG-Y rev 1 and 2. Max file size 5GB for browser upload.
            Use the desktop connector for larger datasets.
          </p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
          <Upload className="w-4 h-4 mr-2" /> Browse Files
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeismicImport;