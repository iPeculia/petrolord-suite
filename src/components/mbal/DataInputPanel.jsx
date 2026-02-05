import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Settings, Zap, Beaker, CheckSquare, Wind, Waves, Thermometer, Download, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { saveAs } from 'file-saver';

const DataInputPanel = ({ onFileUpload, onAnalyze, loading, initialSettings, uploadedData, onSampleLoad, sampleProdData, samplePvtData }) => {
  const [settings, setSettings] = useState(initialSettings);

  const onDrop = useCallback((type) => (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0], type);
    }
  }, [onFileUpload]);

  const { getRootProps: getProdRootProps, getInputProps: getProdInputProps, isDragActive: isProdDragActive } = useDropzone({ onDrop: onDrop('production'), accept: { 'text/csv': ['.csv'] }, multiple: false });
  const { getRootProps: getPvtRootProps, getInputProps: getPvtInputProps, isDragActive: isPvtDragActive } = useDropzone({ onDrop: onDrop('pvt'), accept: { 'text/csv': ['.csv'] }, multiple: false });

  const handleSettingsChange = (e) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleDriveMechanismChange = (name, checked) => {
    setSettings(prev => ({
      ...prev,
      driveMechanisms: { ...prev.driveMechanisms, [name]: checked },
    }));
  };

  const handleAnalyzeClick = () => { onAnalyze(settings); };

  const handleDownloadSample = (type) => {
    const content = type === 'production' ? sampleProdData : samplePvtData;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `sample_${type}_data.csv`);
  };

  const Dropzone = ({ rootProps, inputProps, isDragActive, title, fileName }) => (
    <div {...rootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-orange-400 bg-orange-500/10' : 'border-white/30 hover:border-orange-400/80 hover:bg-white/5'}`}>
      <input {...inputProps()} />
      <Upload className="w-6 h-6 mx-auto text-orange-300 mb-2" />
      <p className="text-orange-200 text-sm">{isDragActive ? 'Drop file here...' : title}</p>
      {fileName && <p className="text-xs text-green-400 text-center mt-1">Loaded: {fileName}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Input id="projectName" name="projectName" value={settings.projectName} onChange={handleSettingsChange} className="bg-white/5 border-white/20 text-white font-bold text-lg p-3 mb-4" />
      </motion.div>
      <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full space-y-2">
        <AccordionItem value="item-1" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4">
          <AccordionTrigger className="text-lg font-bold text-lime-300">
            <div className="flex items-center"><Database className="w-5 h-5 mr-3" /> Data Input</div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Dropzone rootProps={getProdRootProps} inputProps={getProdInputProps} isDragActive={isProdDragActive} title="Upload Production History" fileName={uploadedData?.production?.fileName} />
            <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => onSampleLoad('production', sampleProdData)}>Load Sample</Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownloadSample('production')}><Download className="w-4 h-4 mr-2"/>Download Sample</Button>
            </div>
            <Dropzone rootProps={getPvtRootProps} inputProps={getPvtInputProps} isDragActive={isPvtDragActive} title="Upload PVT Data" fileName={uploadedData?.pvt?.fileName} />
             <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => onSampleLoad('pvt', samplePvtData)}>Load Sample</Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownloadSample('pvt')}><Download className="w-4 h-4 mr-2"/>Download Sample</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4">
          <AccordionTrigger className="text-lg font-bold text-lime-300">
            <div className="flex items-center"><Beaker className="w-5 h-5 mr-3" /> Reservoir & Fluid</div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label htmlFor="initialPressure" className="text-sm">Pi (psi)</Label><Input id="initialPressure" name="initialPressure" type="number" value={settings.initialPressure} onChange={handleSettingsChange} className="bg-white/5 border-white/20 text-white" /></div>
              <div className="space-y-1"><Label htmlFor="reservoirTemp" className="text-sm">Temp (°F)</Label><Input id="reservoirTemp" name="reservoirTemp" type="number" value={settings.reservoirTemp} onChange={handleSettingsChange} className="bg-white/5 border-white/20 text-white" /></div>
              <div className="space-y-1"><Label htmlFor="formationCompressibility" className="text-sm">Cf (1/psi)</Label><Input id="formationCompressibility" name="formationCompressibility" type="number" value={settings.formationCompressibility} onChange={handleSettingsChange} className="bg-white/5 border-white/20 text-white" /></div>
              <div className="space-y-1"><Label htmlFor="swi" className="text-sm">Swi (fraction)</Label><Input id="swi" name="swi" type="number" value={settings.swi} onChange={handleSettingsChange} className="bg-white/5 border-white/20 text-white" /></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4">
          <AccordionTrigger className="text-lg font-bold text-lime-300">
            <div className="flex items-center"><Settings className="w-5 h-5 mr-3" /> Model & Analysis</div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <Label className="text-gray-300 mb-2 block flex items-center"><CheckSquare className="w-4 h-4 mr-2" />Drive Mechanisms</Label>
              <div className="space-y-3">
                <label className="flex items-center justify-between text-white cursor-pointer"><span className="flex items-center"><Wind className="w-4 h-4 mr-2" />Solution Gas</span><Switch name="solutionGas" checked={settings.driveMechanisms.solutionGas} onCheckedChange={(c) => handleDriveMechanismChange('solutionGas', c)} /></label>
                <label className="flex items-center justify-between text-white cursor-pointer"><span className="flex items-center"><Thermometer className="w-4 h-4 mr-2" />Gas Cap</span><Switch name="gasCap" checked={settings.driveMechanisms.gasCap} onCheckedChange={(c) => handleDriveMechanismChange('gasCap', c)} /></label>
                <label className="flex items-center justify-between text-white cursor-pointer"><span className="flex items-center"><Waves className="w-4 h-4 mr-2" />Water Influx</span><Switch name="waterInflux" checked={settings.driveMechanisms.waterInflux} onCheckedChange={(c) => handleDriveMechanismChange('waterInflux', c)} /></label>
              </div>
            </div>
            {settings.driveMechanisms.gasCap && <div className="space-y-1"><Label htmlFor="gasCapRatio" className="text-sm">Gas Cap Ratio (m)</Label><Input id="gasCapRatio" name="gasCapRatio" type="number" value={settings.gasCapRatio} onChange={handleSettingsChange} className="bg-white/5 border-white/20 text-white" /></div>}
            {settings.driveMechanisms.waterInflux && <div className="space-y-1"><Label htmlFor="waterInfluxModel" className="text-sm">Water Influx Model</Label><Select name="waterInfluxModel" value={settings.waterInfluxModel} onValueChange={(v) => setSettings(p => ({...p, waterInfluxModel: v}))}><SelectTrigger className="w-full bg-white/5 border-white/20 text-white"><SelectValue placeholder="Select a model" /></SelectTrigger><SelectContent><SelectItem value="schilthuis">Schilthuis (Steady-State)</SelectItem><SelectItem value="fetkovich">Fetkovich</SelectItem></SelectContent></Select></div>}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
        <Button onClick={handleAnalyzeClick} disabled={loading || !uploadedData.production || !uploadedData.pvt} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 mt-4">
          {loading ? <div className="flex items-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Analyzing...</div> : <div className="flex items-center justify-center"><Zap className="w-5 h-5 mr-2" />Analyze</div>}
        </Button>
      </motion.div>
    </div>
  );
};

export default DataInputPanel;