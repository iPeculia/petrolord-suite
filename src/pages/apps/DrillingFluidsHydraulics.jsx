import React, { useState, useMemo } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Droplets, Calculator, FileDown, RotateCcw, AlertCircle, Save } from 'lucide-react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

    const CollapsibleSection = ({ title, children, isOpen, onToggle }) => (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="p-4 cursor-pointer flex flex-row items-center justify-between" onClick={onToggle}>
          <CardTitle className="text-lg text-lime-300">{title}</CardTitle>
        </CardHeader>
        {isOpen && <CardContent className="p-4 pt-0">{children}</CardContent>}
      </Card>
    );

    const DrillingFluidsHydraulics = () => {
      const { toast } = useToast();
      const [inputs, setInputs] = useState({
        mudWeight: 10.5,
        plasticViscosity: 25,
        yieldPoint: 15,
        flowRate: 500,
        pipeOD: 5,
        pipeID: 4.276,
        holeSize: 8.5,
        bitDepth: 10000,
        rpm: 120,
      });
      const [results, setResults] = useState(null);
      const [openSections, setOpenSections] = useState({
        fluidProps: true,
        wellboreGeo: true,
        pumpParams: true,
      });

      const handleInputChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
      };

      const handleSelectChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
      };

      const calculateHydraulics = () => {
        // Simplified hydraulics calculations
        const annularVelocity = (24.5 * inputs.flowRate) / (inputs.holeSize ** 2 - inputs.pipeOD ** 2);
        const pipeVelocity = (24.5 * inputs.flowRate) / (inputs.pipeID ** 2);
        const ecd = inputs.mudWeight + (annularVelocity * inputs.yieldPoint) / (300 * (inputs.holeSize - inputs.pipeOD));

        const pressureProfile = Array.from({ length: 101 }, (_, i) => {
          const depth = (inputs.bitDepth / 100) * i;
          const hydrostatic = 0.052 * inputs.mudWeight * depth;
          const annularPressureLoss = (ecd - inputs.mudWeight) * 0.052 * depth;
          return {
            depth,
            hydrostatic: hydrostatic,
            circulating: hydrostatic + annularPressureLoss
          };
        });

        setResults({
          annularVelocity: annularVelocity.toFixed(2),
          pipeVelocity: pipeVelocity.toFixed(2),
          ecd: ecd.toFixed(2),
          pressureProfile,
        });

        toast({
          title: "✅ Calculation Complete",
          description: "Hydraulics analysis finished successfully.",
          className: "bg-green-600 text-white border-green-700",
        });
      };
      
      const resetForm = () => {
        setInputs({
            mudWeight: 10.5, plasticViscosity: 25, yieldPoint: 15, flowRate: 500,
            pipeOD: 5, pipeID: 4.276, holeSize: 8.5, bitDepth: 10000, rpm: 120,
        });
        setResults(null);
        toast({ title: "🔄 Form Reset", description: "All inputs have been reset to default values." });
      };

      const handleUnsupportedFeature = (feature) => {
        toast({
          title: `🚧 ${feature} Not Implemented`,
          description: "This feature is coming soon!",
        });
      };

      const toggleSection = (section) => {
        setOpenSections(prev => ({...prev, [section]: !prev[section]}));
      };

      const renderEmptyState = () => (
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
          <Droplets className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-semibold text-white">Hydraulics Analysis</h3>
          <p className="mt-2 text-sm text-slate-400">
            Enter your drilling parameters and click "Calculate Hydraulics" to see the results.
          </p>
        </div>
      );

      const renderResults = () => (
        <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
                <CardTitle className="text-2xl text-lime-300">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400">Annular Velocity</p>
                        <p className="text-2xl font-bold text-white">{results.annularVelocity} <span className="text-lg font-normal">ft/min</span></p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400">Pipe Velocity</p>
                        <p className="text-2xl font-bold text-white">{results.pipeVelocity} <span className="text-lg font-normal">ft/min</span></p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-sm text-slate-400">ECD @ Bit</p>
                        <p className="text-2xl font-bold text-white">{results.ecd} <span className="text-lg font-normal">ppg</span></p>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Pressure vs. Depth</h4>
                    <div className="w-full h-80 bg-slate-900 p-2 rounded-lg">
                        <ResponsiveContainer>
                            <LineChart data={results.pressureProfile}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#9ca3af' }} label={{ value: 'TVD (ft)', position: 'insideBottom', offset: -5, fill: '#d1d5db' }} reversed={true} />
                                <YAxis yAxisId="left" tick={{ fill: '#9ca3af' }} label={{ value: 'Pressure (psi)', angle: -90, position: 'insideLeft', fill: '#d1d5db' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} />
                                <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                                <Line yAxisId="left" type="monotone" dataKey="hydrostatic" name="Hydrostatic" stroke="#34d399" dot={false} strokeWidth={2} />
                                <Line yAxisId="left" type="monotone" dataKey="circulating" name="Circulating" stroke="#fb923c" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
      );

      return (
        <>
          <Helmet>
            <title>Drilling Fluids & Hydraulics - Petrolord Suite</title>
            <meta name="description" content="Design and model drilling fluid properties and circulation hydraulics." />
          </Helmet>
          <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-slate-900 text-white min-h-screen">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-3 rounded-xl shadow-lg">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Drilling Fluids & Hydraulics</h1>
                  <p className="text-slate-300 text-lg">Fluid Design and Circulation Modeling</p>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <CollapsibleSection title="Fluid Properties" isOpen={openSections.fluidProps} onToggle={() => toggleSection('fluidProps')}>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="mudWeight">Mud Weight (ppg)</Label><Input id="mudWeight" type="number" value={inputs.mudWeight} onChange={(e) => handleInputChange('mudWeight', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                    <div><Label htmlFor="plasticViscosity">Plastic Viscosity (cP)</Label><Input id="plasticViscosity" type="number" value={inputs.plasticViscosity} onChange={(e) => handleInputChange('plasticViscosity', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                    <div><Label htmlFor="yieldPoint">Yield Point (lb/100ft²)</Label><Input id="yieldPoint" type="number" value={inputs.yieldPoint} onChange={(e) => handleInputChange('yieldPoint', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Wellbore Geometry" isOpen={openSections.wellboreGeo} onToggle={() => toggleSection('wellboreGeo')}>
                   <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="holeSize">Hole Size (in)</Label><Input id="holeSize" type="number" value={inputs.holeSize} onChange={(e) => handleInputChange('holeSize', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                    <div><Label htmlFor="pipeOD">Pipe OD (in)</Label><Input id="pipeOD" type="number" value={inputs.pipeOD} onChange={(e) => handleInputChange('pipeOD', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                    <div><Label htmlFor="pipeID">Pipe ID (in)</Label><Input id="pipeID" type="number" value={inputs.pipeID} onChange={(e) => handleInputChange('pipeID', e.targe.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                    <div><Label htmlFor="bitDepth">Bit Depth (ft)</Label><Input id="bitDepth" type="number" value={inputs.bitDepth} onChange={(e) => handleInputChange('bitDepth', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Pump & Pipe Parameters" isOpen={openSections.pumpParams} onToggle={() => toggleSection('pumpParams')}>
                   <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="flowRate">Flow Rate (gpm)</Label><Input id="flowRate" type="number" value={inputs.flowRate} onChange={(e) => handleInputChange('flowRate', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                    <div><Label htmlFor="rpm">Pipe RPM</Label><Input id="rpm" type="number" value={inputs.rpm} onChange={(e) => handleInputChange('rpm', e.target.value)} className="bg-slate-700 border-slate-600 text-white" /></div>
                  </div>
                </CollapsibleSection>

                <div className="flex flex-col space-y-2">
                    <Button onClick={calculateHydraulics} className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold"><Calculator className="mr-2 h-4 w-4" />Calculate Hydraulics</Button>
                    <Button onClick={resetForm} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700"><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => handleUnsupportedFeature('Save Project')} variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"><Save className="mr-2 h-4 w-4" />Save</Button>
                    <Button onClick={() => handleUnsupportedFeature('Export Report')} variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"><FileDown className="mr-2 h-4 w-4" />Export</Button>
                </div>
              </div>
              <div className="lg:col-span-2">
                {results ? renderResults() : renderEmptyState()}
              </div>
            </div>
          </div>
        </>
      );
    };

    export default DrillingFluidsHydraulics;