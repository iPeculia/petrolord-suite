import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileJson, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const ResultsPanel = ({ results }) => {
  const { profile, statistics, layers } = results;

  const downloadCSV = () => {
    const headers = ['Depth (m)', 'TWT (ms)', 'Interval Velocity (m/s)'];
    const rows = profile.map(p => [p.depth, p.time.toFixed(2), p.velocity]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'velocity_model.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <Card className="flex flex-col h-full bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Model Results</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadCSV} className="border-slate-700 hover:bg-slate-800 text-slate-300">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <Tabs defaultValue="charts" className="h-full flex flex-col">
          <TabsList className="bg-slate-950/50 w-fit">
            <TabsTrigger value="charts">Velocity Plots</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="flex-1 min-h-0 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Depth vs Velocity Plot */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col">
                <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">Interval Velocity vs Depth</h4>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profile} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" dataKey="velocity" stroke="#94a3b8" label={{ value: 'Velocity (m/s)', position: 'bottom', fill: '#94a3b8' }} domain={['auto', 'auto']} />
                        <YAxis type="number" dataKey="depth" stroke="#94a3b8" reversed label={{ value: 'Depth (m)', angle: -90, position: 'left', fill: '#94a3b8' }} />
                        <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value) => [value, 'Velocity']}
                        labelFormatter={(value) => `Depth: ${value}m`}
                        />
                        <Line type="stepAfter" dataKey="velocity" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>

              {/* Time vs Depth Plot */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col">
                <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">Time-Depth Curve</h4>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profile} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" dataKey="time" stroke="#94a3b8" orientation="top" label={{ value: 'TWT (ms)', position: 'top', fill: '#94a3b8' }} />
                        <YAxis type="number" dataKey="depth" stroke="#94a3b8" reversed label={{ value: 'Depth (m)', angle: -90, position: 'left', fill: '#94a3b8' }} />
                        <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(value) => [value.toFixed(2), 'TWT (ms)']}
                        labelFormatter={(value) => `Depth: ${value}m`}
                        />
                        <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="flex-1 min-h-0 mt-4 overflow-auto">
             <div className="rounded-md border border-slate-800">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs uppercase bg-slate-900 text-slate-400 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Depth (m)</th>
                            <th className="px-6 py-3">TWT (ms)</th>
                            <th className="px-6 py-3">Interval Vel (m/s)</th>
                            <th className="px-6 py-3">Layer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profile.map((point, index) => {
                            // Find which layer this point belongs to based on depth
                            const layer = layers.find(l => point.depth > parseFloat(l.topDepth) && point.depth <= parseFloat(l.bottomDepth));
                            return (
                                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                                    <td className="px-6 py-2 font-mono">{point.depth}</td>
                                    <td className="px-6 py-2 font-mono text-blue-400">{point.time.toFixed(2)}</td>
                                    <td className="px-6 py-2 font-mono text-emerald-400">{point.velocity.toFixed(0)}</td>
                                    <td className="px-6 py-2">{layer ? layer.name : 'Datum'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
             </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800 border-slate-700 p-6 flex flex-col items-center justify-center">
                    <div className="text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Max Depth</div>
                    <div className="text-3xl font-bold text-white">{statistics.maxDepth} <span className="text-base font-normal text-slate-500">m</span></div>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-6 flex flex-col items-center justify-center">
                    <div className="text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Total TWT</div>
                    <div className="text-3xl font-bold text-blue-400">{statistics.maxTime.toFixed(2)} <span className="text-base font-normal text-slate-500">ms</span></div>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-6 flex flex-col items-center justify-center">
                    <div className="text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Avg Velocity</div>
                    <div className="text-3xl font-bold text-emerald-400">{statistics.averageVelocity.toFixed(0)} <span className="text-base font-normal text-slate-500">m/s</span></div>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default ResultsPanel;