import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Ruler, Shield, Thermometer, Gauge, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateWallThickness } from '@/utils/facilityNetworkHydraulicsCalculations';

const materialGrades = [
  { name: 'API 5L Gr. B', smys: 35000 },
  { name: 'API 5L X42', smys: 42000 },
  { name: 'API 5L X52', smys: 52000 },
  { name: 'API 5L X60', smys: 60000 },
  { name: 'API 5L X65', smys: 65000 },
  { name: 'API 5L X70', smys: 70000 },
];

const WallThickness = () => {
  const [inputs, setInputs] = useState({
    pipeOD: 12.75,
    maop: 1480,
    smys: 52000,
    designFactor: 0.72,
    jointFactor: 1.0,
    tempDeratingFactor: 1.0,
    corrosionAllowance: 0.125,
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleCalculate = () => {
    const calculatedResults = calculateWallThickness(inputs);
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
              <Shield className="mr-3 text-indigo-400" />
              Compliance Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <ResultCard icon={Ruler} title="Required Thickness" value={results.requiredThickness.toFixed(3)} unit="in" colorClass="text-blue-400" />
                 <ResultCard icon={Ruler} title="Nominal Thickness" value={results.nominalThickness.toFixed(3)} unit="in" colorClass="text-orange-400" />
            </div>
             <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-center">
              <p className="text-slate-300 text-lg">MAOP with Nominal Thickness</p>
              <p className="text-5xl font-bold text-white my-2">{results.maopWithNominal.toFixed(0)}</p>
              <p className="text-slate-300 text-lg">psi</p>
            </div>
            <div className="text-center pt-4">
                <p className="text-green-400 flex items-center justify-center"><CheckCircle className="mr-2" /> Calculation successful and compliant.</p>
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
              <Shield className="mr-3 text-indigo-400" />
              Design Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pipeOD" className="text-white">Pipe OD (in)</Label>
                <Input id="pipeOD" name="pipeOD" type="number" value={inputs.pipeOD} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
              <div>
                <Label htmlFor="maop" className="text-white">MAOP (psi)</Label>
                <Input id="maop" name="maop" type="number" value={inputs.maop} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
            </div>
            <div>
              <Label htmlFor="smys" className="text-white">Material Grade (SMYS)</Label>
              <Select value={inputs.smys} onValueChange={(val) => handleSelectChange('smys', val)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 mt-1 text-white">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {materialGrades.map(grade => (
                    <SelectItem key={grade.name} value={grade.smys}>{grade.name} ({grade.smys} psi)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designFactor" className="text-white">Design Factor</Label>
                <Input id="designFactor" name="designFactor" type="number" step="0.01" value={inputs.designFactor} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
              <div>
                <Label htmlFor="jointFactor" className="text-white">Joint Factor (E)</Label>
                <Input id="jointFactor" name="jointFactor" type="number" step="0.01" value={inputs.jointFactor} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tempDeratingFactor" className="text-white">Temp Factor (T)</Label>
                <Input id="tempDeratingFactor" name="tempDeratingFactor" type="number" step="0.01" value={inputs.tempDeratingFactor} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
              </div>
              <div>
                <Label htmlFor="corrosionAllowance" className="text-white">Corrosion Allow (in)</Label>
                <Input id="corrosionAllowance" name="corrosionAllowance" type="number" step="0.001" value={inputs.corrosionAllowance} onChange={handleInputChange} className="bg-slate-800 border-slate-600 mt-1 text-white" />
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

export default WallThickness;