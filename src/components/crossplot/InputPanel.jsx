import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, Play, Settings, SlidersHorizontal, Filter, BrainCircuit, Calculator, ChevronDown, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center p-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2 text-blue-400">{icon}{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </button>
      {isOpen && <div className="p-3 border-t border-slate-800 space-y-4 bg-slate-950/30">{children}</div>}
    </div>
  );
};

const InputPanel = ({ state, project, setProject, onStateChange, onFileUpload, onCompute, loading }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: onFileUpload, 
    accept: { 'text/csv': ['.csv'], 'application/octet-stream': ['.las'] }, 
    multiple: false 
  });
  
  const { logData, fileName, curves, curveMap, filter, plotType, params, mdMin, mdMax } = state;

  const handleParamChange = (panel, key, value) => {
    onStateChange('params', { ...params, [panel]: { ...params[panel], [key]: value } });
  };

  const handleCurveMapChange = (key, value) => {
    onStateChange('curveMap', { ...curveMap, [key]: value });
  };

  const isDNReady = curveMap.rhob && curveMap.nphi;
  const isPickettReady = curveMap.rt && curveMap[params.pickett.porosity_source];
  const canCompute = logData && (plotType === 'density_neutron' ? isDNReady : isPickettReady);

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      <div className="space-y-2 mb-6">
         <Label className="text-slate-400">Project Name</Label>
         <Input 
           value={project.name} 
           onChange={(e) => setProject({...project, name: e.target.value})}
           className="bg-slate-800 border-slate-700 text-white"
         />
      </div>

      {!logData && (
        <div {...getRootProps()} id="file-upload-input" className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-slate-700 hover:border-blue-400/50 hover:bg-slate-800/50'}`}>
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-10 w-10 text-slate-500 mb-3" />
          <p className="text-sm text-slate-300 font-medium">Drop LAS/CSV file here</p>
          <p className="text-xs text-slate-500 mt-1">or click to browse</p>
        </div>
      )}

      {fileName && (
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
           <span className="text-sm text-slate-300 truncate max-w-[200px]">{fileName}</span>
           <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">loaded</Badge>
        </div>
      )}

      <CollapsibleSection title="Plot Configuration" icon={<Settings className="w-4 h-4"/>} defaultOpen>
        <div>
          <Label className="mb-2 block">Plot Type</Label>
          <Select value={plotType} onValueChange={(v) => onStateChange('plotType', v)} disabled={!logData}>
            <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="density_neutron">Density-Neutron</SelectItem>
              <SelectItem value="pickett">Pickett Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Curve Mapping" icon={<SlidersHorizontal className="w-4 h-4"/>} defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(curveMap).map(key => (
            <div key={key}>
              <Label className="capitalize text-xs text-slate-500 mb-1 block">{key.replace('_', ' ')}</Label>
              <Select value={curveMap[key]} onValueChange={v => handleCurveMapChange(key, v)} disabled={!logData}>
                <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {curves.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Depth & Filters" icon={<Filter className="w-4 h-4"/>}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
             <Label className="text-xs text-slate-500">Top MD</Label>
             <Input type="number" className="h-8 bg-slate-950 border-slate-700" value={filter.md_min} onChange={e => onStateChange('filter', {...filter, md_min: e.target.value})} />
          </div>
          <div>
             <Label className="text-xs text-slate-500">Base MD</Label>
             <Input type="number" className="h-8 bg-slate-950 border-slate-700" value={filter.md_max} onChange={e => onStateChange('filter', {...filter, md_max: e.target.value})} />
          </div>
        </div>
        <div className="space-y-3">
           <div className="flex justify-between">
              <Label className="text-xs">Vshale Cutoff</Label>
              <span className="text-xs text-slate-400">{filter.vsh_max}</span>
           </div>
           <Slider value={[filter.vsh_max]} onValueChange={v => onStateChange('filter', {...filter, vsh_max: v[0]})} min={0} max={1} step={0.05} className="py-2"/>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Parameters" icon={<Settings className="w-4 h-4"/>}>
        {plotType === 'density_neutron' && (
          <div className="space-y-3">
            <Label className="text-xs">Matrix Line</Label>
            <Select value={params.dn.nphi_scale} onValueChange={v => handleParamChange('dn', 'nphi_scale', v)}>
              <SelectTrigger className="h-8 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="limestone">Limestone (CaCO3)</SelectItem>
                <SelectItem value="sandstone">Sandstone (SiO2)</SelectItem>
                <SelectItem value="dolomite">Dolomite (CaMg(CO3)2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {plotType === 'pickett' && (
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">a (Tortuosity)</Label><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={params.pickett.a} onChange={e => handleParamChange('pickett', 'a', e.target.value)} /></div>
            <div><Label className="text-xs">m (Cementation)</Label><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={params.pickett.m} onChange={e => handleParamChange('pickett', 'm', e.target.value)} /></div>
            <div><Label className="text-xs">n (Saturation)</Label><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={params.pickett.n} onChange={e => handleParamChange('pickett', 'n', e.target.value)} /></div>
            <div><Label className="text-xs">Rw (ohm.m)</Label><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={params.pickett.Rw} onChange={e => handleParamChange('pickett', 'Rw', e.target.value)} /></div>
          </div>
        )}
      </CollapsibleSection>
      
      <CollapsibleSection title="Calculations" icon={<Calculator className="w-4 h-4"/>}>
          <div className="flex items-center space-x-2 mb-4">
              <Switch id="poro-calc-enable" checked={params.poro.enabled} onCheckedChange={v => handleParamChange('poro', 'enabled', v)} />
              <Label htmlFor="poro-calc-enable" className="text-sm cursor-pointer">Calc Porosity from Density</Label>
          </div>
          {params.poro.enabled && (
              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                  <div>
                      <Label className="text-xs">Rho Matrix</Label>
                      <Input className="h-8 bg-slate-950 border-slate-700" type="number" value={params.poro.rho_matrix} onChange={e => handleParamChange('poro', 'rho_matrix', parseFloat(e.target.value))} />
                  </div>
                  <div>
                      <Label className="text-xs">Rho Fluid</Label>
                      <Input className="h-8 bg-slate-950 border-slate-700" type="number" value={params.poro.rho_fluid} onChange={e => handleParamChange('poro', 'rho_fluid', parseFloat(e.target.value))} />
                  </div>
              </div>
          )}
      </CollapsibleSection>

      <CollapsibleSection title="AI Clustering" icon={<BrainCircuit className="w-4 h-4"/>}>
          <div className="flex items-center space-x-2 mb-4">
              <Switch id="cluster-enable" checked={params.cluster.enabled} onCheckedChange={v => handleParamChange('cluster', 'enabled', v)} />
              <Label htmlFor="cluster-enable" className="text-sm cursor-pointer">Enable K-Means Clustering</Label>
          </div>
          {params.cluster.enabled && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center">
                      <Label className="text-xs">Clusters (K)</Label>
                      <Badge variant="secondary">{params.cluster.k}</Badge>
                  </div>
                  <Slider value={[params.cluster.k]} onValueChange={v => handleParamChange('cluster', 'k', v[0])} min={2} max={8} step={1} />
                  <p className="text-[10px] text-slate-500">Segments data into {params.cluster.k} electro-facies groups based on current plot axes.</p>
              </div>
          )}
      </CollapsibleSection>

      <div className="pt-4">
        <Button 
          onClick={onCompute} 
          disabled={loading || !canCompute} 
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-900/20"
        >
          {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> : <Play className="w-4 h-4 mr-2 fill-current" />}
          Update Plot
        </Button>
      </div>
    </div>
  );
};

export default InputPanel;