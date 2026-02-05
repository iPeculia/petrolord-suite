import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ComposedChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Download, RefreshCw, Play } from 'lucide-react';

const ContactForecastTab = () => {
  const { contactForecast, reservoirMetadata, runForecast } = useMaterialBalance();
  const [duration, setDuration] = useState(10);
  const [rate, setRate] = useState(5000);

  const handleRun = () => {
    runForecast({ years: duration, initialRate: rate, decline: 10 });
  };

  const chartData = contactForecast && contactForecast.length > 0 ? contactForecast : [];

  return (
    <div className="p-4 h-full overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        
        {/* LEFT COLUMN: SETTINGS & PARAMS (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-y-auto gap-4">
          
          <Card className="bg-slate-900 border-slate-800 shrink-0">
            <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
              <CardTitle className="text-xs font-bold text-slate-300 uppercase">Forecast Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Duration (Years)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="h-7 text-xs bg-slate-950 border-slate-700" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Production Rate (STB/d)</Label>
                <Input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="h-7 text-xs bg-slate-950 border-slate-700" />
              </div>
              <Button onClick={handleRun} className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-500 gap-2 mt-2">
                <Play className="w-3 h-3" /> Recalculate Contacts
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 flex-1">
            <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
              <CardTitle className="text-xs font-bold text-slate-300 uppercase">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Initial GOC</span>
                <span className="text-slate-200 font-mono">{reservoirMetadata.GOC0} ft</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-500">Initial OWC</span>
                <span className="text-slate-200 font-mono">{reservoirMetadata.OWC0} ft</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-500">Move Direction</span>
                <span className="text-green-400">OWC Rising</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* CENTER COLUMN: PLOTS (6/12) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col h-full min-h-0 overflow-hidden gap-4">
          
          <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col">
            <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <CardTitle className="text-xs font-bold text-slate-300 uppercase">Fluid Contacts vs Time</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                <Download className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" minTickGap={30} />
                    <YAxis reversed tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Depth (ft TVD)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
                    <Legend verticalAlign="top" height={36} iconSize={8} />
                    
                    <ReferenceLine y={reservoirMetadata.GOC0} stroke="#f87171" strokeDasharray="3 3" label="Init GOC" />
                    <ReferenceLine y={reservoirMetadata.OWC0} stroke="#60a5fa" strokeDasharray="3 3" label="Init OWC" />

                    <Line type="monotone" dataKey="GOC" stroke="#ef4444" strokeWidth={2} dot={false} name="Gas-Oil Contact" />
                    <Line type="monotone" dataKey="OWC" stroke="#3b82f6" strokeWidth={2} dot={false} name="Oil-Water Contact" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  Run forecast to generate contact movement data.
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: EVENTS & STATS (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-y-auto">
          <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
              <CardTitle className="text-xs font-bold text-slate-300 uppercase">Movement Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3 overflow-y-auto">
              {chartData.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">TOTAL OWC RISE</div>
                    <div className="text-lg font-mono text-blue-400">
                      {(reservoirMetadata.OWC0 - chartData[chartData.length-1].OWC).toFixed(1)} <span className="text-xs text-slate-500">ft</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">TOTAL GOC DROP</div>
                    <div className="text-lg font-mono text-red-400">
                      {(chartData[chartData.length-1].GOC - reservoirMetadata.GOC0).toFixed(1)} <span className="text-xs text-slate-500">ft</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Key Events</div>
                    <div className="text-[10px] text-slate-500 italic">No critical thresholds crossed.</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-600 text-xs pt-10">No data available.</div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ContactForecastTab;