import React, { useState, useEffect } from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Cpu, TrendingUp, BarChart2, Info } from 'lucide-react';
    import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import { dcaCalculations } from '@/utils/dcaCalculations';

    const defaultParams = {
      model: 'hyperbolic',
      qi: 1000,
      di: 0.1, // nominal/year
      b: 0.5,
      econLimit: 10,
      forecastYears: 10,
    };

    const ForecastScenarios = ({ productionData, mbalResults, onResultsChange, forecastResults }) => {
      const { toast } = useToast();
      const [params, setParams] = useState(defaultParams);
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        if (productionData && productionData.length > 1) {
          const lastProd = productionData[productionData.length - 1];
          const secondLastProd = productionData[productionData.length - 2];
          
          if (lastProd && secondLastProd && lastProd.oil && secondLastProd.oil) {
              const qi = parseFloat(lastProd.oil);
              const decline = (parseFloat(secondLastProd.oil) - qi) / parseFloat(secondLastProd.oil);
              const di = decline * 12; // Annualized

              setParams(prev => ({
                  ...prev,
                  qi: isNaN(qi) ? 1000 : qi,
                  di: isNaN(di) || di < 0 ? 0.1 : di,
              }));
          }
        }
      }, [productionData]);

      const handleRunModel = () => {
        if (!productionData || !mbalResults) {
          toast({
            title: 'Missing Data',
            description: 'Please provide Production Data and run Material Balance first.',
            variant: 'destructive',
          });
          return;
        }

        setIsLoading(true);
        setTimeout(() => {
          try {
            const results = dcaCalculations({ params, productionData, mbalResults });
            onResultsChange(results);
            toast({
              title: 'Forecast Generated',
              description: 'Production forecast and scenarios have been calculated.',
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
      
      const handleParamChange = (key, value) => {
        const numValue = parseFloat(value);
        setParams(prev => ({...prev, [key]: key === 'model' ? value : numValue}));
      };
      
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300">Forecast & Scenarios</CardTitle>
              <CardDescription>Generate decline curve analysis forecasts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <div><Label>Decline Model</Label><Select value={params.model} onValueChange={(v) => setParams(p => ({...p, model: v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="exponential">Exponential</SelectItem><SelectItem value="hyperbolic">Hyperbolic</SelectItem><SelectItem value="harmonic">Harmonic</SelectItem></SelectContent></Select></div>
                  <InputGroup label="Initial Rate (qi, bbl/d)" id="qi" value={params.qi} onChange={e => handleParamChange('qi', e.target.value)} />
                  <InputGroup label="Decline Rate (Di, nominal/year)" id="di" value={params.di} onChange={e => handleParamChange('di', e.target.value)} />
                  {params.model === 'hyperbolic' && <InputGroup label="b-exponent" id="b" value={params.b} onChange={e => handleParamChange('b', e.target.value)} />}
                  <InputGroup label="Economic Limit (bbl/d)" id="econLimit" value={params.econLimit} onChange={e => handleParamChange('econLimit', e.target.value)} />
                  <InputGroup label="Forecast Period (years)" id="forecastYears" value={params.forecastYears} onChange={e => handleParamChange('forecastYears', e.target.value)} />
              </div>
              <Button onClick={handleRunModel} disabled={isLoading} className="mt-6 w-full">
                <Cpu className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Calculating...' : 'Run Forecast'}
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300 flex items-center"><BarChart2 className="w-5 h-5 mr-2" /> Results: Production Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {!forecastResults ? (
                <Alert className="bg-slate-900/70 border-slate-600">
                  <Info className="h-4 w-4 text-sky-400" />
                  <AlertTitle className="text-white">Awaiting Calculation</AlertTitle>
                  <AlertDescription className="text-slate-400">
                    Configure forecast parameters and click "Run Forecast". Requires historical data and MBAL results.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <MetricCard title="EUR (P50)" value={`${(forecastResults.p50.eur / 1e6).toFixed(2)} MMbbl`} />
                    <MetricCard title="Time to Limit" value={`${forecastResults.p50.timeToLimit.toFixed(1)} years`} />
                    <MetricCard title="Remaining (P50)" value={`${(forecastResults.p50.remaining / 1e6).toFixed(2)} MMbbl`} />
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={forecastResults.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" name="Date" stroke="#94a3b8" />
                    <YAxis name="Rate (bbl/d)" stroke="#94a3b8" type="logarithmic" domain={['auto', 'auto']} allowDataOverflow />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }}/>
                    <Line type="monotone" dataKey="history" stroke="#a3e635" strokeWidth={2} name="History" dot={false} />
                    <Line type="monotone" dataKey="p10" stroke="#f87171" strokeDasharray="5 5" name="P10 Forecast" dot={false} />
                    <Line type="monotone" dataKey="p50" stroke="#38bdf8" strokeWidth={2} name="P50 Forecast" dot={false} />
                    <Line type="monotone" dataKey="p90" stroke="#facc15" strokeDasharray="5 5" name="P90 Forecast" dot={false} />
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
          <Input id={id} {...props} type={props.type || "number"} step={props.step || "0.01"} className="bg-slate-900 border-slate-600 focus:ring-lime-500" />
        </div>
      );

    const MetricCard = ({ title, value }) => (
        <Card className="bg-slate-900 border-slate-700 p-4">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-xl font-bold text-lime-300">{value}</p>
        </Card>
    );

    export default ForecastScenarios;