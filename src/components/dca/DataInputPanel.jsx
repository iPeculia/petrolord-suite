import React, { useState, useCallback, useEffect } from 'react';
    import { useDropzone } from 'react-dropzone';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Upload, Settings, Zap, HelpCircle, Database, FileJson, FileText, ClipboardPaste } from 'lucide-react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { useToast } from '@/components/ui/use-toast';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
    import Papa from 'papaparse';
    import { supabase } from '@/lib/customSupabaseClient';

    const DataInputPanel = ({ onAnalyze, loading, initialInputs, projectName, onProjectNameChange }) => {
      const { toast } = useToast();
      const [config, setConfig] = useState(initialInputs || {
        stream: 'OIL',
        decline_model: 'AUTO',
        b_min: 0.0,
        b_max: 1.0,
        b_step: 0.1,
        econ_limit_rate: 10,
        forecast_days: 3650,
        fit_start_date: '',
        fit_end_date: '',
        outlier_method: 'NONE',
        outlier_window_days: 30,
        smooth_window_days: 0,
        allow_segmentation: false,
      });
      const [activeTab, setActiveTab] = useState('csv');
      const [csvFile, setCsvFile] = useState(null);
      const [jsonRows, setJsonRows] = useState('');
      const [schemaInfo, setSchemaInfo] = useState(null);
      const [sampleCsv, setSampleCsv] = useState(null);
      const [samplePreview, setSamplePreview] = useState([]);

      const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          setCsvFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target.result;
            setJsonRows(text); // Store file content for analysis
          };
          reader.readAsText(file);
          toast({ title: "File Ready", description: `"${file.name}" is ready for analysis.` });
        }
      }, [toast]);

      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false });

      const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

      const handleSelectChange = (name, value) => setConfig(prev => ({ ...prev, [name]: value }));

      const handleRunAnalysis = () => {
        if (activeTab === 'csv') {
          if (!jsonRows) {
            toast({ title: "No CSV file selected or content is empty", variant: "destructive" });
            return;
          }
          onAnalyze(config, jsonRows, 'csv');
        } else {
          try {
            const rows = JSON.parse(jsonRows);
            if (!Array.isArray(rows)) throw new Error("JSON must be an array of objects.");
            onAnalyze(config, rows, 'json');
          } catch (error) {
            toast({ title: "Invalid JSON", description: error.message, variant: "destructive" });
          }
        }
      };

      const fetchSchemaAndSample = async (type) => {
        try {
          const { data, error } = await supabase.functions.invoke('dca-engine', {
            body: { action: type }
          });
          if (error) throw new Error(`Edge Function Error: ${error.message}`);
          if (data.error) throw new Error(data.error);
          
          if (type === 'get_schema') {
            setSchemaInfo(data);
          } else if (type === 'get_sample') {
            setSampleCsv(data.csv_content);
            Papa.parse(data.csv_content, { header: true, preview: 5, complete: (results) => setSamplePreview(results.data) });
          }
        } catch (error) {
          toast({ title: `Failed to fetch ${type === 'get_schema' ? 'schema' : 'sample'}`, description: error.message, variant: "destructive" });
        }
      };

      const downloadSampleCsv = () => {
        if (!sampleCsv) return;
        const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'sample_dca_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      return (
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <Label htmlFor="project-name">Project Name</Label>
            <Input id="project-name" value={projectName} onChange={(e) => onProjectNameChange(e.target.value)} className="bg-gray-700 border-gray-600 text-white text-lg" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Data & Config</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="csv"><Upload className="w-4 h-4 mr-2 inline-block"/>Upload CSV</TabsTrigger>
                <TabsTrigger value="json"><ClipboardPaste className="w-4 h-4 mr-2 inline-block"/>Paste JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="csv" className="mt-4">
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/30 hover:border-purple-400/80 hover:bg-white/5'}`}>
                  <input {...getInputProps()} />
                  <Upload className="w-10 h-10 mx-auto text-purple-300 mb-2" />
                  {csvFile ? <p className="text-green-300 font-semibold truncate">{csvFile.name}</p> : <p className="text-purple-200">Drag & drop CSV file</p>}
                </div>
              </TabsContent>
              <TabsContent value="json" className="mt-4">
                <Label>Paste JSON Rows</Label>
                <Textarea value={jsonRows} onChange={(e) => setJsonRows(e.target.value)} placeholder='[{"date": "2024-01-01", "rate": 1000}]' rows={5} className="bg-gray-700 border-gray-600 text-white"/>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Settings className="w-5 h-5 mr-2" />Analysis Parameters</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Stream</Label><Select name="stream" value={config.stream} onValueChange={(v) => handleSelectChange('stream', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="OIL">Oil</SelectItem><SelectItem value="GAS">Gas</SelectItem><SelectItem value="WATER">Water</SelectItem></SelectContent></Select></div>
                <div><Label>Decline Model</Label><Select name="decline_model" value={config.decline_model} onValueChange={(v) => handleSelectChange('decline_model', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="AUTO">Auto</SelectItem><SelectItem value="EXPONENTIAL">Exponential</SelectItem><SelectItem value="HYPERBOLIC">Hyperbolic</SelectItem><SelectItem value="HARMONIC">Harmonic</SelectItem></SelectContent></Select></div>
              </div>
              {(config.decline_model === 'HYPERBOLIC' || config.decline_model === 'AUTO') && (
                <div className="grid grid-cols-3 gap-2 p-2 bg-slate-800/50 rounded-md">
                  <div><Label>b min</Label><Input name="b_min" type="number" value={config.b_min} onChange={handleConfigChange} /></div>
                  <div><Label>b max</Label><Input name="b_max" type="number" value={config.b_max} onChange={handleConfigChange} /></div>
                  <div><Label>b step</Label><Input name="b_step" type="number" value={config.b_step} onChange={handleConfigChange} /></div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Econ Limit Rate</Label><Input name="econ_limit_rate" type="number" value={config.econ_limit_rate} onChange={handleConfigChange} /></div>
                <div><Label>Forecast Days</Label><Input name="forecast_days" type="number" value={config.forecast_days} onChange={handleConfigChange} /></div>
                <div><Label>Fit Start Date</Label><Input name="fit_start_date" type="date" value={config.fit_start_date} onChange={handleConfigChange} /></div>
                <div><Label>Fit End Date</Label><Input name="fit_end_date" type="date" value={config.fit_end_date} onChange={handleConfigChange} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Outlier Method</Label><Select name="outlier_method" value={config.outlier_method} onValueChange={(v) => handleSelectChange('outlier_method', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="NONE">None</SelectItem><SelectItem value="HAMPEL">Hampel</SelectItem><SelectItem value="IQR">IQR</SelectItem></SelectContent></Select></div>
                <div><Label>Outlier Window</Label><Input name="outlier_window_days" type="number" value={config.outlier_window_days} onChange={handleConfigChange} /></div>
              </div>
              <div><Label>Smooth Window</Label><Input name="smooth_window_days" type="number" value={config.smooth_window_days} onChange={handleConfigChange} /></div>
              <div className="flex items-center space-x-2"><Checkbox id="allow_segmentation" name="allow_segmentation" checked={config.allow_segmentation} onCheckedChange={(c) => handleSelectChange('allow_segmentation', c)} /><Label htmlFor="allow_segmentation">Allow Segmentation</Label></div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="space-y-2">
            <Button onClick={handleRunAnalysis} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : <><Zap className="w-5 h-5 mr-2" />Plot & Fit</>}
            </Button>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild><Button variant="outline" className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20" onClick={() => fetchSchemaAndSample('get_sample')}><Database className="w-4 h-4 mr-2"/>Sample</Button></DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl"><DialogHeader><DialogTitle className="text-2xl text-cyan-300">Sample Data</DialogTitle><DialogDescription className="text-slate-400">Preview of sample data. You can download the full file.</DialogDescription></DialogHeader><div className="overflow-x-auto max-h-[60vh]"><table className="w-full text-sm text-left"><thead className="text-xs text-lime-300 uppercase bg-slate-800"><tr>{samplePreview[0] && Object.keys(samplePreview[0]).map(h => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead><tbody>{samplePreview.map((row, i) => (<tr key={i} className="bg-slate-900 border-b border-slate-800">{Object.values(row).map((val, j) => <td key={j} className="px-4 py-2 font-mono">{val}</td>)}</tr>))}</tbody></table></div><Button onClick={downloadSampleCsv} className="mt-4 w-full">Download Sample CSV</Button></DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild><Button variant="outline" className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/20" onClick={() => fetchSchemaAndSample('get_schema')}><HelpCircle className="w-4 h-4 mr-2"/>Schema</Button></DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl"><DialogHeader><DialogTitle className="text-2xl text-lime-300 flex items-center"><FileText className="w-6 h-6 mr-2"/>Schema Help</DialogTitle><DialogDescription className="text-slate-400">Your data should conform to this structure.</DialogDescription></DialogHeader>{schemaInfo ? <div className="max-h-[60vh] overflow-y-auto pr-4"><h3 className="font-bold text-lg text-white mt-4 mb-2">Columns</h3><ul className="list-disc list-inside space-y-2">{schemaInfo.columns.map(col => (<li key={col.name}><span className="font-mono bg-slate-800 text-lime-300 px-2 py-1 rounded">{col.name}</span> ({col.type}): {col.description}</li>))}</ul></div> : <p>Loading schema...</p>}</DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      );
    };

    export default DataInputPanel;