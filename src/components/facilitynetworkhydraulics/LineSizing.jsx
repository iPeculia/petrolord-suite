import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Droplets, Thermometer, TrendingUp, Gauge, AlertCircle, CheckCircle } from 'lucide-react';
import { calculateLineSizing } from '@/utils/facilityNetworkHydraulicsCalculations';

const LineSizing = () => {
  const [inputs, setInputs] = useState({
    flowRate: 10000,
    pressure: 1000,
    temperature: 150,
    liquidDensity: 50,
    gasDensity: 0.5,
    liquidViscosity: 1,
    gasViscosity: 0.015,
    pipeLength: 5000,
    allowablePressureDrop: 100,
    minVelocity: 3,
    maxVelocity: 15,
    pipeRoughness: 0.0006,
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const calculatedResults = calculateLineSizing(inputs);
    setResults(calculatedResults);
  };

  const ResultCard = ({ icon: Icon, title, value, unit, status }) => {
    const getStatusColor = () => {
      if (status === 'pass') return 'text-green-400';
      if (status === 'fail') return 'text-red-400';
      return 'text-indigo-300';
    };
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${getStatusColor()}`} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{value}</div>
          <p className="text-xs text-slate-400">{unit}</p>
        </CardContent>
      </Card>
    );
  };

  const memoizedResults = useMemo(() => {
    if (!results) return null;
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full lg:w-2/3 pl-0 lg:pl-8 mt-8 lg:mt-0"
      >
        <Card className="bg-slate-900/70 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <SlidersHorizontal className="mr-3 text-indigo-400" />
              Sizing Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500 rounded-lg text-center">
              <p className="text-slate-300 text-lg">Recommended Pipe OD</p>
              <p className="text-5xl font-bold text-white my-2">{results.recommendedOD.toFixed(2)}</p>
              <p className="text-slate-300 text-lg">inches</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard icon={TrendingUp} title="Pressure Drop" value={results.pressureDrop.toFixed(2)} unit="psi" status={results.pressureDrop > inputs.allowablePressureDrop ? 'fail' : 'pass'} />
              <ResultCard icon={Gauge} title="Fluid Velocity" value={results.velocity.toFixed(2)} unit="ft/s" status={results.velocity < inputs.minVelocity || results.velocity > inputs.maxVelocity ? 'fail' : 'pass'} />
            </div>
            <div className="text-center pt-4">
              {results.pressureDrop > inputs.allowablePressureDrop ? (
                <p className="text-red-400 flex items-center justify-center"><AlertCircle className="mr-2" /> Pressure drop exceeds allowable limit.</p>
              ) : (
                <p className="text-green-400 flex items-center justify-center"><CheckCircle className="mr-2" /> Pressure drop is within limits.</p>
              )}
              {results.velocity < inputs.minVelocity || results.velocity > inputs.maxVelocity ? (
                <p className="text-red-400 flex items-center justify-center mt-2"><AlertCircle className="mr-2" /> Velocity is outside the operational window.</p>
              ) : (
                <p className="text-green-400 flex items-center justify-center mt-2"><CheckCircle className="mr-2" /> Velocity is within limits.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [results, inputs]);

  return (
    <div className="flex flex-col lg:flex-row mt-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/3"
      >
        <Card className="bg-slate-900/70 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <SlidersHorizontal className="mr-3 text-indigo-400" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flowRate" className="text-white flex items-center mb-2"><TrendingUp className="w-4 h-4 mr-2" />Flow Rate (BPD)</Label>
                <Input id="flowRate" name="flowRate" type="number" value={inputs.flowRate} onChange={handleInputChange} className="bg-slate-800 border-slate-600 text-white" />
              </div>
              <div>
                <Label htmlFor="pressure" className="text-white flex items-center mb-2"><Gauge className="w-4 h-4 mr-2" />Pressure (psi)</Label>
                <Input id="pressure" name="pressure" type="number" value={inputs.pressure} onChange={handleInputChange} className="bg-slate-800 border-slate-600 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liquidDensity" className="text-white flex items-center mb-2"><Droplets className="w-4 h-4 mr-2" />Liquid Density (lb/ft³)</Label>
                  <Input id="liquidDensity" name="liquidDensity" type="number" value={inputs.liquidDensity} onChange={handleInputChange} className="bg-slate-800 border-slate-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="pipeLength" className="text-white flex items-center mb-2"><TrendingUp className="w-4 h-4 mr-2" />Pipe Length (ft)</Label>
                  <Input id="pipeLength" name="pipeLength" type="number" value={inputs.pipeLength} onChange={handleInputChange} className="bg-slate-800 border-slate-600 text-white" />
                </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Velocity Limits (ft/s)</Label>
              <div className="flex items-center space-x-2">
                <Input name="minVelocity" type="number" value={inputs.minVelocity} onChange={handleInputChange} placeholder="Min" className="bg-slate-800 border-slate-600 text-white" />
                <Input name="maxVelocity" type="number" value={inputs.maxVelocity} onChange={handleInputChange} placeholder="Max" className="bg-slate-800 border-slate-600 text-white" />
              </div>
            </div>
            <div>
              <Label htmlFor="allowablePressureDrop" className="text-white flex items-center mb-2"><TrendingUp className="w-4 h-4 mr-2" />Allowable ΔP (psi)</Label>
              <Input id="allowablePressureDrop" name="allowablePressureDrop" type="number" value={inputs.allowablePressureDrop} onChange={handleInputChange} className="bg-slate-800 border-slate-600 text-white" />
            </div>
            <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-lg">Calculate</Button>
          </CardContent>
        </Card>
      </motion.div>
      {memoizedResults}
    </div>
  );
};

export default LineSizing;