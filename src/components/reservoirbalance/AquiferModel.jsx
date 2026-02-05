import React, { useState } from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Cpu, Droplets, BarChart2, Info } from 'lucide-react';
    import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import { aquiferCalculations } from '@/utils/aquiferCalculations';

    const defaultFetkovichParams = {
      raReRatio: 5,
      theta: 180,
      aquiferPerm: 50,
      wei: 1e9,
    };

    const defaultCarterTracyParams = {
      raReRatio: 5,
      theta: 180,
      aquiferPerm: 50,
      aquiferThickness: 50,
      aquiferPorosity: 0.2,
    };

    const AquiferModel = ({ pressureData, pvtData, onResultsChange, aquiferResults }) => {
      const { toast } = useToast();
      const [modelType, setModelType] = useState('fetkovich');
      const [fetkovichParams, setFetkovichParams] = useState(defaultFetkovichParams);
      const [carterTracyParams, setCarterTracyParams] = useState(defaultCarterTracyParams);
      const [isLoading, setIsLoading] = useState(false);

      const handleRunModel = () => {
        if (!pressureData || !pvtData?.inputs) {
          toast({
            title: 'Missing Data',
            description: 'Please ensure Pressure and PVT data are provided.',
            variant: 'destructive',
          });
          return;
        }

        setIsLoading(true);
        setTimeout(() => {
          try {
            const params = modelType === 'fetkovich' ? fetkovichParams : carterTracyParams;
            const modelResults = aquiferCalculations({ modelType, params, pressureData, pvtData });
            onResultsChange(modelResults);
            toast({
              title: 'Aquifer Model Calculated',
              description: `Water influx calculated using the ${modelType} model.`,
            });
          } catch (error) {
            toast({
              title: 'Calculation Error',
              description: error.message,
              variant: 'destructive',
            });
          } finally {
            setIsLoading(false);
          }
        }, 500);
      };
      
      const handleParamChange = (model, key, value) => {
        const numValue = parseFloat(value);
        if (model === 'fetkovich') {
            setFetkovichParams(prev => ({...prev, [key]: numValue}));
        } else {
            setCarterTracyParams(prev => ({...prev, [key]: numValue}));
        }
      };

      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300">Aquifer Modeling</CardTitle>
              <CardDescription>Quantify water influx using analytical models.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={modelType} onValueChange={setModelType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fetkovich">Fetkovich</TabsTrigger>
                  <TabsTrigger value="carter-tracy">Carter-Tracy</TabsTrigger>
                </TabsList>
                <TabsContent value="fetkovich" className="mt-4 space-y-4">
                  <InputGroup label="Aquifer Size (ra/re)" id="ft-raReRatio" value={fetkovichParams.raReRatio} onChange={e => handleParamChange('fetkovich', 'raReRatio', e.target.value)} />
                  <InputGroup label="Encroachment Angle (°)" id="ft-theta" value={fetkovichParams.theta} onChange={e => handleParamChange('fetkovich', 'theta', e.target.value)} />
                  <InputGroup label="Aquifer Permeability (mD)" id="ft-aquiferPerm" value={fetkovichParams.aquiferPerm} onChange={e => handleParamChange('fetkovich', 'aquiferPerm', e.target.value)} />
                  <InputGroup label="Initial Aquifer Water (bbl)" id="ft-wei" value={fetkovichParams.wei} onChange={e => handleParamChange('fetkovich', 'wei', e.target.value)} />
                </TabsContent>
                <TabsContent value="carter-tracy" className="mt-4 space-y-4">
                  <InputGroup label="Aquifer Size (ra/re)" id="ct-raReRatio" value={carterTracyParams.raReRatio} onChange={e => handleParamChange('carter-tracy', 'raReRatio', e.target.value)} />
                  <InputGroup label="Encroachment Angle (°)" id="ct-theta" value={carterTracyParams.theta} onChange={e => handleParamChange('carter-tracy', 'theta', e.target.value)} />
                  <InputGroup label="Aquifer Permeability (mD)" id="ct-aquiferPerm" value={carterTracyParams.aquiferPerm} onChange={e => handleParamChange('carter-tracy', 'aquiferPerm', e.target.value)} />
                  <InputGroup label="Aquifer Thickness (ft)" id="ct-aquiferThickness" value={carterTracyParams.aquiferThickness} onChange={e => handleParamChange('carter-tracy', 'aquiferThickness', e.target.value)} />
                  <InputGroup label="Aquifer Porosity" id="ct-aquiferPorosity" value={carterTracyParams.aquiferPorosity} onChange={e => handleParamChange('carter-tracy', 'aquiferPorosity', e.target.value)} />
                </TabsContent>
              </Tabs>
              <Button onClick={handleRunModel} disabled={isLoading} className="mt-6 w-full">
                <Cpu className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Calculating...' : 'Run Aquifer Model'}
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300 flex items-center"><BarChart2 className="w-5 h-5 mr-2" /> Results: Water Influx</CardTitle>
            </CardHeader>
            <CardContent>
              {!aquiferResults ? (
                <Alert className="bg-slate-900/70 border-slate-600">
                  <Info className="h-4 w-4 text-sky-400" />
                  <AlertTitle className="text-white">Awaiting Calculation</AlertTitle>
                  <AlertDescription className="text-slate-400">
                    Configure the model parameters and click "Run Aquifer Model" to see the water influx calculation.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                <div className="mb-4">
                  <p className="text-sm text-slate-400">Cumulative Water Influx (We)</p>
                  <p className="text-2xl font-bold text-lime-300">{aquiferResults.cumulativeWe.toLocaleString(undefined, {maximumFractionDigits: 0})} bbl</p>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={aquiferResults.influxData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="days" name="Time" unit=" days" stroke="#94a3b8" />
                    <YAxis name="Water Influx" unit=" bbl" stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }}/>
                    <Line type="monotone" dataKey="We" stroke="#38bdf8" strokeWidth={2} name="Cumulative Water Influx" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    const InputGroup = ({ label, id, ...props }) => (
        <div className="space-y-2">
          <Label htmlFor={id} className="text-slate-300">{label}</Label>
          <Input id={id} {...props} type={props.type || "number"} className="bg-slate-900 border-slate-600 focus:ring-lime-500" />
        </div>
      );

    export default AquiferModel;