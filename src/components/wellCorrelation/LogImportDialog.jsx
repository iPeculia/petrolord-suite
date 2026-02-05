import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadCloud, AlertCircle, CheckCircle2, FileCode } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { parseLogFile } from '@/utils/logImportParser';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LogImportDialog = ({ open, onOpenChange, onImport }) => {
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    setLoading(true);
    setError(null);
    try {
      const file = acceptedFiles[0];
      const data = await parseLogFile(file);
      setPreviewData({ ...data, fileName: file.name });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/plain': ['.las'] // LAS support
    },
    multiple: false
  });

  const handleImport = () => {
    if (previewData) {
      onImport(previewData);
      onOpenChange(false);
      setPreviewData(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            Import Logs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!previewData ? (
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 hover:border-slate-500 bg-slate-900'}
              `}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Drag & Drop log file</p>
              <p className="text-slate-500 text-xs mt-1">Supports LAS, CSV, Excel</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{previewData.fileName}</p>
                    <p className="text-xs text-slate-500">
                      {previewData.depths.length} depth points ({previewData.depths[0]?.toFixed(1)} - {previewData.depths[previewData.depths.length - 1]?.toFixed(1)} {previewData.metadata.depthUnit})
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPreviewData(null)} className="text-slate-400 hover:text-white h-7 text-xs">Change File</Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Available Curves ({previewData.curves.length})</h4>
                <ScrollArea className="h-[200px] border border-slate-800 rounded bg-slate-900">
                  <div className="divide-y divide-slate-800">
                    {previewData.curves.map((curve, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-800 text-xs">
                        <span className="font-medium text-blue-400">{curve.mnemonic}</span>
                        <div className="flex gap-4 text-slate-500">
                            <span>{curve.minValue?.toFixed(2)} - {curve.maxValue?.toFixed(2)}</span>
                            <span className="w-8 text-right">{curve.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button onClick={handleImport} disabled={!previewData || loading} className="bg-blue-600 hover:bg-blue-500 text-white">
            Import Logs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogImportDialog;