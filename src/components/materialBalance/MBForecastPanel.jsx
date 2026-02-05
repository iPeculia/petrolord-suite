import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Play, Settings } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { useToast } from '@/components/ui/use-toast';

const MBForecastPanel = () => {
  const { runForecast, forecastData } = useMaterialBalance();
  const { toast } = useToast();
  
  const [duration, setDuration] = useState(5); // Years
  const [oilRate, setOilRate] = useState(5000); // STB/d
  const [declineRate, setDeclineRate] = useState(10); // % per year
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      // Simulate calc delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const schedule = {
        initialRate: parseFloat(oilRate),
        decline: parseFloat(declineRate) / 100,
        years: parseFloat(duration)
      };
      
      runForecast(schedule);
      toast({ title: "Forecast Complete", description: `Generated ${duration} year profile.`, variant: "success" });
    } catch (e) {
      toast({ title: "Forecast Error", description: "Failed to run forecast.", variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  const chartData = forecastData?.production || [];

  return (
    <div className="grid grid-rows-[auto_1fr] h-full gap-4">
      
      {/* Configuration Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
          <CardTitle className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
            <Settings className="w-3 h-3 text-blue-400" /> Forecast Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Duration (years)</Label>
              <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="h-8 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Init Rate (STB/d)</Label>
              <Input type="number" value={oilRate} onChange={e => setOilRate(e.target.value)} className="h-8 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-slate-400">Decline (%/yr)</Label>
              <Input type="number" value={declineRate} onChange={e => setDeclineRate(e.target.value)} className="h-8 text-xs bg-slate-950 border-slate-700" />
            </div>
            <Button onClick={handleRun} disabled={isRunning} className="h-8 text-xs bg-green-600 hover:bg-green-500 gap-2">
              <Play className="w-3 h-3 fill-current" /> {isRunning ? 'Running...' : 'Run Forecast'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Card */}
      <Card className="bg-slate-900 border-slate-800 flex flex-col min-h-0">
        <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
          <CardTitle className="text-xs font-bold text-slate-300 uppercase">Forecast Results</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-2 min-h-0">
          <Tabs defaultValue="rates" className="h-full flex flex-col">
            <TabsList className="h-8 mb-2 bg-slate-950 border border-slate-800 self-start">
              <TabsTrigger value="rates" className="text-[10px] h-6">Rates & Cumulatives</TabsTrigger>
              <TabsTrigger value="pressure" className="text-[10px] h-6">Pressure</TabsTrigger>
            </TabsList>

            <TabsContent value="rates" className="flex-1 min-h-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                    <YAxis yAxisId="left" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Rate (STB/d)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Cum (MMSTB)', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="qo" name="Oil Rate" stroke="#22c55e" dot={false} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="Np" name="Cum Oil" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">No forecast data available.</div>
              )}
            </TabsContent>

            <TabsContent value="pressure" className="flex-1 min-h-0">
               {forecastData?.pressure ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData.pressure}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
                    <YAxis tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                    <Line type="monotone" dataKey="pressure" name="Reservoir Pres" stroke="#f59e0b" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
               ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">No pressure forecast available.</div>
               )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MBForecastPanel;