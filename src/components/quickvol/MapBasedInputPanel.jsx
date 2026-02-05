import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Upload, Map, Layers, Maximize, Ruler } from 'lucide-react';
import LoadContourProjectModal from './LoadContourProjectModal';

const FileDropzone = ({ file, onFileChange, label, loading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt', '.dat', '.zmap', '.cps'],
      'application/octet-stream': ['.dat', '.zmap', '.cps'],
    },
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/30 hover:border-purple-400/80 hover:bg-white/5'
      } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-6 h-6 mx-auto text-purple-300 mb-2" />
      <p className="text-sm font-semibold text-white">{label}</p>
      {file ? (
         <p className="text-xs text-green-300 font-semibold truncate mt-1">Grid Loaded</p>
      ) : isDragActive ? (
        <p className="text-xs text-purple-200 mt-1">Drop the file here...</p>
      ) : (
        <p className="text-xs text-purple-200 mt-1">XYZ, ZMAP+, CPS-3, JSON</p>
      )}
    </div>
  );
};

const MapBasedInputPanel = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleRun,
  loading,
  onProjectLoad,
  unitSystem,
  setUnitSystem,
  phase,
  setPhase,
  mapInputMethod,
  setMapInputMethod,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const units = {
    depth: unitSystem === 'field' ? 'ft' : 'm',
    thickness: unitSystem === 'field' ? 'ft' : 'm',
    area: unitSystem === 'field' ? 'acres' : 'km²',
  };
  
  const fvf_oil_label = 'Boi (bbl/stb)';
  const fvf_gas_label = 'Bg (cf/scf)';

  const handleProjectSelect = (project) => {
    onProjectLoad(project);
  };

  const renderContactInputs = () => {
    if (mapInputMethod === 'area_thickness') return null;

    switch (phase) {
      case 'oil':
        return (
          <div className="space-y-2">
            <Label htmlFor="owc" className="text-white">Oil-Water Contact ({units.depth})</Label>
            <Input id="owc" name="owc" type="number" value={formData.owc} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" />
          </div>
        );
      case 'gas':
        return (
          <div className="space-y-2">
            <Label htmlFor="gwc" className="text-white">Gas-Water Contact ({units.depth})</Label>
            <Input id="gwc" name="gwc" type="number" value={formData.gwc} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" />
          </div>
        );
      case 'gas_oil':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="goc" className="text-white">Gas-Oil Contact ({units.depth})</Label>
              <Input id="goc" name="goc" type="number" value={formData.goc} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owc" className="text-white">Oil-Water Contact ({units.depth})</Label>
              <Input id="owc" name="owc" type="number" value={formData.owc} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const isRunEnabled = () => {
      if (loading) return false;
      if (mapInputMethod === 'top_base') return !!formData.top_grid && !!formData.base_grid;
      if (mapInputMethod === 'thickness_only') return !!formData.top_grid && !!formData.avg_thickness;
      if (mapInputMethod === 'area_thickness') return !!formData.area && !!formData.thickness;
      return false;
  };

  return (
    <>
      <LoadContourProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectSelect={handleProjectSelect}
      />
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Map className="w-6 h-6 mr-3 text-lime-300" /> Map-Based Volumetrics Pro
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-white font-semibold">Unit System</Label>
              <RadioGroup defaultValue="field" value={unitSystem} onValueChange={setUnitSystem} className="flex space-x-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="field" id="map-field" /><Label htmlFor="map-field" className="text-white">Field</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="metric" id="map-metric" /><Label htmlFor="map-metric" className="text-white">Metric</Label></div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-white font-semibold">Phase</Label>
              <RadioGroup defaultValue="oil" value={phase} onValueChange={setPhase} className="flex space-x-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="oil" id="map-oil" /><Label htmlFor="map-oil" className="text-white">Oil</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="gas" id="map-gas" /><Label htmlFor="map-gas" className="text-white">Gas</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="gas_oil" id="map-gas_oil" /><Label htmlFor="map-gas_oil" className="text-white">Gas & Oil</Label></div>
              </RadioGroup>
            </div>
          </div>

          <Tabs value={mapInputMethod} onValueChange={setMapInputMethod} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-900 border border-slate-800 rounded-lg gap-1">
              <TabsTrigger 
                value="top_base" 
                className="
                  flex-1 px-3 py-2 text-sm font-medium rounded-md
                  text-slate-400 hover:text-white hover:bg-slate-700
                  data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-bold
                  transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight
                "
              >
                <span>Top &</span>
                <span>Base Surfaces</span>
              </TabsTrigger>
              <TabsTrigger 
                value="thickness_only" 
                className="
                  flex-1 px-3 py-2 text-sm font-medium rounded-md
                  text-slate-400 hover:text-white hover:bg-slate-700
                  data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-bold
                  transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight
                "
              >
                <span>Top & Avg</span>
                <span>Thickness</span>
              </TabsTrigger>
              <TabsTrigger 
                value="area_thickness" 
                className="
                  flex-1 px-3 py-2 text-sm font-medium rounded-md
                  text-slate-400 hover:text-white hover:bg-slate-700
                  data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:font-bold
                  transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight
                "
              >
                <span>Area &</span>
                <span>Thickness</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="top_base" className="mt-4 space-y-4">
              <FileDropzone file={formData.top_grid} onFileChange={(file) => handleFileChange('top_grid', file)} label="Top Surface Grid" loading={loading} />
              <FileDropzone file={formData.base_grid} onFileChange={(file) => handleFileChange('base_grid', file)} label="Base Surface Grid" loading={loading} />
            </TabsContent>
            
            <TabsContent value="thickness_only" className="mt-4 space-y-4">
              <FileDropzone file={formData.top_grid} onFileChange={(file) => handleFileChange('top_grid', file)} label="Top Surface Grid" loading={loading} />
              <div className="space-y-2">
                <Label htmlFor="avg_thickness" className="text-white">Average Thickness ({units.thickness}) *</Label>
                <Input id="avg_thickness" name="avg_thickness" type="number" value={formData.avg_thickness} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required />
              </div>
            </TabsContent>

            <TabsContent value="area_thickness" className="mt-4 space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
                 <p className="text-sm text-blue-200 flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    Simple deterministic calculation without grid files.
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-white">Reservoir Area ({units.area}) *</Label>
                    <div className="relative">
                        <Maximize className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="area" name="area" type="number" value={formData.area || ''} onChange={handleInputChange} className="pl-9 bg-white/5 border-white/20 text-white" placeholder="e.g. 1000" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thickness" className="text-white">Net Thickness ({units.thickness}) *</Label>
                    <div className="relative">
                        <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="thickness" name="thickness" type="number" value={formData.thickness || ''} onChange={handleInputChange} className="pl-9 bg-white/5 border-white/20 text-white" placeholder="e.g. 50" required />
                    </div>
                  </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {mapInputMethod !== 'area_thickness' && (
            <Button variant="outline" className="w-full mb-6 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20" onClick={() => setIsModalOpen(true)}>
                <Layers className="w-4 h-4 mr-2" />
                Load Grid from Contour Digitizer
            </Button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="porosity_pct" className="text-white">Avg Porosity (%) *</Label>
                  <Input id="porosity_pct" name="porosity_pct" type="number" step="0.1" value={formData.porosity_pct} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="sw_pct" className="text-white">Avg Water Saturation (%) *</Label>
                  <Input id="sw_pct" name="sw_pct" type="number" step="0.1" value={formData.sw_pct} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="net_to_gross" className="text-white">Avg Net-to-Gross *</Label>
                  <Input id="net_to_gross" name="net_to_gross" type="number" step="0.01" value={formData.net_to_gross} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="recovery_pct" className="text-white">Recovery Factor (%) *</Label>
                  <Input id="recovery_pct" name="recovery_pct" type="number" step="0.1" value={formData.recovery_pct} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required placeholder="e.g. 30" />
              </div>
               {(phase === 'oil' || phase === 'gas_oil') &&
                 <div className="space-y-2">
                    <Label htmlFor="fv_factor" className="text-white">Oil FVF ({fvf_oil_label}) *</Label>
                    <Input id="fv_factor" name="fv_factor" type="number" step="0.01" value={formData.fv_factor} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required />
                </div>
               }
               {(phase === 'gas' || phase === 'gas_oil') &&
                 <div className="space-y-2">
                    <Label htmlFor="fv_factor_gas" className="text-white">Gas FVF ({fvf_gas_label}) *</Label>
                    <Input id="fv_factor_gas" name="fv_factor_gas" type="number" step="0.0001" value={formData.fv_factor_gas} onChange={handleInputChange} className="bg-white/5 border-white/20 text-white" required />
                </div>
               }
              {renderContactInputs()}
          </div>

          <Button
            onClick={() => handleRun(unitSystem, mapInputMethod, phase)}
            disabled={!isRunEnabled()}
            className={`w-full mt-6 font-semibold py-3 ${
                isRunEnabled() 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calculating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                {mapInputMethod === 'area_thickness' ? 'Calculate Simple Volume Pro' : 'Calculate Volume from Maps Pro'}
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default MapBasedInputPanel;