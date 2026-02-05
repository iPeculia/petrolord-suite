import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Waves, Droplets, Wind, TrendingUp, Gauge, CheckCircle } from 'lucide-react';
import { calculateMultiphaseHydraulics } from '@/utils/facilityNetworkHydraulicsCalculations';

const MultiphaseHydraulics = () => {
  const [inputs, setInputs] = useState({
    oilRate: 5000,
    waterCut: 0.2,
    gor: 800,
    pipeID: 6.0,
    angle: 0,
    pressure: 1000,
    temperature: 150,
    oilDensity: 50,
    waterDensity: 62.4,
    gasDensity: 0.5,
    oilViscosity: 1.5,
    waterViscosity: 0.8,
    gasViscosity: 0.015,
    surfaceTension: 30,
    pipeRoughness: 0.0006,
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const calculatedResults = calculateMultiphaseHydraulics(inputs);
    setResults(calculatedResults);
  };

  const ResultCard = ({ icon: Icon, title, value, unit, colorClass = 'text-indigo-300' }) => (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        <p className="text-xs text-slate-400">{unit}</p>
      </CardContent>
    </Card>
  );

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
              <Waves className="mr-3 text-indigo-400" />
              Multiphase Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500 rounded-lg text-center">
              <p className="text-slate-300 text-lg">Predicted Flow Regime</p>
              <p className="text-4xl font-bold text-white my-2">{results.flowRegime}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard icon={Droplets} title="Liquid Holdup" value={results.liquidHoldup.toFixed(3)} unit="fraction" colorClass="text-blue-400" />
              <ResultCard icon={TrendingUp} title="Pressure Gradient" value={results.totalGradient.toFixed(4)} unit="psi/ft" colorClass="text-orange-400" />
              <ResultCard icon={Gauge} title="Mixture Velocity" value={results.mixtureVelocity.toFixed(2)} unit="ft/s" colorClass="text-green-400"/>
              <ResultCard icon={Wind} title="Froude Number" value={results.froudeNumber.toFixed(2)} unit="dimensionless" colorClass="text-yellow-400"/>
            </div>
            <div className="text-center pt-4">
                <p className="text-green-400 flex items-center justify-center"><CheckCircle className="mr-2" /> Calculation successful.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [results]);

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
              <Waves className="mr-3 text-indigo-400" />
              Flow Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oilRate" className="text-white">Oil Rate (BOPD)</Label>
                <Input id="oilRate" name="oilRate" type="number" value={inputs.oilRate} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
              <div>
                <Label htmlFor="waterCut" className="text-white">Water Cut (frac)</Label>
                <Input id="waterCut" name="waterCut" type="number" value={inputs.waterCut} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gor" className="text-white">GOR (scf/STB)</Label>
                  <Input id="gor" name="gor" type="number" value={inputs.gor} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
                </div>
                <div>
                  <Label htmlFor="pipeID" className="text-white">Pipe ID (in)</Label>
                  <Input id="pipeID" name="pipeID" type="number" value={inputs.pipeID} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="pressure" className="text-white">Pressure (psia)</Label>
                    <Input id="pressure" name="pressure" type="number" value={inputs.pressure} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
                </div>
                <div>
                    <Label htmlFor="temperature" className="text-white">Temp (°F)</Label>
                    <Input id="temperature" name="temperature" type="number" value={inputs.temperature} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="angle" className="text-white">Inclination (°)</Label>
                    <Input id="angle" name="angle" type="number" value={inputs.angle} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
                </div>
            </div>
            <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-lg mt-4">Calculate</Button>
          </CardContent>
        </Card>
      </motion.div>
      {memoizedResults}
    </div>
  );
};

export default MultiphaseHydraulics;