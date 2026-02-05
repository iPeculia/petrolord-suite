import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, TrendingUp, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts';

const OptimizationPanel = ({ baseInputs, onApplyOptimized }) => {
  const [objective, setObjective] = useState('maximize_ooip');
  const [iterations, setIterations] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  // Mock optimization run
  const runOptimization = () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Simulate processing
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(current);
      
      if (current >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        generateResults();
      }
    }, 100);
  };

  const generateResults = () => {
    // Generate a Pareto frontier-like scatter plot data
    const scatterData = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 20 + 10, // Risk (Variance)
      y: Math.random() * 500 + 1000, // Reward (OOIP)
      z: Math.random() * 10, // Cost or other factor
      id: i
    })).sort((a, b) => a.x - b.x);

    // Identify "Optimal" point (High Reward, Low Risk)
    const optimal = {
      area: baseInputs.area?.p50 ? parseFloat(baseInputs.area.p50) * 1.15 : 1150,
      porosity: baseInputs.porosity_pct?.p50 ? parseFloat(baseInputs.porosity_pct.p50) * 1.05 : 22,
      sw: baseInputs.sw_pct?.p50 ? parseFloat(baseInputs.sw_pct.p50) * 0.95 : 28,
      improvement: 12.5,
      new_ooip: 145000000
    };

    setResults({
      scatterData,
      optimal
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Configuration Side */}
      <Card className="bg-slate-900/50 border-slate-800 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-lime-400" />
            Optimizer Config
          </CardTitle>
          <CardDescription>Define objective function and constraints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Objective Function</Label>
            <Select value={objective} onValueChange={setObjective}>
              <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="maximize_ooip">Maximize OOIP (P50)</SelectItem>
                <SelectItem value="minimize_risk">Minimize Uncertainty Range (P10-P90)</SelectItem>
                <SelectItem value="maximize_eur">Maximize Recoverable Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
             <Label>Constraints</Label>
             <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3 text-sm">
                 <div className="flex justify-between items-center">
                     <span className="text-slate-400">Porosity Max</span>
                     <div className="flex items-center gap-2">
                         <Input className="w-16 h-6 text-xs bg-slate-900" defaultValue="28" />
                         <span className="text-xs text-slate-500">%</span>
                     </div>
                 </div>
                 <div className="flex justify-between items-center">
                     <span className="text-slate-400">Sw Min</span>
                     <div className="flex items-center gap-2">
                         <Input className="w-16 h-6 text-xs bg-slate-900" defaultValue="15" />
                         <span className="text-xs text-slate-500">%</span>
                     </div>
                 </div>
                 <div className="flex justify-between items-center">
                     <span className="text-slate-400">Area Limit</span>
                     <div className="flex items-center gap-2">
                         <Input className="w-16 h-6 text-xs bg-slate-900" defaultValue="1500" />
                         <span className="text-xs text-slate-500">ac</span>
                     </div>
                 </div>
             </div>
          </div>

          <div className="space-y-2">
             <Label>Algorithm Iterations</Label>
             <div className="flex items-center gap-4">
                 <Slider 
                    value={[iterations]} 
                    onValueChange={(v) => setIterations(v[0])} 
                    min={100} max={5000} step={100} 
                    className="flex-1"
                 />
                 <span className="text-xs font-mono text-slate-400 w-12">{iterations}</span>
             </div>
          </div>

          <Button 
            onClick={runOptimization} 
            disabled={isRunning} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isRunning ? 'Optimizing...' : 'Run Optimization'}
          </Button>

          {isRunning && (
              <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
              </div>
          )}
        </CardContent>
      </Card>

      {/* Results Visualization */}
      <Card className="bg-slate-900/50 border-slate-800 lg:col-span-2 flex flex-col">
        <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>Optimization Landscape</span>
                {results && <Badge variant="outline" className="bg-lime-500/10 text-lime-400 border-lime-500/50">Converged</Badge>}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] flex flex-col">
            {!results ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-2 border-2 border-dashed border-slate-800 rounded-lg">
                    <TrendingUp className="w-10 h-10 opacity-20" />
                    <p>Run optimization to view solution space</p>
                </div>
            ) : (
                <div className="space-y-6 h-full flex flex-col">
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" dataKey="x" name="Risk" stroke="#94a3b8" label={{ value: 'Risk (Variance)', position: 'bottom', fill: '#94a3b8' }} />
                                <YAxis type="number" dataKey="y" name="Reward" stroke="#94a3b8" label={{ value: 'OOIP (MMbbl)', angle: -90, position: 'left', fill: '#94a3b8' }} />
                                <ZAxis type="number" dataKey="z" range={[20, 200]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Scatter name="Scenarios" data={results.scatterData} fill="#8884d8" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-300 mb-1">Optimal Configuration Found</p>
                            <div className="flex gap-4 text-xs text-slate-400">
                                <span>Area: <span className="text-white">{results.optimal.area.toFixed(0)}</span></span>
                                <span>Phi: <span className="text-white">{results.optimal.porosity.toFixed(1)}%</span></span>
                                <span>Sw: <span className="text-white">{results.optimal.sw.toFixed(1)}%</span></span>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-lg font-bold text-lime-400">+{results.optimal.improvement}%</p>
                             <p className="text-[10px] text-slate-500 uppercase tracking-wider">Vs Base Case</p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => onApplyOptimized(results.optimal)}>
                            Apply Parameters
                        </Button>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationPanel;