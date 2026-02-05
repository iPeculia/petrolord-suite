import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Replace, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { calculatePiggingAnalysis } from '@/utils/facilityNetworkHydraulicsCalculations';

const PiggingAnalysis = () => {
  const [inputs, setInputs] = useState({
    pipeOD: 12.75,
    bendRadius: 60,
    pigVelocity: 10,
    bendMultiplier: 5,
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleCalculate = () => {
    const calculatedResults = calculatePiggingAnalysis(inputs);
    setResults(calculatedResults);
  };

  const ResultCard = ({ icon: Icon, title, value, unit, colorClass, children }) => (
    <Card className="bg-slate-800/50 border-slate-700 text-center">
      <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
        <Icon className={`h-8 w-8 ${colorClass}`} />
        <CardTitle className="text-md font-medium text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {value && <div className="text-4xl font-bold text-white">{value}</div>}
        {unit && <p className="text-sm text-slate-400">{unit}</p>}
        {children}
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
              <Replace className="mr-3 text-indigo-400" />
              Pigging Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard 
                icon={results.bendRadiusCheck.pass ? CheckCircle : AlertTriangle}
                title="Bend Radius Check"
                colorClass={results.bendRadiusCheck.pass ? 'text-green-400' : 'text-red-400'}
              >
                 <p className={`text-xl font-bold ${results.bendRadiusCheck.pass ? 'text-green-400' : 'text-red-400'}`}>
                    {results.bendRadiusCheck.pass ? 'PASS' : 'FAIL'}
                 </p>
                 <p className="text-xs text-slate-400 mt-1">Min required: {results.bendRadiusCheck.minRadius.toFixed(2)} in</p>
              </ResultCard>
              <ResultCard 
                icon={results.velocityCheck.pass ? CheckCircle : AlertTriangle}
                title="Velocity Check"
                colorClass={results.velocityCheck.pass ? 'text-green-400' : 'text-red-400'}
              >
                <p className={`text-xl font-bold ${results.velocityCheck.pass ? 'text-green-400' : 'text-red-400'}`}>
                    {results.velocityCheck.pass ? 'ACCEPTABLE' : 'WARNING'}
                 </p>
                 <p className="text-xs text-slate-400 mt-1">{results.velocityCheck.message}</p>
              </ResultCard>
            </div>
             <ResultCard 
                icon={HelpCircle}
                title="Launcher/Receiver Sizing"
                colorClass="text-blue-400"
              >
                <p className="text-lg text-white px-4">
                  Recommended length should accommodate the longest pig plus ~{results.trapSizing.handlingLength.toFixed(1)} ft for handling.
                </p>
                <p className="text-xs text-slate-400 mt-2">(Assuming a standard pig length of {results.trapSizing.pigLength.toFixed(1)} ft)</p>
              </ResultCard>
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
              <Replace className="mr-3 text-indigo-400" />
              Pigging Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="pipeOD" className="text-white">Pipe OD (in)</Label>
              <Input id="pipeOD" name="pipeOD" type="number" value={inputs.pipeOD} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
            </div>
            <div>
              <Label htmlFor="bendRadius" className="text-white">Minimum Bend Radius (in)</Label>
              <Input id="bendRadius" name="bendRadius" type="number" value={inputs.bendRadius} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
            </div>
            <div>
              <Label htmlFor="pigVelocity" className="text-white">Expected Pig Velocity (ft/s)</Label>
              <Input id="pigVelocity" name="pigVelocity" type="number" value={inputs.pigVelocity} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
            </div>
            <div>
              <Label htmlFor="bendMultiplier" className="text-white">Bend Radius Multiplier (e.g., 3D, 5D)</Label>
              <Input id="bendMultiplier" name="bendMultiplier" type="number" value={inputs.bendMultiplier} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
            </div>
            <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-lg mt-4">Analyze</Button>
          </CardContent>
        </Card>
      </motion.div>
      {memoizedResults}
    </div>
  );
};

export default PiggingAnalysis;