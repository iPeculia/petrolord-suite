import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, ArrowLeft, Thermometer, Gauge, Shield, Beaker } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { calculateCorrosion } from '@/utils/corrosionCalculations';
import CorrosionRiskMatrix from '@/components/corrosion/CorrosionRiskMatrix';

const CorrosionRatePredictor = () => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    co2_partial_pressure: 1, // bar
    h2s_partial_pressure: 0.01, // bar
    temperature: 60, // C
    ph: 4.5,
    material: 'carbon_steel',
    oil_wetting: 'water_continuous',
    scaling_tendency: 'none',
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    try {
      const calculatedResults = calculateCorrosion(inputs);
      setResults(calculatedResults);
      toast({
        title: "Calculation Complete!",
        description: "Corrosion rate and SSC risk have been assessed.",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setResults(null);
    }
  };

  const InputPanel = () => (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader>
        <CardTitle>Corrosion Inputs</CardTitle>
        <CardDescription>Define fluid composition and operating conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-cyan-300">Fluid & Operating Conditions</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>CO₂ Partial Pressure (bar)</Label><Input type="number" value={inputs.co2_partial_pressure} onChange={(e) => handleInputChange('co2_partial_pressure', parseFloat(e.target.value))} /></div>
                <div className="space-y-2"><Label>H₂S Partial Pressure (bar)</Label><Input type="number" value={inputs.h2s_partial_pressure} onChange={(e) => handleInputChange('h2s_partial_pressure', parseFloat(e.target.value))} /></div>
                <div className="space-y-2"><Label>Temperature (°C)</Label><Input type="number" value={inputs.temperature} onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))} /></div>
                <div className="space-y-2"><Label>Water pH</Label><Input type="number" value={inputs.ph} onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))} /></div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-emerald-300">Material & System</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select value={inputs.material} onValueChange={(val) => handleInputChange('material', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carbon_steel">Carbon Steel</SelectItem>
                      <SelectItem value="13cr" disabled>13Cr Stainless Steel</SelectItem>
                      <SelectItem value="inconel" disabled>Inconel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Oil Wetting</Label>
                  <Select value={inputs.oil_wetting} onValueChange={(val) => handleInputChange('oil_wetting', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water_continuous">Water Continuous</SelectItem>
                      <SelectItem value="oil_continuous">Oil Continuous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Scaling Tendency</Label>
                  <Select value={inputs.scaling_tendency} onValueChange={(val) => handleInputChange('scaling_tendency', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="carbonate_scale">Carbonate Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );

  const ResultsPanel = () => {
    if (!results) {
      return (
        <Card className="bg-slate-800/50 border-slate-700 h-full">
          <CardHeader>
            <CardTitle>Corrosion Analysis</CardTitle>
            <CardDescription>Predicted corrosion rates and risks will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-10 border-2 border-dashed border-slate-700 rounded-lg">
              <Shield className="w-16 h-16 mb-4 text-orange-400" />
              <h3 className="text-xl font-semibold mb-2">Awaiting Analysis</h3>
              <p>Enter your parameters and run the calculation.</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const getRiskColor = (risk) => {
      if (risk === 'High' || risk === 'Severe') return 'text-red-400';
      if (risk === 'Medium' || risk === 'Moderate') return 'text-yellow-400';
      return 'text-green-400';
    };

    return (
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader>
          <CardTitle>Corrosion Analysis Results</CardTitle>
          <CardDescription>Based on provided inputs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <Label className="text-slate-400 flex items-center justify-center"><Gauge className="w-5 h-5 mr-2 text-orange-400"/>CO₂ Corrosion Rate</Label>
              <p className="text-3xl font-bold text-white">{results.corrosion_rate_mm_yr.toFixed(2)} <span className="text-lg font-normal">mm/yr</span></p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <Label className="text-slate-400 flex items-center justify-center"><Shield className="w-5 h-5 mr-2 text-red-400"/>SSC Risk</Label>
              <p className={`text-3xl font-bold ${getRiskColor(results.ssc_risk)}`}>{results.ssc_risk}</p>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CorrosionRiskMatrix 
              corrosionRateCategory={results.corrosion_rate_category}
              sscRisk={results.ssc_risk}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Recommendation</h4>
            <p className="text-sm text-slate-300">{results.recommendation}</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>Corrosion Rate Predictor - Petrolord</title>
        <meta name="description" content="Predict CO₂ and H₂S corrosion rates for pipelines and facilities." />
      </Helmet>
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-red-900/50 text-white p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-white" /></div>
              <h1 className="text-3xl font-bold">Corrosion Rate Predictor</h1>
            </div>
            <Button asChild variant="outline"><Link to="/dashboard/facilities"><ArrowLeft className="mr-2 h-4 w-4" />Back to Facilities</Link></Button>
          </div>
        </motion.div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <InputPanel />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <ResultsPanel />
          </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6">
          <Button onClick={handleCalculate} className="w-full bg-orange-600 hover:bg-orange-700">
            Predict Corrosion Rate
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default CorrosionRatePredictor;