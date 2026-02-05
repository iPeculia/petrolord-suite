import React from 'react';
    import { motion } from 'framer-motion';
    import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
    import { AlertTriangle, Download, Save, TrendingDown, Thermometer } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const PressurePlot = ({ data, events }) => {
      const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-slate-800/80 p-4 border border-cyan-400/50 rounded-lg text-sm text-white">
              <p className="label font-bold text-cyan-300">{`Depth: ${label.toFixed(0)} ft`}</p>
              {payload.map(p => (
                <p key={p.name} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(2)} ppg`}</p>
              ))}
            </div>
          );
        }
        return null;
      };

      const yDomain = data && data.length > 0
        ? [Math.floor(Math.min(...data.map(d => d.pp_p10_ppg || 22))), Math.ceil(Math.max(...data.map(d => d.obg_ppg || 0)))]
        : [8, 22];
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="tvd_ft" name="TVD" unit="ft" reversed={true} orientation="top"
              tick={{ fill: 'white', fontSize: 12 }} axisLine={{ stroke: 'white' }} tickLine={{ stroke: 'white' }} 
              domain={['dataMax', 0]}
              label={{ value: "TVD (ft)", position: "insideTopLeft", offset: -20, fill: "white" }} />
            <YAxis domain={yDomain} yAxisId="left" orientation="left"
              tick={{ fill: 'white', fontSize: 12 }} axisLine={{ stroke: 'white' }} tickLine={{ stroke: 'white' }}
              label={{ value: 'Gradient (ppg)', angle: -90, position: 'insideLeft', fill: 'white' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ bottom: 0 }} />

            <Area type="monotone" dataKey="pp_p90_ppg" stackId="pp" stroke={false} fill="rgba(96, 165, 250, 0.1)" name="PP P10/P90" />
            <Area type="monotone" dataKey="pp_p50_ppg" stackId="pp" name="PP P50" stroke="#60a5fa" fill="rgba(96, 165, 250, 0.3)" />
            <Area type="monotone" dataKey="pp_p10_ppg" stackId="pp" stroke={false} fill="rgba(96, 165, 250, 0.1)" />
            
            <Area type="monotone" dataKey="fg_p90_ppg" stackId="fg" stroke={false} fill="rgba(251, 113, 133, 0.1)" name="FG P10/P90" />
            <Area type="monotone" dataKey="fg_p50_ppg" stackId="fg" name="FG P50" stroke="#fb7185" fill="rgba(251, 113, 133, 0.3)" />
            <Area type="monotone" dataKey="fg_p10_ppg" stackId="fg" stroke={false} fill="rgba(251, 113, 133, 0.1)" />

            <Line type="monotone" dataKey="obg_ppg" name="OBG" stroke="#a5b4fc" strokeDasharray="5 5" dot={false} />
            
            <Area type="monotone" dataKey="window_ppg" name="Safe Window" fill="rgba(74, 222, 128, 0.2)" stroke="rgba(74, 222, 128, 0.5)" stackId="window" />

          </AreaChart>
        </ResponsiveContainer>
      );
    };

    const ResultsPanel = ({ analysisResult }) => {
      const { toast } = useToast();

      if (!analysisResult) {
        return null;
      }
      const { summary, plotData } = analysisResult;

      const handleExport = (type) => {
          if (type === 'csv') {
              const headers = Object.keys(plotData[0]).join(',');
              const rows = plotData.map(row => Object.values(row).join(','));
              const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "ppfg_analysis.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } else {
            toast({
                title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
            });
          }
      }

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/60 border-cyan-400/30 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-300">Min. Mud Weight Window</CardTitle>
                <TrendingDown className="h-4 w-4 text-cyan-300" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.min_window_ppg.toFixed(2)} ppg</div>
                <p className="text-xs text-slate-400">at {summary.min_window_depth_ft.toFixed(0)} ft</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/60 border-yellow-400/30 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-300">Hazards Identified</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-300" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary.depths_of_risk.length}</div>
                <p className="text-xs text-slate-400">Depths with window &lt; 1.0 ppg</p>
              </CardContent>
            </Card>
             <Card className="bg-slate-800/60 border-indigo-400/30 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-300">Max Pore Pressure</CardTitle>
                <Thermometer className="h-4 w-4 text-indigo-300" />
              </CardHeader>
              <CardContent>
                 <div className="text-3xl font-bold">{Math.max(...plotData.map(p => p.pp_p50_ppg)).toFixed(2)} ppg</div>
                 <p className="text-xs text-slate-400">P50 maximum value in section</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-4 h-[500px]">
            <PressurePlot data={plotData} />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Hazard Summary</CardTitle>
                </CardHeader>
                <CardContent className="h-48 overflow-y-auto">
                    <div className="space-y-3">
                        {summary.depths_of_risk.length > 0 ? summary.depths_of_risk.map((depth, i) => (
                            <div key={i} className="flex items-start space-x-3 text-yellow-300">
                                <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400"/>
                                <p className="text-sm">Window &lt; 1.0 ppg at {depth} ft. Consider raising mud weight.</p>
                            </div>
                        )) : <p className="text-green-300">No significant drilling hazards identified. The predicted drilling window is stable.</p>}
                    </div>
                </CardContent>
              </Card>
               <Card className="bg-slate-800/60 border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Data Table
                    <Button variant="ghost" size="sm" onClick={() => handleExport('csv')}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-48 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-slate-700/50">
                                <TableHead className="text-white">Depth (ft)</TableHead>
                                <TableHead className="text-white">OBG</TableHead>
                                <TableHead className="text-white">PP P50</TableHead>
                                <TableHead className="text-white">FG P50</TableHead>
                                <TableHead className="text-white">Window</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plotData.filter((_, i) => i % Math.ceil(plotData.length / 10) === 0).map(d => (
                                <TableRow key={d.tvd_ft} className="hover:bg-slate-700/50">
                                    <TableCell>{d.tvd_ft.toFixed(0)}</TableCell>
                                    <TableCell>{d.obg_ppg.toFixed(2)}</TableCell>
                                    <TableCell>{d.pp_p50_ppg.toFixed(2)}</TableCell>
                                    <TableCell>{d.fg_p50_ppg.toFixed(2)}</TableCell>
                                    <TableCell className={d.window_ppg < 1.0 ? 'text-yellow-400 font-bold' : ''}>{d.window_ppg.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
               </Card>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-end">
              <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => handleExport('save')}><Save className="w-4 h-4 mr-2"/>Save Run</Button>
              </div>
          </div>
        </motion.div>
      );
    };

    export default ResultsPanel;