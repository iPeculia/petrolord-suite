import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Slider } from '@/components/ui/slider';
    import CollapsibleSection from './CollapsibleSection';
    import { Settings, Database, Droplet, GitBranch, Layers, Zap, Activity, Clock, AlertTriangle } from 'lucide-react';

    const InputPanel = ({ onAnalyze, loading, initialInputs }) => {
      const [inputs, setInputs] = useState({
        projectName: "Central Field Analysis",
        wellName: "Well-12",
        
        tubingID: 3.5,
        casingID: 7,
        tubingLength: 8000,
        wellDeviation: 15,
        perforationInterval: 200,
        hasGravelPack: false,

        flowlineID: 4,
        flowlineLength: 5000,
        separatorPressure: 200,
        chokeSize: 60,

        liftMethod: "None",
        gasLiftInjectionRate: 0,
        espPumpDepth: 5000,
        espPressureBoost: 0,

        reservoirPressure: 3000,
        reservoirTemperature: 180,
        driveMechanism: "Water Drive",

        iprModel: "Darcy",
        
        permeability: 50,
        reservoirThickness: 100,
        drainageRadius: 1000,
        wellboreRadius: 0.328,
        skin: 5,

        bubblePoint: 2500,
        testRate: 2000,
        testPwf: 2800,

        oilApi: 35,
        gasGravity: 0.7,
        waterSalinity: 50000,
        gasOilRatio: 800,
        waterCut: 10,
        oilViscosity: 1.2,
        oilFvf: 1.25,

        actualRate: 0,
        actualPwf: 0,

        forecastDuration: 10,
        pressureDeclineRate: 50,
      });

      const [warnings, setWarnings] = useState([]);

      useEffect(() => {
        if(initialInputs) {
            setInputs(initialInputs);
        }
      }, [initialInputs]);

      useEffect(() => {
        const newWarnings = [];
        if (inputs.actualPwf > 0 && inputs.actualPwf >= inputs.reservoirPressure) {
          newWarnings.push("Actual Flowing BHP should be less than Reservoir Pressure.");
        }
        if (inputs.iprModel === 'Vogel' && inputs.testPwf >= inputs.reservoirPressure) {
          newWarnings.push("Test Flowing Pressure should be less than Reservoir Pressure for Vogel IPR.");
        }
        if (inputs.separatorPressure >= inputs.reservoirPressure) {
          newWarnings.push("Separator Pressure seems too high compared to Reservoir Pressure.");
        }
        setWarnings(newWarnings);
      }, [inputs]);


      const handleInputChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
      };

      const handleSliderChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value[0] }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onAnalyze(inputs);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
          <div className="flex-grow space-y-4 overflow-y-auto pr-2">
            <h2 className="text-2xl font-bold text-white mb-4">Nodal Analysis Setup</h2>

            <CollapsibleSection title="Forecasting & Depletion" icon={<Clock />}>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-lime-300">Duration (years)</Label><Input type="number" value={inputs.forecastDuration} onChange={(e) => handleInputChange('forecastDuration', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">P Decline (psi/yr)</Label><Input type="number" value={inputs.pressureDeclineRate} onChange={(e) => handleInputChange('pressureDeclineRate', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
              </div>
               <p className="text-xs text-white/50 mt-2">Set depletion parameters to enable the Production Forecast module.</p>
            </CollapsibleSection>

            <CollapsibleSection title="Actual Well Performance" icon={<Activity />}>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-lime-300">Actual Rate (STB/d)</Label><Input type="number" value={inputs.actualRate} onChange={(e) => handleInputChange('actualRate', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Actual Flowing BHP (psi)</Label><Input type="number" value={inputs.actualPwf} onChange={(e) => handleInputChange('actualPwf', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
              </div>
               <p className="text-xs text-white/50 mt-2">Enter current well test data to enable the Problem Diagnosis module.</p>
            </CollapsibleSection>

            <CollapsibleSection title="Wellbore & Completion" icon={<Settings />} defaultOpen>
              <div className="space-y-4">
                <div><Label className="text-lime-300">Project Name</Label><Input value={inputs.projectName} onChange={(e) => handleInputChange('projectName', e.target.value)} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Well Name</Label><Input value={inputs.wellName} onChange={(e) => handleInputChange('wellName', e.target.value)} className="bg-white/5 border-white/20" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-lime-300">Tubing ID (in)</Label><Input type="number" value={inputs.tubingID} onChange={(e) => handleInputChange('tubingID', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                  <div><Label className="text-lime-300">Casing ID (in)</Label><Input type="number" value={inputs.casingID} onChange={(e) => handleInputChange('casingID', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                  <div><Label className="text-lime-300">MD (ft)</Label><Input type="number" value={inputs.tubingLength} onChange={(e) => handleInputChange('tubingLength', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                  <div><Label className="text-lime-300">Avg. Deviation (°)</Label><Input type="number" value={inputs.wellDeviation} onChange={(e) => handleInputChange('wellDeviation', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                  <div className="col-span-2"><Label className="text-lime-300">Perf. Interval (ft)</Label><Input type="number" value={inputs.perforationInterval} onChange={(e) => handleInputChange('perforationInterval', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Label className="text-lime-300">Gravel Pack Completion</Label>
                  <Switch checked={inputs.hasGravelPack} onCheckedChange={(checked) => handleInputChange('hasGravelPack', checked)} />
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Surface & Artificial Lift" icon={<Zap />}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label className="text-lime-300">Flowline ID (in)</Label><Input type="number" value={inputs.flowlineID} onChange={(e) => handleInputChange('flowlineID', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                        <div><Label className="text-lime-300">Flowline Len (ft)</Label><Input type="number" value={inputs.flowlineLength} onChange={(e) => handleInputChange('flowlineLength', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                        <div className="col-span-2"><Label className="text-lime-300">Separator P (psi)</Label><Input type="number" value={inputs.separatorPressure} onChange={(e) => handleInputChange('separatorPressure', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label className="text-lime-300">Choke Size (%)</Label>
                           <span className="text-white font-semibold">{inputs.chokeSize}%</span>
                        </div>
                        <Slider value={[inputs.chokeSize]} max={100} step={1} onValueChange={(val) => handleSliderChange('chokeSize', val)} />
                    </div>
                    <div>
                        <Label className="text-lime-300">Artificial Lift Method</Label>
                        <select value={inputs.liftMethod} onChange={(e) => handleInputChange('liftMethod', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                            <option>None</option><option>Gas Lift</option><option>ESP</option>
                        </select>
                    </div>
                    {inputs.liftMethod === 'Gas Lift' && (
                        <div className="p-3 bg-black/20 rounded-md">
                            <Label className="text-lime-300">Injection Rate (Mscf/d)</Label>
                            <Input type="number" value={inputs.gasLiftInjectionRate} onChange={(e) => handleInputChange('gasLiftInjectionRate', Number(e.target.value))} className="bg-white/5 border-white/20" />
                        </div>
                    )}
                    {inputs.liftMethod === 'ESP' && (
                        <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-md">
                            <div><Label className="text-lime-300">Pump Depth (ft)</Label><Input type="number" value={inputs.espPumpDepth} onChange={(e) => handleInputChange('espPumpDepth', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                            <div><Label className="text-lime-300">Pressure Boost (psi)</Label><Input type="number" value={inputs.espPressureBoost} onChange={(e) => handleInputChange('espPressureBoost', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Reservoir Properties" icon={<Database />}>
              <div className="space-y-4">
                <div><Label className="text-lime-300">Reservoir Pressure (psi)</Label><Input type="number" value={inputs.reservoirPressure} onChange={(e) => handleInputChange('reservoirPressure', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Reservoir Temperature (°F)</Label><Input type="number" value={inputs.reservoirTemperature} onChange={(e) => handleInputChange('reservoirTemperature', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div>
                    <Label className="text-lime-300">Drive Mechanism</Label>
                    <select value={inputs.driveMechanism} onChange={(e) => handleInputChange('driveMechanism', e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-md p-2 text-white">
                        <option>Water Drive</option><option>Gas Cap Drive</option><option>Solution Gas Drive</option><option>Compaction Drive</option>
                    </select>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Fluid Properties" icon={<Droplet />}>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-lime-300">Oil API</Label><Input type="number" value={inputs.oilApi} onChange={(e) => handleInputChange('oilApi', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Gas Gravity</Label><Input type="number" value={inputs.gasGravity} onChange={(e) => handleInputChange('gasGravity', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Water Salinity (ppm)</Label><Input type="number" value={inputs.waterSalinity} onChange={(e) => handleInputChange('waterSalinity', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">GOR (scf/STB)</Label><Input type="number" value={inputs.gasOilRatio} onChange={(e) => handleInputChange('gasOilRatio', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Water Cut (%)</Label><Input type="number" value={inputs.waterCut} onChange={(e) => handleInputChange('waterCut', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Oil Viscosity (cP)</Label><Input type="number" value={inputs.oilViscosity} onChange={(e) => handleInputChange('oilViscosity', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                <div><Label className="text-lime-300">Oil FVF (bbl/STB)</Label><Input type="number" value={inputs.oilFvf} onChange={(e) => handleInputChange('oilFvf', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Inflow Performance (IPR)" icon={<Layers />}>
              <div className="space-y-4">
                <div>
                    <Label className="text-lime-300">IPR Model</Label>
                    <div className="flex space-x-2 mt-1">
                        {["Darcy", "Vogel", "Fetkovich"].map(type => (
                            <Button key={type} type="button" size="sm" variant={inputs.iprModel === type ? 'default' : 'outline'} onClick={() => handleInputChange('iprModel', type)} className={`flex-1 ${inputs.iprModel === type ? 'bg-lime-600' : ''}`}>{type}</Button>
                        ))}
                    </div>
                </div>
                {inputs.iprModel === 'Darcy' && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-md">
                    <div><Label className="text-lime-300">Permeability (mD)</Label><Input type="number" value={inputs.permeability} onChange={(e) => handleInputChange('permeability', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    <div><Label className="text-lime-300">Thickness (ft)</Label><Input type="number" value={inputs.reservoirThickness} onChange={(e) => handleInputChange('reservoirThickness', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    <div><Label className="text-lime-300">Drainage Radius (ft)</Label><Input type="number" value={inputs.drainageRadius} onChange={(e) => handleInputChange('drainageRadius', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    <div><Label className="text-lime-300">Wellbore Radius (ft)</Label><Input type="number" value={inputs.wellboreRadius} onChange={(e) => handleInputChange('wellboreRadius', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    <div className="col-span-2"><Label className="text-lime-300">Skin Factor</Label><Input type="number" value={inputs.skin} onChange={(e) => handleInputChange('skin', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                  </div>
                )}
                {inputs.iprModel === 'Vogel' && (
                  <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-md">
                    <div><Label className="text-lime-300">Bubble Point (psi)</Label><Input type="number" value={inputs.bubblePoint} onChange={(e) => handleInputChange('bubblePoint', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    <div><Label className="text-lime-300">Test Rate (STB/d)</Label><Input type="number" value={inputs.testRate} onChange={(e) => handleInputChange('testRate', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                    <div className="col-span-2"><Label className="text-lime-300">Test Flowing P (psi)</Label><Input type="number" value={inputs.testPwf} onChange={(e) => handleInputChange('testPwf', Number(e.target.value))} className="bg-white/5 border-white/20" /></div>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </div>

          <div className="pt-4">
            {warnings.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-300">Input Warning</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-200">
                      {warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 text-lg">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <GitBranch className="w-5 h-5 mr-2" />}
                Run Analysis
              </Button>
            </motion.div>
          </div>
        </form>
      );
    };

    export default InputPanel;