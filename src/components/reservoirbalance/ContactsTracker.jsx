import React, { useState, useEffect } from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Cpu, BarChart2, Info } from 'lucide-react';
    import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
    import { contactsCalculations } from '@/utils/contactsCalculations';

    const defaultParams = {
      initialOwc: 8500,
      initialGoc: 8000,
      area: 1000, 
      netPay: 100,
      swi: 0.2,
      cf: 4e-6,
      cw: 3e-6,
      bob: 1.25,
    };

    const ContactsTracker = ({ mbalResults, pvtData, onResultsChange, contactsResults }) => {
      const { toast } = useToast();
      const [params, setParams] = useState(defaultParams);
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        if (pvtData?.inputs) {
            setParams(prev => ({
                ...prev,
                swi: pvtData.inputs.swi ?? prev.swi,
                cf: pvtData.inputs.rock?.cf ?? prev.cf,
                cw: pvtData.inputs.water?.cw ?? prev.cw,
                bob: pvtData.inputs.oil?.bob ?? prev.bob,
            }));
        }
      }, [pvtData]);

      const handleRunModel = () => {
        if (!mbalResults) {
          toast({
            title: 'Missing Data',
            description: 'Please run Material Balance first.',
            variant: 'destructive',
          });
          return;
        }

        setIsLoading(true);
        setTimeout(() => {
          try {
            const results = contactsCalculations({ params, mbalResults });
            onResultsChange(results);
            toast({
              title: 'Contacts Tracker Updated',
              description: 'GOC and OWC movement has been calculated.',
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
        setParams(prev => ({...prev, [key]: numValue}));
      };

      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300">Contacts Tracker</CardTitle>
              <CardDescription>Monitor the movement of oil-water and gas-oil contacts over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InputGroup label="Initial OWC (ft)" id="initialOwc" value={params.initialOwc} onChange={e => handleParamChange('initialOwc', e.target.value)} />
                <InputGroup label="Initial GOC (ft)" id="initialGoc" value={params.initialGoc} onChange={e => handleParamChange('initialGoc', e.target.value)} />
                <InputGroup label="Reservoir Area (acres)" id="area" value={params.area} onChange={e => handleParamChange('area', e.target.value)} />
                <InputGroup label="Average Net Pay (ft)" id="netPay" value={params.netPay} onChange={e => handleParamChange('netPay', e.target.value)} />
                <InputGroup label="Initial Water Saturation (Swi)" id="swi" value={params.swi} onChange={e => handleParamChange('swi', e.target.value)} step="0.01" />
                <InputGroup label="Rock Compressibility (cf, 1/psi)" id="cf" value={params.cf} onChange={e => handleParamChange('cf', e.target.value)} type="number" step="1e-7" />
                <InputGroup label="Water Compressibility (cw, 1/psi)" id="cw" value={params.cw} onChange={e => handleParamChange('cw', e.target.value)} type="number" step="1e-7" />
                <InputGroup label="Bo @ Bubble Point (rb/stb)" id="bob" value={params.bob} onChange={e => handleParamChange('bob', e.target.value)} step="0.01" />
              </div>
              <Button onClick={handleRunModel} disabled={isLoading} className="mt-6 w-full">
                <Cpu className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Calculating...' : 'Track Contacts'}
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lime-300 flex items-center"><BarChart2 className="w-5 h-5 mr-2" /> Results: Contact Movement</CardTitle>
            </CardHeader>
            <CardContent>
              {!contactsResults ? (
                <Alert className="bg-slate-900/70 border-slate-600">
                  <Info className="h-4 w-4 text-sky-400" />
                  <AlertTitle className="text-white">Awaiting Calculation</AlertTitle>
                  <AlertDescription className="text-slate-400">
                    Configure all parameters, then click "Track Contacts". This requires results from the Material Balance tab.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <MetricCard title="Current OWC" value={`${contactsResults.currentOwc.toFixed(0)} ft`} />
                    <MetricCard title="Current GOC" value={`${contactsResults.currentGoc.toFixed(0)} ft`} />
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={contactsResults.contactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="days" name="Time" unit=" days" stroke="#94a3b8" />
                    <YAxis name="Depth (ft)" stroke="#94a3b8" domain={['dataMin - 100', 'dataMax + 100']} reversed={true} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ color: '#e2e8f0' }}/>
                    <Line type="monotone" dataKey="owc" stroke="#38bdf8" strokeWidth={2} name="OWC" dot={false} />
                    <Line type="monotone" dataKey="goc" stroke="#f87171" strokeWidth={2} name="GOC" dot={false} />
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

    const MetricCard = ({ title, value }) => (
        <Card className="bg-slate-900 border-slate-700 p-4">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-lime-300">{value}</p>
        </Card>
    );

    export default ContactsTracker;