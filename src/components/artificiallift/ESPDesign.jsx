import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts';
    import CollapsibleSection from '@/components/nodalanalysis/CollapsibleSection';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { calculateEspDesign, getPumpData } from '@/utils/espCalculations';
    import { Settings, Droplet, Thermometer, Zap, BarChart2, TrendingUp, Cpu } from 'lucide-react';

    const initialInputs = {
      targetRate: 2500,
      wellDepth: 7500,
      pumpDepth: 7000,
      whp: 150,
      waterCut: 50,
      gor: 500,
      oilApi: 32,
      gasGravity: 0.75,
      tubingID: 3.958,
      casingID: 6.366,
      frequency: 60,
      pumpModel: 'REDADN2600',
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-lime-400/50 rounded-md shadow-lg">
                    <p className="label text-lime-300">{`Rate: ${label.toFixed(0)} bbl/d`}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }} className="text-white">
                            {`${p.name}: ${p.value.toFixed(1)} ${p.unit || ''}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };


    const ESPDesign = () => {
        const [inputs, setInputs] = useState(initialInputs);
        const [results, setResults] = useState(null);
        const pumpData = getPumpData();

        useEffect(() => {
            const designResults = calculateEspDesign(inputs);
            setResults(designResults);
        }, [inputs]);

        const handleInputChange = (key, value) => {
            setInputs(prev => ({ ...prev, [key]: value }));
        };
        
        const handleFloatInputChange = (key, value) => {
            setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
        };

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-slate-800/50 p-4 rounded-lg"
                >
                    <h2 className="text-xl font-bold text-white mb-4">ESP Design Inputs</h2>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <CollapsibleSection title="Well & Production" icon={<Settings />} defaultOpen>
                            <div className="grid grid-cols-2 gap-2 p-1">
                                <div><Label>Target Rate (bbl/d)</Label><Input type="number" value={inputs.targetRate} onChange={e => handleFloatInputChange('targetRate', e.target.value)} /></div>
                                <div><Label>Pump Depth (ft)</Label><Input type="number" value={inputs.pumpDepth} onChange={e => handleFloatInputChange('pumpDepth', e.target.value)} /></div>
                                <div><Label>WHP (psi)</Label><Input type="number" value={inputs.whp} onChange={e => handleFloatInputChange('whp', e.target.value)} /></div>
                                <div><Label>Casing ID (in)</Label><Input type="number" value={inputs.casingID} onChange={e => handleFloatInputChange('casingID', e.target.value)} /></div>
                            </div>
                        </CollapsibleSection>
                        <CollapsibleSection title="Fluid Properties" icon={<Droplet />}>
                           <div className="grid grid-cols-2 gap-2 p-1">
                                <div><Label>Water Cut (%)</Label><Input type="number" value={inputs.waterCut} onChange={e => handleFloatInputChange('waterCut', e.target.value)} /></div>
                                <div><Label>GOR (scf/bbl)</Label><Input type="number" value={inputs.gor} onChange={e => handleFloatInputChange('gor', e.target.value)} /></div>
                                <div><Label>Oil API</Label><Input type="number" value={inputs.oilApi} onChange={e => handleFloatInputChange('oilApi', e.target.value)} /></div>
                                <div><Label>Gas Gravity</Label><Input type="number" value={inputs.gasGravity} onChange={e => handleFloatInputChange('gasGravity', e.target.value)} /></div>
                           </div>
                        </CollapsibleSection>
                         <CollapsibleSection title="Equipment Selection" icon={<Zap />}>
                           <div className="space-y-2 p-1">
                                <div>
                                  <Label>Pump Model</Label>
                                  <Select value={inputs.pumpModel} onValueChange={value => handleInputChange('pumpModel', value)}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                          {Object.keys(pumpData).map(model => (
                                              <SelectItem key={model} value={model}>{model}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                </div>
                                <div><Label>Frequency (Hz)</Label><Input type="number" value={inputs.frequency} onChange={e => handleFloatInputChange('frequency', e.target.value)} /></div>
                           </div>
                        </CollapsibleSection>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {results && (
                        <>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-lime-400" /> Key Design Results</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-sm text-slate-300">Total Dynamic Head</p>
                                        <p className="text-2xl font-bold text-white">{results.tdh.toFixed(0)} <span className="text-base font-normal text-slate-400">ft</span></p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-sm text-slate-300">Required Stages</p>
                                        <p className="text-2xl font-bold text-white">{results.requiredStages}</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-sm text-slate-300">Motor Power</p>
                                        <p className="text-2xl font-bold text-white">{results.motorHP.toFixed(1)} <span className="text-base font-normal text-slate-400">HP</span></p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-sm text-slate-300">Pump Efficiency</p>
                                        <p className="text-2xl font-bold text-white">{results.pumpEfficiency.toFixed(1)} <span className="text-base font-normal text-slate-400">%</span></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center"><BarChart2 className="w-6 h-6 mr-2 text-lime-400" />Pump Performance Curve</h3>
                                 <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={results.performanceCurve} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                        <XAxis dataKey="rate" stroke="#a3e635" type="number" domain={['dataMin', 'dataMax']} label={{ value: 'Rate (bbl/d)', position: 'insideBottom', offset: -5, fill: '#a3e635' }}/>
                                        <YAxis yAxisId="left" stroke="#38bdf8" label={{ value: 'Head (ft)', angle: -90, position: 'insideLeft', fill: '#38bdf8' }}/>
                                        <YAxis yAxisId="right" orientation="right" stroke="#facc15" label={{ value: 'Efficiency / Power', angle: 90, position: 'insideRight', fill: '#facc15' }}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="head" name="Head" unit="ft" stroke="#38bdf8" dot={false} strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency" unit="%" stroke="#10b981" dot={false} strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="power" name="Power" unit="HP" stroke="#f43f5e" dot={false} strokeWidth={2} />
                                        <ReferenceLine yAxisId="left" x={inputs.targetRate} stroke="red" strokeDasharray="4 4" label={{ value: `Target Rate`, fill: 'red', position: 'insideTop' }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        );
    };

    export default ESPDesign;