import React, { useState, useMemo } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { FlaskConical, ArrowLeft, Thermometer, Droplets, RefreshCw, Waves, Wind, ArrowRight, ArrowDown } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { Line } from 'react-chartjs-2';
    import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
    } from 'chart.js';

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );

    const GasTreatingDehydration = () => {
      const { toast } = useToast();
      const [activeTab, setActiveTab] = useState('amine-sweetening');
      
      const [amineInputs, setAmineInputs] = useState({
        gasFlowRate: 50,
        inletH2S: 1000,
        outletH2S: 4,
        inletCO2: 2.5,
        amineType: 'MDEA',
        amineConcentration: 45,
        leanAmineLoading: 0.005,
        contactorPressure: 1000,
        contactorTemperature: 100,
      });
      const [amineResults, setAmineResults] = useState(null);

      const [tegInputs, setTegInputs] = useState({
        gasFlowRate: 50,
        inletTemp: 100,
        inletPressure: 1000,
        inletWaterContent: 40,
        outletWaterSpec: 7,
        leanTegConcentration: 99.5,
        trays: 8,
        inletBtex: 100,
      });
      const [tegResults, setTegResults] = useState(null);

      const amineMolecularWeights = { MEA: 61.08, DEA: 105.14, MDEA: 119.16 };
      const amineMaxLoadings = { MEA: 0.35, DEA: 0.35, MDEA: 0.45 };
      const amineSolutionDensities = { MEA: 8.4, DEA: 8.9, MDEA: 8.5 };
      const reboilerDutyFactor = { MEA: 1.0, DEA: 0.8, MDEA: 0.6 };

      const handleAmineInputChange = (field, value) => {
        setAmineInputs(prev => ({ ...prev, [field]: value }));
      };

      const handleAmineTypeChange = (value) => {
        setAmineInputs(prev => ({ ...prev, amineType: value }));
      };

      const calculateAmineSystem = () => {
        const { amineType, ...numericInputs } = amineInputs;
        const allNumericInputsValid = Object.values(numericInputs).every(v => v !== '' && !isNaN(parseFloat(v)));

        if (!allNumericInputsValid || !amineType) {
            toast({ title: "Invalid Input", description: "Please fill all amine input fields with valid numbers.", variant: "destructive" });
            return;
        }

        const { gasFlowRate, inletH2S, outletH2S, inletCO2, amineConcentration, leanAmineLoading } = amineInputs;
        const gasFlowScfDay = parseFloat(gasFlowRate) * 1e6;
        const SCF_per_lb_mol = 379.5;
        const h2sInMoles = (gasFlowScfDay * (parseFloat(inletH2S) / 1e6)) / SCF_per_lb_mol;
        const h2sOutMoles = (gasFlowScfDay * (parseFloat(outletH2S) / 1e6)) / SCF_per_lb_mol;
        const h2sRemovedMoles = h2sInMoles - h2sOutMoles;
        const co2RemovedMoles = (gasFlowScfDay * (parseFloat(inletCO2) / 100)) / SCF_per_lb_mol;
        const totalAcidGasRemoved = h2sRemovedMoles + co2RemovedMoles;
        if (totalAcidGasRemoved <= 0) {
          toast({ title: "No acid gas to remove.", variant: "destructive" });
          return;
        }
        const maxRichLoading = amineMaxLoadings[amineType];
        const deltaLoading = maxRichLoading - parseFloat(leanAmineLoading);
        if (deltaLoading <= 0) {
            toast({ title: "Invalid Loading", description: "Lean loading must be less than max rich loading.", variant: "destructive"});
            return;
        }
        const amineMolesRequired = totalAcidGasRemoved / deltaLoading;
        const amineMW = amineMolecularWeights[amineType];
        const amineMassRequired = amineMolesRequired * amineMW;
        const solutionMassRequired = amineMassRequired / (parseFloat(amineConcentration) / 100);
        const solutionDensity = amineSolutionDensities[amineType];
        const solutionVolumeGpd = solutionMassRequired / solutionDensity;
        const circulationRateGpm = solutionVolumeGpd / (24 * 60);
        const richAmineLoading = parseFloat(leanAmineLoading) + (totalAcidGasRemoved / amineMolesRequired);
        const reboilerHeatDuty = circulationRateGpm * (reboilerDutyFactor[amineType] * 1000) / 1e6;
        setAmineResults({
            circulationRateGpm: circulationRateGpm.toFixed(2),
            richAmineLoading: richAmineLoading.toFixed(3),
            reboilerDuty: reboilerHeatDuty.toFixed(2),
        });
      };

      const handleTegInputChange = (field, value) => {
        setTegInputs(prev => ({ ...prev, [field]: value }));
      };

      const calculateTegSystem = () => {
        const allInputsValid = Object.values(tegInputs).every(v => v !== '' && !isNaN(parseFloat(v)));
        if (!allInputsValid) {
            toast({ title: "Invalid Input", description: "Please fill all TEG input fields.", variant: "destructive" });
            return;
        }
        const { gasFlowRate, inletWaterContent, outletWaterSpec, inletBtex } = tegInputs;
        const waterRemovedLbPerMmscf = parseFloat(inletWaterContent) - parseFloat(outletWaterSpec);
        if (waterRemovedLbPerMmscf <= 0) {
            toast({ title: "No water to remove.", description: "Inlet water content must be higher than outlet spec.", variant: "destructive" });
            return;
        }
        const totalWaterRemovedLbPerDay = waterRemovedLbPerMmscf * parseFloat(gasFlowRate);
        const TEG_GAL_PER_LB_H2O = 4; // Rule of thumb: 3-5 gal TEG / lb H2O removed
        const circulationRateGpd = totalWaterRemovedLbPerDay * TEG_GAL_PER_LB_H2O;
        const circulationRateGpm = circulationRateGpd / (24 * 60);
        const REBOILER_DUTY_BTU_PER_GAL = 750; // Rule of thumb: ~750 BTU / gal TEG
        const reboilerDutyBtuHr = circulationRateGpm * 60 * REBOILER_DUTY_BTU_PER_GAL;
        const reboilerDutyMmbtuHr = reboilerDutyBtuHr / 1e6;

        const BTEX_ABSORPTION_PERCENT = 0.15; // Typical absorption is 10-20%
        const btexInMoles = (parseFloat(gasFlowRate) * 1e6 * (parseFloat(inletBtex) / 1e6)) / 379.5;
        const btexAbsorbedMoles = btexInMoles * BTEX_ABSORPTION_PERCENT;
        const AVG_BTEX_MW = 92; // Toluene is a reasonable average
        const btexEmissionsLbDay = btexAbsorbedMoles * AVG_BTEX_MW;
        const btexEmissionsTonsYear = (btexEmissionsLbDay * 365) / 2000;

        setTegResults({
            circulationRateGpm: circulationRateGpm.toFixed(2),
            reboilerDuty: reboilerDutyMmbtuHr.toFixed(2),
            btexEmissions: btexEmissionsTonsYear.toFixed(2),
        });
      };

      const AmineSweeteningInputs = () => {
        const selectedAmineMaxLoading = useMemo(() => amineMaxLoadings[amineInputs.amineType], [amineInputs.amineType]);

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gas Flow Rate (MMSCFD)</Label>
                <Input value={amineInputs.gasFlowRate} onChange={e => handleAmineInputChange('gasFlowRate', e.target.value)} placeholder="e.g., 50" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Inlet H₂S Content (ppm)</Label>
                <Input value={amineInputs.inletH2S} onChange={e => handleAmineInputChange('inletH2S', e.target.value)} placeholder="e.g., 1000" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Outlet H₂S Spec (ppm)</Label>
                <Input value={amineInputs.outletH2S} onChange={e => handleAmineInputChange('outletH2S', e.target.value)} placeholder="e.g., 4" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Inlet CO₂ Content (mol%)</Label>
                <Input value={amineInputs.inletCO2} onChange={e => handleAmineInputChange('inletCO2', e.target.value)} placeholder="e.g., 2.5" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Amine Type</Label>
                <Select value={amineInputs.amineType} onValueChange={handleAmineTypeChange}>
                  <SelectTrigger className="bg-slate-900 border-slate-600"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEA">MEA</SelectItem>
                    <SelectItem value="DEA">DEA</SelectItem>
                    <SelectItem value="MDEA">MDEA</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 mt-1">Typical max rich loading: {selectedAmineMaxLoading} mol/mol</p>
              </div>
              <div className="space-y-2">
                <Label>Amine Concentration (wt%)</Label>
                <Input value={amineInputs.amineConcentration} onChange={e => handleAmineInputChange('amineConcentration', e.target.value)} placeholder="e.g., 45" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Lean Amine Loading (mol/mol)</Label>
                <Input value={amineInputs.leanAmineLoading} onChange={e => handleAmineInputChange('leanAmineLoading', e.target.value)} placeholder="e.g., 0.005" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Contactor Pressure (psig)</Label>
                <Input value={amineInputs.contactorPressure} onChange={e => handleAmineInputChange('contactorPressure', e.target.value)} placeholder="e.g., 1000" type="number" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Contactor Temperature (°F)</Label>
                <Input value={amineInputs.contactorTemperature} onChange={e => handleAmineInputChange('contactorTemperature', e.target.value)} placeholder="e.g., 100" type="number" />
              </div>
            </div>
            <Button onClick={calculateAmineSystem} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">
              Calculate Amine System
            </Button>
          </div>
        );
      };

      const TegDehydrationInputs = () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gas Flow Rate (MMSCFD)</Label>
              <Input value={tegInputs.gasFlowRate} onChange={e => handleTegInputChange('gasFlowRate', e.target.value)} placeholder="e.g., 50" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Inlet Gas Temperature (°F)</Label>
              <Input value={tegInputs.inletTemp} onChange={e => handleTegInputChange('inletTemp', e.target.value)} placeholder="e.g., 100" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Inlet Gas Pressure (psig)</Label>
              <Input value={tegInputs.inletPressure} onChange={e => handleTegInputChange('inletPressure', e.target.value)} placeholder="e.g., 1000" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Inlet Water Content (lb/MMSCF)</Label>
              <Input value={tegInputs.inletWaterContent} onChange={e => handleTegInputChange('inletWaterContent', e.target.value)} placeholder="e.g., 40" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Outlet Water Spec (lb/MMSCF)</Label>
              <Input value={tegInputs.outletWaterSpec} onChange={e => handleTegInputChange('outletWaterSpec', e.target.value)} placeholder="e.g., 7" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Lean TEG Concentration (wt%)</Label>
              <Input value={tegInputs.leanTegConcentration} onChange={e => handleTegInputChange('leanTegConcentration', e.target.value)} placeholder="e.g., 99.5" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Number of Trays in Contactor</Label>
              <Input value={tegInputs.trays} onChange={e => handleTegInputChange('trays', e.target.value)} placeholder="e.g., 8" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Inlet Gas BTEX Content (ppmv)</Label>
              <Input value={tegInputs.inletBtex} onChange={e => handleTegInputChange('inletBtex', e.target.value)} placeholder="e.g., 100" type="number" />
            </div>
          </div>
          <Button onClick={calculateTegSystem} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4">
            Calculate TEG System
          </Button>
        </div>
      );

      const SimplifiedPfd = ({ type }) => {
        const PfdItem = ({ name, className }) => (
          <div className={`flex flex-col items-center justify-center p-2 border-2 border-slate-600 rounded-lg bg-slate-800/50 ${className}`}>
            <span className="text-xs font-bold text-center">{name}</span>
          </div>
        );
        
        const Arrow = ({ direction = 'right' }) => {
          const classes = {
            right: 'w-6 h-6 text-slate-400 mx-1',
            down: 'w-6 h-6 text-slate-400 my-1 transform rotate-90',
          };
          return <ArrowRight className={classes[direction]} />;
        };

        if (type === 'amine') {
          return (
            <div className="p-4 rounded-lg bg-slate-900/50 mt-4">
              <h4 className="text-lg font-semibold mb-3 text-center">Simplified Process Flow</h4>
              <div className="flex items-center justify-center flex-wrap text-xs">
                <span className="mr-1">Sour Gas</span>
                <Arrow />
                <PfdItem name="Contactor" />
                <Arrow />
                <span className="mr-1">Sweet Gas</span>
              </div>
              <div className="flex justify-center my-1">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex items-center justify-center flex-wrap text-xs">
                <span className="mr-1">Acid Gas</span>
                <Arrow direction="left" />
                <PfdItem name="Regenerator" />
                <Arrow direction="left" />
                <PfdItem name="Lean/Rich Exchanger" />
                <Arrow direction="left" />
                <PfdItem name="Contactor" />
              </div>
            </div>
          );
        }

        if (type === 'teg') {
          return (
            <div className="p-4 rounded-lg bg-slate-900/50 mt-4">
              <h4 className="text-lg font-semibold mb-3 text-center">Simplified Process Flow</h4>
              <div className="flex items-center justify-center flex-wrap text-xs">
                <span className="mr-1">Wet Gas</span>
                <Arrow />
                <PfdItem name="Contactor" />
                <Arrow />
                <span className="mr-1">Dry Gas</span>
              </div>
              <div className="flex justify-center my-1">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex items-center justify-center flex-wrap text-xs">
                <PfdItem name="Reboiler" />
                <Arrow direction="left" />
                <PfdItem name="Regenerator" />
                <Arrow direction="left" />
                <PfdItem name="Lean/Rich Exchanger" />
                <Arrow direction="left" />
                <PfdItem name="Contactor" />
              </div>
            </div>
          );
        }
        return null;
      };

      const TemperatureProfileChart = () => {
        const data = {
          labels: ['Top', 'Tray 18', 'Tray 15', 'Tray 12 (Bulge)', 'Tray 9', 'Tray 6', 'Tray 3', 'Bottom'],
          datasets: [
            {
              label: 'Gas Temperature (°F)',
              data: [100, 105, 115, 135, 125, 118, 112, 110],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Amine Temperature (°F)',
              data: [115, 118, 122, 135, 130, 125, 120, 118],
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        };
        const options = {
          responsive: true,
          plugins: { legend: { position: 'top', labels: { color: '#fff' } }, title: { display: true, text: 'Contactor Temperature Profile', color: '#fff' } },
          scales: { x: { ticks: { color: '#ddd' } }, y: { ticks: { color: '#ddd' }, title: { display: true, text: 'Temperature (°F)', color: '#fff' } } }
        };
        return <Line options={options} data={data} />;
      };

      const TegPerformanceChart = () => {
        const data = {
          labels: ['98.0', '98.5', '99.0', '99.5', '99.7', '99.9'],
          datasets: [
            {
              label: 'Equilibrium Water Dew Point (°F)',
              data: [50, 40, 25, 10, -10, -30],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        };
        const options = {
          responsive: true,
          plugins: { legend: { position: 'top', labels: { color: '#fff' } }, title: { display: true, text: 'TEG Performance Curve', color: '#fff' } },
          scales: { x: { ticks: { color: '#ddd' }, title: { display: true, text: 'Lean TEG Concentration (wt%)', color: '#fff' } }, y: { ticks: { color: '#ddd' }, title: { display: true, text: 'Dew Point (°F)', color: '#fff' } } }
        };
        return <Line options={options} data={data} />;
      };

      const ResultsDisplay = ({ results, processType }) => {
        if (!results) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-10">
                <Thermometer className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Results will appear here</h3>
                <p>Enter your process conditions and click calculate to see the system design and performance.</p>
                </div>
            );
        }

        if (processType === 'amine') {
            return (
                <div className="space-y-4 p-4 overflow-y-auto h-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                          <Label className="text-slate-400 flex items-center"><Droplets className="w-4 h-4 mr-2 text-emerald-400"/>Circulation Rate</Label>
                          <p className="text-2xl font-bold text-white">{results.circulationRateGpm} <span className="text-lg font-normal text-slate-300">GPM</span></p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                          <Label className="text-slate-400 flex items-center"><RefreshCw className="w-4 h-4 mr-2 text-emerald-400"/>Rich Loading</Label>
                          <p className="text-2xl font-bold text-white">{results.richAmineLoading} <span className="text-lg font-normal text-slate-300">mol/mol</span></p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                          <Label className="text-slate-400 flex items-center"><Thermometer className="w-4 h-4 mr-2 text-emerald-400"/>Reboiler Duty</Label>
                          <p className="text-2xl font-bold text-white">{results.reboilerDuty} <span className="text-lg font-normal text-slate-300">MMBtu/hr</span></p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <TemperatureProfileChart />
                    </div>
                    <SimplifiedPfd type="amine" />
                </div>
            )
        }

        if (processType === 'teg') {
            return (
                <div className="space-y-4 p-4 overflow-y-auto h-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                          <Label className="text-slate-400 flex items-center"><Waves className="w-4 h-4 mr-2 text-sky-400"/>TEG Circulation Rate</Label>
                          <p className="text-2xl font-bold text-white">{results.circulationRateGpm} <span className="text-lg font-normal text-slate-300">GPM</span></p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                          <Label className="text-slate-400 flex items-center"><Thermometer className="w-4 h-4 mr-2 text-sky-400"/>Reboiler Duty</Label>
                          <p className="text-2xl font-bold text-white">{results.reboilerDuty} <span className="text-lg font-normal text-slate-300">MMBtu/hr</span></p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg">
                          <Label className="text-slate-400 flex items-center"><Wind className="w-4 h-4 mr-2 text-red-400"/>BTEX Emissions</Label>
                          <p className="text-2xl font-bold text-white">{results.btexEmissions} <span className="text-lg font-normal text-slate-300">tons/yr</span></p>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <TegPerformanceChart />
                    </div>
                    <SimplifiedPfd type="teg" />
                </div>
            )
        }

        return null;
      }

      return (
        <>
          <Helmet>
            <title>Gas Treating & Dehydration - Petrolord</title>
            <meta name="description" content="Design and simulate gas sweetening and dehydration processes. Calculate circulation rates, duties, and loading for MEA, DEA, MDEA, and TEG systems." />
          </Helmet>
          <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-indigo-900/50 text-white p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-lg">
                    <FlaskConical className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold">Gas Treating & Dehydration</h1>
                </div>
                <Button asChild variant="outline">
                  <Link to="/dashboard/facilities">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Facilities
                  </Link>
                </Button>
              </div>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/80">
                <TabsTrigger value="amine-sweetening">Amine Sweetening</TabsTrigger>
                <TabsTrigger value="teg-dehydration">TEG Dehydration</TabsTrigger>
              </TabsList>
              <TabsContent value="amine-sweetening" className="mt-4 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col">
                    <Card className="bg-slate-800/50 border-slate-700 flex-grow">
                      <CardHeader>
                        <CardTitle>Amine Sweetening Inputs</CardTitle>
                        <CardDescription>Provide gas conditions and amine system parameters.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AmineSweeteningInputs />
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col">
                    <Card className="bg-slate-800/50 border-slate-700 flex-grow">
                      <CardHeader>
                        <CardTitle>Results</CardTitle>
                        <CardDescription>Calculated circulation, duties, and loading.</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-78px)]">
                        <ResultsDisplay results={amineResults} processType="amine" />
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              <TabsContent value="teg-dehydration" className="mt-4 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col">
                    <Card className="bg-slate-800/50 border-slate-700 flex-grow">
                      <CardHeader>
                        <CardTitle>TEG Dehydration Inputs</CardTitle>
                        <CardDescription>Provide gas conditions and glycol system parameters.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TegDehydrationInputs />
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col">
                    <Card className="bg-slate-800/50 border-slate-700 flex-grow">
                      <CardHeader>
                        <CardTitle>Results</CardTitle>
                        <CardDescription>Calculated circulation rate and reboiler duty.</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-78px)]">
                        <ResultsDisplay results={tegResults} processType="teg" />
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      );
    };

    export default GasTreatingDehydration;