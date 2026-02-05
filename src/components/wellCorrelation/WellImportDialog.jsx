import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadCloud, FileText, AlertCircle, Database, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { parseWellFile } from '@/utils/wellImportParser';

const WellImportDialog = ({ open, onOpenChange, onImport }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [previewData, setPreviewData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    setLoading(true);
    setError(null);
    try {
      const file = acceptedFiles[0];
      const wells = await parseWellFile(file);
      if (wells.length === 0) {
        throw new Error("No valid well data found in file. Check column headers.");
      }
      setPreviewData(wells);
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
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    },
    multiple: false
  });

  const handleImport = () => {
    if (previewData.length > 0) {
      onImport(previewData);
      onOpenChange(false);
      setPreviewData([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import Wells</DialogTitle>
          <DialogDescription className="text-slate-400">
            Import well headers and trajectory data from various sources.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900 border-b border-slate-800 w-full justify-start rounded-none h-auto p-0">
            <TabsTrigger value="file" className="data-[state=active]:bg-slate-800 data-[state=active]:border-b-2 border-blue-500 rounded-none py-3 text-xs">
              <UploadCloud className="w-3 h-3 mr-2" /> File Upload
            </TabsTrigger>
            <TabsTrigger value="paste" className="data-[state=active]:bg-slate-800 data-[state=active]:border-b-2 border-blue-500 rounded-none py-3 text-xs">
              <FileText className="w-3 h-3 mr-2" /> Paste Data
            </TabsTrigger>
            <TabsTrigger value="db" className="data-[state=active]:bg-slate-800 data-[state=active]:border-b-2 border-blue-500 rounded-none py-3 text-xs">
              <Database className="w-3 h-3 mr-2" /> Database
            </TabsTrigger>
          </TabsList>

          <div className="p-4 min-h-[300px]">
            <TabsContent value="file" className="mt-0 space-y-4">
              {!previewData.length ? (
                <div 
                  {...getRootProps()} 
                  className={`
                    border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 hover:border-slate-500 bg-slate-900'}
                  `}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium">Drag & Drop well file here</p>
                  <p className="text-slate-500 text-xs mt-2">Supports CSV, Excel, JSON</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Found {previewData.length} wells
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewData([])} className="text-red-400 hover:text-red-300 h-8 text-xs">
                      Clear
                    </Button>
                  </div>
                  <ScrollArea className="h-[250px] border border-slate-800 rounded-md bg-slate-900">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 sticky top-0 z-10">
                        <tr>
                          <th className="p-2 border-b border-slate-800">Name</th>
                          <th className="p-2 border-b border-slate-800">UWI</th>
                          <th className="p-2 border-b border-slate-800">Type</th>
                          <th className="p-2 border-b border-slate-800 text-right">Depth</th>
                          <th className="p-2 border-b border-slate-800 text-right">X</th>
                          <th className="p-2 border-b border-slate-800 text-right">Y</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {previewData.map((well, i) => (
                          <tr key={i} className="hover:bg-slate-800/50">
                            <td className="p-2 font-medium text-slate-200">{well.name}</td>
                            <td className="p-2 text-slate-400">{well.uwi}</td>
                            <td className="p-2 text-slate-400">{well.type}</td>
                            <td className="p-2 text-right font-mono text-slate-300">{well.totalDepth}</td>
                            <td className="p-2 text-right font-mono text-slate-300">{well.location.x}</td>
                            <td className="p-2 text-right font-mono text-slate-300">{well.location.y}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="paste" className="mt-0">
              <div className="flex items-center justify-center h-[300px] text-slate-500 italic text-sm border border-slate-800 rounded bg-slate-900/20">
                Paste functionality coming soon.
              </div>
            </TabsContent>

            <TabsContent value="db" className="mt-0">
              <div className="flex items-center justify-center h-[300px] text-slate-500 italic text-sm border border-slate-800 rounded bg-slate-900/20">
                Database connector coming soon.
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={previewData.length === 0 || loading} className="bg-blue-600 hover:bg-blue-500 text-white">
            {loading ? 'Parsing...' : `Import ${previewData.length > 0 ? previewData.length + ' Wells' : 'Wells'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WellImportDialog;