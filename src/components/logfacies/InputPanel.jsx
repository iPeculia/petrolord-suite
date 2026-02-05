import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, Play, Settings, SlidersHorizontal, Filter, BrainCircuit, BookUser, Lightbulb, Bot, Save } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { processLogFile } from '@/utils/logFaciesCalculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 font-semibold text-teal-300">
        <span className="flex items-center gap-2">{icon}{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="p-3 border-t border-gray-700 space-y-4">{children}</div>}
    </div>
  );
};

const InputPanel = ({ state, onStateChange, onFileUpload, onRunAnalysis, onOptimalK, onSaveProject }) => {
  const { toast } = useToast();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onFileUpload, accept: { 'text/csv': ['.csv'], 'application/octet-stream': ['.las'] }, multiple: false });
  const { logData, fileName, curves, analysisCurves, filter, params, mdMin, mdMax, loading, analysisMode } = state;

  const handleParamChange = (panel, key, value) => {
    onStateChange('params', { ...params, [panel]: { ...params[panel], [key]: value } });
  };

  const handleSupervisedParamChange = (key, value) => {
    onStateChange('params', { ...params, supervised: { ...params.supervised, [key]: value } });
  };

  const handleFilterChange = (key, value) => {
    onStateChange('filter', { ...filter, [key]: value });
  };

  const handleAnalysisCurveChange = (curve, checked) => {
    const newCurves = checked
      ? [...analysisCurves, curve]
      : analysisCurves.filter(c => c !== curve);
    onStateChange('analysisCurves', newCurves);
  };
  
  const handleTrainingFileUpload = async (files) => {
    const file = files[0];
    if (!file) return;
    try {
      const { logData: trainingData, curves: trainingCurves, depthCol } = await processLogFile(file);
      handleSupervisedParamChange('trainingFile', file.name);
      handleSupervisedParamChange('trainingData', trainingData);
      handleSupervisedParamChange('trainingCurves', trainingCurves);
      handleSupervisedParamChange('depthCol', depthCol);
      const faciesCol = trainingCurves.find(c => c.toLowerCase().includes('facies')) || trainingCurves[1] || '';
      handleSupervisedParamChange('faciesCol', faciesCol);
      toast({ title: "Training file loaded", description: `${file.name} is ready.` });
    } catch (e) {
      toast({ title: "Training File Error", description: e.message, variant: 'destructive' });
    }
  };

  const trainingFileDropzone = useDropzone({ onDrop: handleTrainingFileUpload, accept: { 'text/csv': ['.csv'], 'application/octet-stream': ['.las'] }, multiple: false });

  const canCompute = logData && analysisCurves.length >= 2;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex-grow space-y-4 overflow-y-auto pr-2">
        <div {...getRootProps()} id="file-upload-input" className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-pink-400 bg-pink-500/10' : 'border-white/20 hover:border-pink-400/50'}`}>
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm text-white">{fileName || 'Drag & drop Log File (LAS/CSV)'}</p>
        </div>

        <Tabs value={analysisMode} onValueChange={(value) => onStateChange('analysisMode', value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unsupervised"><BrainCircuit className="w-4 h-4 mr-2" />Unsupervised</TabsTrigger>
                <TabsTrigger value="supervised"><BookUser className="w-4 h-4 mr-2" />Supervised</TabsTrigger>
            </TabsList>
            <div className="mt-4 space-y-4">
                <CollapsibleSection title="Data Preparation" icon={<SlidersHorizontal />} defaultOpen>
                  <div>
                    <Label className="text-lime-300">Analysis Curves</Label>
                    <ScrollArea className="h-40 w-full rounded-md border border-gray-700 p-2 mt-1">
                      {curves.map(curve => (
                        <div key={curve} className="flex items-center space-x-2 p-1">
                          <Checkbox
                            id={curve}
                            checked={analysisCurves.includes(curve)}
                            onCheckedChange={(checked) => handleAnalysisCurveChange(curve, checked)}
                            disabled={!logData}
                          />
                          <label htmlFor={curve} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {curve}
                          </label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <Label>Normalization Method</Label>
                  <Select value={params.normalization} onValueChange={(v) => onStateChange('params', {...params, normalization: v})} disabled={!logData}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="min-max">Min-Max Scaling</SelectItem>
                      <SelectItem value="z-score">Z-Score Standardization</SelectItem>
                    </SelectContent>
                  </Select>
                </CollapsibleSection>

                <CollapsibleSection title="Depth Filter" icon={<Filter />}>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="MD Min" value={filter.md_min} onChange={e => handleFilterChange('md_min', e.target.value)} />
                    <Input type="number" placeholder="MD Max" value={filter.md_max} onChange={e => handleFilterChange('md_max', e.target.value)} />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => onStateChange('filter', {...filter, md_min: mdMin, md_max: mdMax})}>Use Full Range</Button>
                </CollapsibleSection>
            </div>
            <TabsContent value="unsupervised" className="mt-4 space-y-4">
                <CollapsibleSection title="Unsupervised Parameters" icon={<Settings />} defaultOpen>
                  <Label>Algorithm</Label>
                  <Select value={params.unsupervised.algorithm} onValueChange={v => handleParamChange('unsupervised', 'algorithm', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kmeans">K-Means Clustering</SelectItem>
                      <SelectItem value="hierarchical">Hierarchical Clustering</SelectItem>
                      <SelectItem value="som">Self-Organizing Maps (SOM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <Label>Number of Facies (K): {params.unsupervised.k}</Label>
                    <Slider value={[params.unsupervised.k]} onValueChange={v => handleParamChange('unsupervised', 'k', v[0])} min={2} max={15} step={1} />
                  </div>
                   <Button onClick={onOptimalK} disabled={loading || !canCompute} variant="outline" className="w-full"><Lightbulb className="w-4 h-4 mr-2" /> Find Optimal K</Button>
                </CollapsibleSection>
            </TabsContent>
            <TabsContent value="supervised" className="mt-4 space-y-4">
                <CollapsibleSection title="Training Data" icon={<Bot />} defaultOpen>
                  <div {...trainingFileDropzone.getRootProps()} className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${trainingFileDropzone.isDragActive ? 'border-sky-400 bg-sky-500/10' : 'border-white/20 hover:border-sky-400/50'}`}>
                    <input {...trainingFileDropzone.getInputProps()} />
                    <UploadCloud className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="mt-1 text-xs text-white">{params.supervised.trainingFile || 'Drop Training File (CSV/LAS with facies labels)'}</p>
                  </div>
                  {params.supervised.trainingData && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Depth Column</Label>
                        <Select value={params.supervised.depthCol} onValueChange={v => handleSupervisedParamChange('depthCol', v)}>
                          <SelectTrigger><SelectValue/></SelectTrigger>
                          <SelectContent>{params.supervised.trainingCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Facies Column</Label>
                        <Select value={params.supervised.faciesCol} onValueChange={v => handleSupervisedParamChange('faciesCol', v)}>
                          <SelectTrigger><SelectValue/></SelectTrigger>
                          <SelectContent>{params.supervised.trainingCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CollapsibleSection>
            </TabsContent>
        </Tabs>
      </div>

      <div className="pt-4 border-t border-gray-700 space-y-2">
        <Button onClick={onRunAnalysis} disabled={loading || !canCompute} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
          Run Analysis
        </Button>
        <Button onClick={onSaveProject} disabled={loading || !logData} variant="outline" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Project
        </Button>
      </div>
    </div>
  );
};

export default InputPanel;