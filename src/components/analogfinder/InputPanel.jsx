import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Play, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatCoordinates, getExampleCoordinates } from '@/utils/coordinateUtils';
import InteractiveMap from '@/components/analogfinder/InteractiveMap';

const InputPanel = ({ 
  formData, 
  handleInputChange, 
  handleFileChange, 
  handleRunAnalogFinder, 
  loading 
}) => {
  const [showDMS, setShowDMS] = React.useState(false);
  const examples = getExampleCoordinates();

  const handleLocationSelect = (lat, lng) => {
    handleInputChange({ target: { name: 'latitude', value: lat } });
    handleInputChange({ target: { name: 'longitude', value: lng } });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
           Field Characteristics
        </h2>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fieldName" className="text-white font-medium">Field Name *</Label>
            <Input
              id="fieldName"
              name="fieldName"
              type="text"
              value={formData.fieldName}
              onChange={handleInputChange}
              className="bg-white/5 border-white/20 text-white placeholder:text-lime-300/50 focus:border-lime-400 transition-colors"
              placeholder="e.g., North Field Block A"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white flex items-center font-medium">
                <MapPin className="w-4 h-4 mr-2 text-lime-400" />
                Coordinates
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDMS(!showDMS)}
                className="text-xs h-7 px-2 text-lime-300 hover:text-lime-200 hover:bg-white/5"
              >
                {showDMS ? <ToggleRight className="w-3 h-3 mr-1" /> : <ToggleLeft className="w-3 h-3 mr-1" />}
                {showDMS ? 'DMS Mode' : 'Decimal Mode'}
              </Button>
            </div>

            <div className="mb-4 rounded-lg overflow-hidden border border-white/10 shadow-inner">
              <InteractiveMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={handleLocationSelect}
              />
              <p className="text-[10px] text-lime-300/80 mt-1 px-1">Click map to pin location</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="latitude" className="text-lime-300 text-xs">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.000001"
                  min="-90"
                  max="90"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white h-9 text-sm placeholder:text-lime-300/30"
                  placeholder={examples.latitude.decimal}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="longitude" className="text-lime-300 text-xs">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.000001"
                  min="-180"
                  max="180"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white h-9 text-sm placeholder:text-lime-300/30"
                  placeholder={examples.longitude.decimal}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSearchDistance" className="text-white font-medium">Search Radius</Label>
            <select
              id="maxSearchDistance"
              name="maxSearchDistance"
              value={formData.maxSearchDistance}
              onChange={handleInputChange}
              className="w-full h-10 px-3 py-2 bg-slate-900/50 border border-white/20 rounded-md text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm"
            >
              <option value="global">Global (No Limit)</option>
              <option value="500">500 km</option>
              <option value="1000">1,000 km</option>
              <option value="2000">2,000 km</option>
              <option value="5000">5,000 km</option>
            </select>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between">
                <Label htmlFor="netPayThickness" className="text-white font-medium">Net Pay (m) *</Label>
             </div>
            <Input
              id="netPayThickness"
              name="netPayThickness"
              type="number"
              step="0.1"
              value={formData.netPayThickness}
              onChange={handleInputChange}
              className="bg-white/5 border-white/20 text-white"
              placeholder="e.g., 18.5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="meanPorosity" className="text-white font-medium">Porosity (%) *</Label>
                <Input
                id="meanPorosity"
                name="meanPorosity"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formData.meanPorosity}
                onChange={handleInputChange}
                className="bg-white/5 border-white/20 text-white"
                placeholder="e.g., 15.2"
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="meanSaturation" className="text-white font-medium">Saturation (%) *</Label>
                <Input
                id="meanSaturation"
                name="meanSaturation"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.meanSaturation}
                onChange={handleInputChange}
                className="bg-white/5 border-white/20 text-white"
                placeholder="e.g., 72.0"
                required
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lithologyType" className="text-white font-medium">Lithology</Label>
            <select
              id="lithologyType"
              name="lithologyType"
              value={formData.lithologyType}
              onChange={handleInputChange}
              className="w-full h-10 px-3 py-2 bg-slate-900/50 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="sandstone">Sandstone</option>
              <option value="carbonate-limestone-dolomite">Carbonate (Limestone/Dolomite)</option>
              <option value="shale-mudstone">Shale (Mudstone)</option>
              <option value="mixed-clastic-carbonate">Mixed Clastic–Carbonate</option>
              <option value="carbonate-clastic-interbedded">Carbonate‐Clastic Interbedded</option>
              <option value="volcanic-igneous">Volcanic/Igneous</option>
              <option value="coal-bearing">Coal‐Bearing</option>
              <option value="evaporite-anhydrite-gypsum">Evaporite (Anhydrite/Gypsum)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="depositionalEnvironment" className="text-white font-medium">Environment</Label>
            <select
              id="depositionalEnvironment"
              name="depositionalEnvironment"
              value={formData.depositionalEnvironment}
              onChange={handleInputChange}
              className="w-full h-10 px-3 py-2 bg-slate-900/50 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="fluvial-channel-overbank">Fluvial (Channel/Overbank)</option>
              <option value="deltaic-prodelta-distributary">Deltaic (Prodelta/Distributary)</option>
              <option value="turbidite-deep-water-fans">Turbidite (Deep‐water Fans)</option>
              <option value="carbonate-platform-reef-buildup">Carbonate Platform (Reef/Buildup)</option>
              <option value="shallow-marine-shelf">Shallow Marine (Shelf)</option>
              <option value="deep-marine-basin-floor">Deep Marine (Basin Floor)</option>
              <option value="aeolian-dunes">Aeolian (Dunes)</option>
              <option value="lacustrine-lake">Lacustrine (Lake)</option>
              <option value="glacial-periglacial">Glacial/Periglacial</option>
            </select>
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="driveMethod" className="text-white font-medium">Drive Mechanism</Label>
            <select
              id="driveMethod"
              name="driveMethod"
              value={formData.driveMethod}
              onChange={handleInputChange}
              className="w-full h-10 px-3 py-2 bg-slate-900/50 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="water-drive">Water Drive</option>
              <option value="gas-cap-drive">Gas Cap Drive</option>
              <option value="solution-gas-drive">Solution‐Gas Drive</option>
              <option value="gravity-drainage">Gravity Drainage</option>
              <option value="gas-injection-eor">Gas Injection (EOR)</option>
              <option value="water-injection-eor">Water Injection (EOR)</option>
              <option value="depletion-volumetric-drive">Depletion (Volumetric) Drive</option>
              <option value="compaction-drive">Compaction Drive</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl flex-grow flex flex-col"
      >
        <h3 className="text-lg font-bold text-white mb-4">Data Enhancements</h3>
        
        <div className="space-y-3 mb-6">
          <div className="space-y-1">
            <Label className="text-white text-xs">Well Log CSV</Label>
            <div className="relative">
              <input
                id="wellLogFile"
                type="file"
                accept=".csv,.las"
                onChange={(e) => handleFileChange(e, 'wellLogFile')}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('wellLogFile').click()}
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-lime-300 hover:bg-white/5 justify-start"
              >
                <Upload className="w-3 h-3 mr-2" />
                <span className="truncate">{formData.wellLogFile ? formData.wellLogFile.name : 'Upload Logs'}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-auto">
            <Button
            onClick={handleRunAnalogFinder}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 shadow-lg shadow-green-900/20"
            >
            {loading ? (
                <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
                </div>
            ) : (
                <div className="flex items-center justify-center">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Find Analogs
                </div>
            )}
            </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default InputPanel;