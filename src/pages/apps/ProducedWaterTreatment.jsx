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
    import { Beaker, ArrowLeft, Droplets, Layers, Filter, CheckCircle, Clock, Ruler, Zap, Wind, RefreshCw, Map, ArrowRight } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const TreatmentTrainVisualizer = ({ primary, secondary, tertiary }) => {
      const Stage = ({ tech, icon, color }) => (
        <div className="flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-lg bg-${color}-500/20 border-2 border-${color}-400 flex flex-col items-center justify-center p-2`}>
            {icon}
            <span className="text-xs mt-1 font-semibold">{tech}</span>
          </div>
        </div>
      );
    
      const techMap = {
        'API Separator': { icon: <Layers className="w-8 h-8 text-emerald-400" />, color: 'emerald' },
        'CPI Separator': { icon: <Layers className="w-8 h-8 text-emerald-400" />, color: 'emerald' },
        'De-oiling Hydrocyclone': { icon: <Filter className="w-8 h-8 text-amber-400" />, color: 'amber' },
        'Induced Gas Flotation': { icon: <Wind className="w-8 h-8 text-amber-400" />, color: 'amber' },
        'Dissolved Air Flotation': { icon: <Wind className="w-8 h-8 text-amber-400" />, color: 'amber' },
        'Nutshell Filter': { icon: <Droplets className="w-8 h-8 text-rose-400" />, color: 'rose' },
        'Media Filter': { icon: <Droplets className="w-8 h-8 text-rose-400" />, color: 'rose' },
      };
    
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 text-center">Treatment Train Visualizer</h3>
          <div className="flex items-center justify-center space-x-2 p-4 bg-slate-900/50 rounded-lg">
            {primary && techMap[primary.tech] && <Stage tech={primary.tech} {...techMap[primary.tech]} />}
            {primary && (secondary || tertiary) && <ArrowRight className="w-8 h-8 text-slate-500" />}
            {secondary && techMap[secondary.tech] && <Stage tech={secondary.tech} {...techMap[secondary.tech]} />}
            {secondary && tertiary && <ArrowRight className="w-8 h-8 text-slate-500" />}
            {tertiary && techMap[tertiary.tech] && <Stage tech={tertiary.tech} {...techMap[tertiary.tech]} />}
          </div>
        </div>
      );
    };

    const ProducedWaterTreatment = () => {
      const { toast } = useToast();

      const [influentInputs, setInfluentInputs] = useState({
        flowRate: 50000,
        inletOiw: 1000,
        oilDropletSize: 150,
        waterSg: 1.02,
        oilSg: 0.85,
        waterViscosity: 1.0,
      });

      const [primaryTech, setPrimaryTech] = useState('');
      const [secondaryTech, setSecondaryTech] = useState('');
      const [secondaryInputs, setSecondaryInputs] = useState({
        pressureDrop: 50,
        gasToWaterRatio: 0.02,
      });
      const [tertiaryTech, setTertiaryTech] = useState('');
      const [tertiaryInputs, setTertiaryInputs] = useState({
        loadingRate: 10,
      });

      const [results, setResults] = useState(null);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfluentInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      };
      
      const handleSecondaryInputChange = (e) => {
        const { name, value } = e.target;
        setSecondaryInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      };

      const handleTertiaryInputChange = (e) => {
        const { name, value } = e.target;
        setTertiaryInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      };

      const handleCalculate = () => {
        const allInputsValid = Object.values(influentInputs).every(v => v > 0);
        if (!allInputsValid || !primaryTech) {
          toast({
            title: "Incomplete Inputs",
            description: "Please fill all influent properties and select at least a primary treatment technology.",
            variant: "destructive",
          });
          return;
        }

        let newResults = { totalFootprint: 0 };
        const flowRateGpm = influentInputs.flowRate * 42 / (24 * 60); // bwpd to gpm
        const flowRateCfs = flowRateGpm * 0.002228; // gpm to cfs

        // Primary Treatment Calculation
        let primaryResults = {};
        if (primaryTech === 'api') {
          const oilRiseVelocity = 1.78e-6 * (influentInputs.waterSg - influentInputs.oilSg) * Math.pow(influentInputs.oilDropletSize, 2) / influentInputs.waterViscosity; // ft/s
          const surfaceArea = 1.5 * flowRateCfs / oilRiseVelocity; // ft^2, with a factor of 1.5
          const width = Math.sqrt(surfaceArea / 5);
          const length = 5 * width;
          const depth = 0.5 * width;
          const volume = length * width * depth;
          const residenceTime = volume / flowRateCfs / 60;
          const outletOiw = influentInputs.inletOiw * 0.3;
          const footprint = length * width;

          primaryResults = { tech: 'API Separator', dimensions: `${length.toFixed(1)}' L x ${width.toFixed(1)}' W x ${depth.toFixed(1)}' D`, residenceTime: residenceTime.toFixed(1), outletOiw: outletOiw.toFixed(0), footprint: footprint };
        } else if (primaryTech === 'cpi') {
          const oilRiseVelocity = 1.78e-6 * (influentInputs.waterSg - influentInputs.oilSg) * Math.pow(influentInputs.oilDropletSize, 2) / influentInputs.waterViscosity; // ft/s
          const projectedArea = flowRateCfs / (oilRiseVelocity * Math.cos(45 * Math.PI / 180));
          const vesselDiameter = Math.sqrt(projectedArea / 10);
          const vesselLength = vesselDiameter * 4;
          const volume = (Math.PI * Math.pow(vesselDiameter / 2, 2) * vesselLength);
          const residenceTime = volume / flowRateCfs / 60;
          const outletOiw = influentInputs.inletOiw * 0.15;
          const footprint = vesselLength * vesselDiameter;

          primaryResults = { tech: 'CPI Separator', dimensions: `${vesselLength.toFixed(1)}' L x ${vesselDiameter.toFixed(1)}' Dia`, residenceTime: residenceTime.toFixed(1), outletOiw: outletOiw.toFixed(0), footprint: footprint };
        }
        newResults.primary = primaryResults;
        newResults.totalFootprint += primaryResults.footprint || 0;
        let currentOiw = parseFloat(primaryResults.outletOiw);

        // Secondary Treatment Calculation
        if (secondaryTech && currentOiw > 0) {
          let secondaryResults = {};
          if (secondaryTech === 'hydrocyclone') {
            const linerCapacityGpm = 50; // Typical capacity per liner
            const numLiners = Math.ceil(flowRateGpm / linerCapacityGpm);
            const outletOiw = currentOiw * 0.05; // 95% removal
            const footprint = 100 + numLiners * 5; // Base 100 sqft + 5 sqft/liner
            secondaryResults = { tech: 'De-oiling Hydrocyclone', numLiners: numLiners, pressureDrop: secondaryInputs.pressureDrop, outletOiw: outletOiw.toFixed(0), footprint: footprint };
          } else if (secondaryTech === 'igf' || secondaryTech === 'daf') {
            const gasRateScfm = flowRateGpm * 7.48 * secondaryInputs.gasToWaterRatio; // Convert GPM to ft3/min, then apply ratio
            const residenceTimeMin = 8;
            const volumeFt3 = flowRateGpm * 0.1337 * residenceTimeMin;
            const vesselDiameter = Math.pow((4 * volumeFt3) / (Math.PI * 4), 1/3); // Assuming L/D = 4
            const vesselLength = vesselDiameter * 4;
            const outletOiw = currentOiw * 0.1; // 90% removal
            const techName = secondaryTech === 'igf' ? 'Induced Gas Flotation' : 'Dissolved Air Flotation';
            const footprint = vesselLength * vesselDiameter;
            secondaryResults = { tech: techName, gasRate: gasRateScfm.toFixed(0), dimensions: `${vesselLength.toFixed(1)}' L x ${vesselDiameter.toFixed(1)}' Dia`, outletOiw: outletOiw.toFixed(0), footprint: footprint };
          }
          newResults.secondary = secondaryResults;
          newResults.totalFootprint += secondaryResults.footprint || 0;
          currentOiw = parseFloat(secondaryResults.outletOiw);
        }

        // Tertiary Treatment Calculation
        if (tertiaryTech && currentOiw > 0) {
          let tertiaryResults = {};
          if (tertiaryTech === 'nutshell' || tertiaryTech === 'media') {
            const filterArea = flowRateGpm / tertiaryInputs.loadingRate; // ft^2
            const vesselDiameter = Math.sqrt(filterArea / (Math.PI / 4));
            const backwashRate = 15; // gpm/ft^2
            const backwashDuration = 10; // min
            const backwashVolume = filterArea * backwashRate * backwashDuration / 42; // bbls
            const outletOiw = currentOiw * 0.1; // 90% removal
            const techName = tertiaryTech === 'nutshell' ? 'Nutshell Filter' : 'Media Filter';
            const footprint = filterArea * 1.2; // Area + 20% for access
            tertiaryResults = { tech: techName, dimensions: `${vesselDiameter.toFixed(1)}' Dia`, backwashVolume: backwashVolume.toFixed(0), outletOiw: outletOiw.toFixed(0), footprint: footprint };
          }
          newResults.tertiary = tertiaryResults;
          newResults.totalFootprint += tertiaryResults.footprint || 0;
        }

        setResults(newResults);
        
        toast({
          title: "Calculation Complete!",
          description: "The treatment train has been designed.",
        });
      };

      const InputSection = () => (
        <Card className="bg-slate-800/50 border-slate-700 flex-grow">
          <CardHeader>
            <CardTitle>Treatment Train Design</CardTitle>
            <CardDescription>Define influent properties and select treatment technologies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-cyan-300">Influent Water Properties</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Flow Rate (bwpd)</Label><Input name="flowRate" value={influentInputs.flowRate} onChange={handleInputChange} type="number" /></div>
                    <div className="space-y-2"><Label>Inlet Oil in Water (ppm)</Label><Input name="inletOiw" value={influentInputs.inletOiw} onChange={handleInputChange} type="number" /></div>
                    <div className="space-y-2"><Label>Oil Droplet Size (micron)</Label><Input name="oilDropletSize" value={influentInputs.oilDropletSize} onChange={handleInputChange} type="number" /></div>
                    <div className="space-y-2"><Label>Water Specific Gravity</Label><Input name="waterSg" value={influentInputs.waterSg} onChange={handleInputChange} type="number" /></div>
                    <div className="space-y-2"><Label>Oil Specific Gravity</Label><Input name="oilSg" value={influentInputs.oilSg} onChange={handleInputChange} type="number" /></div>
                    <div className="space-y-2"><Label>Water Viscosity (cP)</Label><Input name="waterViscosity" value={influentInputs.waterViscosity} onChange={handleInputChange} type="number" /></div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-emerald-300">Primary Treatment</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label>Technology</Label><Select onValueChange={setPrimaryTech}><SelectTrigger><SelectValue placeholder="Select Primary Tech" /></SelectTrigger><SelectContent><SelectItem value="api">API Separator</SelectItem><SelectItem value="cpi">Corrugated Plate Interceptor (CPI)</SelectItem></SelectContent></Select></div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold text-amber-300">Secondary Treatment</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label>Technology</Label><Select onValueChange={setSecondaryTech}><SelectTrigger><SelectValue placeholder="Select Secondary Tech" /></SelectTrigger><SelectContent><SelectItem value="hydrocyclone">De-oiling Hydrocyclone</SelectItem><SelectItem value="igf">Induced Gas Flotation (IGF)</SelectItem><SelectItem value="daf">Dissolved Air Flotation (DAF)</SelectItem></SelectContent></Select></div>
                  {secondaryTech === 'hydrocyclone' && <div className="space-y-2"><Label>Pressure Drop (psi)</Label><Input name="pressureDrop" value={secondaryInputs.pressureDrop} onChange={handleSecondaryInputChange} type="number" /></div>}
                  {(secondaryTech === 'igf' || secondaryTech === 'daf') && <div className="space-y-2"><Label>Gas-to-Water Ratio (vol/vol)</Label><Input name="gasToWaterRatio" value={secondaryInputs.gasToWaterRatio} onChange={handleSecondaryInputChange} type="number" step="0.01" /></div>}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold text-rose-300">Tertiary Treatment</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2"><Label>Technology</Label><Select onValueChange={setTertiaryTech}><SelectTrigger><SelectValue placeholder="Select Tertiary Tech" /></SelectTrigger><SelectContent><SelectItem value="nutshell">Nutshell Filter</SelectItem><SelectItem value="media">Media Filter</SelectItem></SelectContent></Select></div>
                  {(tertiaryTech === 'nutshell' || tertiaryTech === 'media') && <div className="space-y-2"><Label>Media Loading Rate (gpm/ft²)</Label><Input name="loadingRate" value={tertiaryInputs.loadingRate} onChange={handleTertiaryInputChange} type="number" /></div>}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button onClick={handleCalculate} className="w-full bg-cyan-600 hover:bg-cyan-700 mt-6">Design Treatment Train</Button>
          </CardContent>
        </Card>
      );

      const ResultsSection = () => {
        if (!results) {
          return (
            <Card className="bg-slate-800/50 border-slate-700 flex-grow">
              <CardHeader><CardTitle>Results & Visualization</CardTitle><CardDescription>Performance metrics and equipment sizing will appear here.</CardDescription></CardHeader>
              <CardContent className="h-[calc(100%-78px)]"><div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-10 border-2 border-dashed border-slate-700 rounded-lg"><Layers className="w-16 h-16 mb-4" /><h3 className="text-xl font-semibold mb-2">Awaiting Design</h3><p>Enter your process conditions and select technologies to see the system design.</p></div></CardContent>
            </Card>
          );
        }

        return (
          <Card className="bg-slate-800/50 border-slate-700 flex-grow">
            <CardHeader><CardTitle>Results & Visualization</CardTitle><CardDescription>Calculated performance for the treatment train.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 p-4 rounded-lg text-center">
                <Label className="text-slate-400 flex items-center justify-center"><Map className="w-5 h-5 mr-2 text-cyan-400"/>Total Estimated Footprint</Label>
                <p className="text-3xl font-bold text-white">{results.totalFootprint.toFixed(0)} <span className="text-lg font-normal">ft²</span></p>
              </motion.div>

              {results.primary && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center"><Layers className="w-5 h-5 mr-2"/>Primary: {results.primary.tech}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Ruler className="w-4 h-4 mr-2 text-emerald-400"/>Vessel Size</Label><p className="text-lg font-bold text-white">{results.primary.dimensions}</p></div>
                    <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Clock className="w-4 h-4 mr-2 text-emerald-400"/>Residence Time</Label><p className="text-lg font-bold text-white">{results.primary.residenceTime} <span className="text-base font-normal">min</span></p></div>
                    <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-400"/>Outlet OIW</Label><p className="text-lg font-bold text-white">{results.primary.outletOiw} <span className="text-base font-normal">ppm</span></p></div>
                  </div>
                </motion.div>
              )}
              {results.secondary && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center"><Filter className="w-5 h-5 mr-2"/>Secondary: {results.secondary.tech}</h3>
                  {results.secondary.tech === 'De-oiling Hydrocyclone' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Layers className="w-4 h-4 mr-2 text-amber-400"/>Liners Req.</Label><p className="text-lg font-bold text-white">{results.secondary.numLiners}</p></div>
                      <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Zap className="w-4 h-4 mr-2 text-amber-400"/>Pressure Drop</Label><p className="text-lg font-bold text-white">{results.secondary.pressureDrop} <span className="text-base font-normal">psi</span></p></div>
                      <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-amber-400"/>Outlet OIW</Label><p className="text-lg font-bold text-white">{results.secondary.outletOiw} <span className="text-base font-normal">ppm</span></p></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Ruler className="w-4 h-4 mr-2 text-amber-400"/>Vessel Size</Label><p className="text-lg font-bold text-white">{results.secondary.dimensions}</p></div>
                      <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Wind className="w-4 h-4 mr-2 text-amber-400"/>Gas Rate</Label><p className="text-lg font-bold text-white">{results.secondary.gasRate} <span className="text-base font-normal">SCFM</span></p></div>
                      <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-amber-400"/>Outlet OIW</Label><p className="text-lg font-bold text-white">{results.secondary.outletOiw} <span className="text-base font-normal">ppm</span></p></div>
                    </div>
                  )}
                </motion.div>
              )}
              {results.tertiary && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-lg font-semibold text-rose-300 mb-3 flex items-center"><Droplets className="w-5 h-5 mr-2"/>Tertiary: {results.tertiary.tech}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><Ruler className="w-4 h-4 mr-2 text-rose-400"/>Vessel Size</Label><p className="text-lg font-bold text-white">{results.tertiary.dimensions}</p></div>
                    <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-rose-400"/>Backwash Vol.</Label><p className="text-lg font-bold text-white">{results.tertiary.backwashVolume} <span className="text-base font-normal">bbl</span></p></div>
                    <div className="bg-slate-900/50 p-4 rounded-lg"><Label className="text-slate-400 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-rose-400"/>Final Outlet OIW</Label><p className="text-lg font-bold text-white">{results.tertiary.outletOiw} <span className="text-base font-normal">ppm</span></p></div>
                  </div>
                </motion.div>
              )}
              <TreatmentTrainVisualizer primary={results.primary} secondary={results.secondary} tertiary={results.tertiary} />
            </CardContent>
          </Card>
        );
      };

      return (
        <>
          <Helmet>
            <title>Produced Water Treatment - Petrolord</title>
            <meta name="description" content="Design and model produced water treatment trains including hydrocyclones, CPI, IGF, and DAF systems. Target oil-in-water levels, residence times, and estimate footprints." />
          </Helmet>
          <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-indigo-900/50 text-white p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg"><Beaker className="w-6 h-6 text-white" /></div>
                  <h1 className="text-3xl font-bold">Produced-Water Treatment</h1>
                </div>
                <Button asChild variant="outline"><Link to="/dashboard/facilities"><ArrowLeft className="mr-2 h-4 w-4" />Back to Facilities</Link></Button>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full flex-grow">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col"><InputSection /></motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col"><ResultsSection /></motion.div>
            </div>
          </div>
        </>
      );
    };

    export default ProducedWaterTreatment;