import React, { useState } from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { AlertCircle, TrendingDown, Shield, Eye, AlertTriangle } from 'lucide-react';
import WellboreSchematic from './WellboreSchematic';

const WearProfileTab = () => {
  const { 
    wearProfile, 
    conservativeMultiplier, 
    setConservativeMultiplier
  } = useCasingWearAnalyzer();

  const [showSchematic, setShowSchematic] = useState(false);

  if (!wearProfile?.profile?.length) {
    return <div className="text-center text-slate-500 py-20">Run a calculation to see the wear profile.</div>;
  }

  const { profile, summary, originalWallThickness_mm, controllingDepths } = wearProfile;

  const summaryCards = [
    { 
        title: "Max Wear Depth", 
        value: `${(summary?.maxWearDepth?.wear || 0).toFixed(2)} mm`, 
        depth: `@ ${summary?.maxWearDepth?.depth || 0}m`, 
        Icon: TrendingDown, 
        color: (summary?.maxWearDepth?.wear || 0) > 5 ? 'text-red-500' : (summary?.maxWearDepth?.wear || 0) > 2 ? 'text-amber-500' : 'text-emerald-500' 
    },
    { 
        title: "Min Wall Thickness", 
        value: `${(summary?.minRemainingWT?.wt || 0).toFixed(2)} mm`, 
        depth: `@ ${summary?.minRemainingWT?.depth || 0}m`, 
        Icon: AlertCircle, 
        color: (summary?.minRemainingWT?.wt || 0) / (originalWallThickness_mm || 1) < 0.5 ? 'text-red-500' : (summary?.minRemainingWT?.wt || 0) / (originalWallThickness_mm || 1) < 0.75 ? 'text-amber-500' : 'text-emerald-500' 
    },
    { 
        title: "Min Burst SF", 
        value: (summary?.minBurstSF?.sf || 0).toFixed(2), 
        depth: `@ ${summary?.minBurstSF?.depth || 0}m`, 
        Icon: Shield, 
        color: (summary?.minBurstSF?.sf || 0) < 1.0 ? 'text-red-500' : (summary?.minBurstSF?.sf || 0) < 1.5 ? 'text-amber-500' : 'text-emerald-500' 
    },
    { 
        title: "Min Collapse SF", 
        value: (summary?.minCollapseSF?.sf || 0).toFixed(2), 
        depth: `@ ${summary?.minCollapseSF?.depth || 0}m`, 
        Icon: Shield, 
        color: (summary?.minCollapseSF?.sf || 0) < 1.0 ? 'text-red-500' : (summary?.minCollapseSF?.sf || 0) < 1.5 ? 'text-amber-500' : 'text-emerald-500' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch id="conservative-mode" checked={conservativeMultiplier > 1.0} onCheckedChange={(checked) => setConservativeMultiplier(checked ? 1.5 : 1.0)} />
              <Label htmlFor="conservative-mode" className="text-slate-300 font-medium">Conservative Mode</Label>
            </div>
            {conservativeMultiplier > 1.0 && (
              <div className="flex items-center space-x-3 w-48">
                <Slider value={[conservativeMultiplier]} onValueChange={([val]) => setConservativeMultiplier(val)} min={1.0} max={2.0} step={0.1} />
                <span className="text-amber-400 font-mono text-sm font-bold">{conservativeMultiplier.toFixed(1)}x</span>
              </div>
            )}
        </div>
         <div className="flex items-center space-x-2">
            <Label htmlFor="show-schematic" className="text-slate-300 text-sm flex items-center cursor-pointer"><Eye className="w-4 h-4 mr-2" />Show Wellbore Schematic</Label>
            <Switch id="show-schematic" checked={showSchematic} onCheckedChange={setShowSchematic} />
        </div>
      </div>
      
      {showSchematic && <WellboreSchematic />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <Card key={card.title} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-slate-400">{card.title}</CardTitle>
              <card.Icon className={`w-4 h-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <p className="text-xs text-slate-500 mt-1">{card.depth}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 border-b border-slate-800/50"><CardTitle className="text-sm">Wall Thickness Profile</CardTitle></CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer>
              <LineChart data={profile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="depth" unit="m" fontSize={10} stroke="#94a3b8" />
                <YAxis unit="mm" domain={['dataMin - 1', 'dataMax + 1']} fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend />
                <Line type="monotone" dataKey={() => originalWallThickness_mm} name="Original WT" stroke="#FFC107" strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="remainingWT_mm" name="Remaining WT" stroke="#4CAF50" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 border-b border-slate-800/50"><CardTitle className="text-sm">Cumulative Wear Depth</CardTitle></CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer>
              <LineChart data={profile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="depth" unit="m" fontSize={10} stroke="#94a3b8" />
                <YAxis unit="mm" fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend />
                <Line type="monotone" dataKey="wearDepth_mm" name="Wear Depth" stroke="#FF6B6B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader className="pb-2 border-b border-slate-800/50"><CardTitle className="text-sm">Safety Factor Analysis</CardTitle></CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer>
              <ComposedChart data={profile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="depth" unit="m" fontSize={10} stroke="#94a3b8" />
                <YAxis domain={[0, 'dataMax + 1']} fontSize={10} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend />
                <ReferenceLine y={1.0} label={{ value: "Limit (1.0)", position: "insideTopLeft", fill:"#ef4444", fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
                <ReferenceLine y={1.25} label={{ value: "Target (1.25)", position: "insideTopLeft", fill:"#22c55e", fontSize: 10 }} stroke="#22c55e" strokeDasharray="3 3" />
                <Area type="monotone" yAxisId={0} dataKey="originalBurstSF" fill="#2196F3" stroke="#2196F3" name="Original Burst SF" fillOpacity={0.1} />
                <Line type="monotone" dataKey="wornBurstSF" name="Worn Burst SF" stroke="#FF9800" strokeWidth={2} dot={false} />
                <Area type="monotone" yAxisId={0} dataKey="originalCollapseSF" fill="#00BCD4" stroke="#00BCD4" name="Original Collapse SF" fillOpacity={0.1} />
                <Line type="monotone" dataKey="wornCollapseSF" name="Worn Collapse SF" stroke="#FF6B6B" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Controlling Depths Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2 border-b border-slate-800/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
            Controlling Depths
          </CardTitle>
          <span className="text-xs text-slate-500">Top 10 Critical Points</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-slate-400">Depth (m)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Critical Reason</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Rem. WT (mm)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Wear (mm)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Burst SF</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Collapse SF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controllingDepths && controllingDepths.length > 0 ? (
                controllingDepths.map((point, idx) => (
                  <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-xs font-mono text-slate-300">{(point.depth || 0).toFixed(0)}</TableCell>
                    <TableCell className="text-xs text-amber-400">{point.reason}</TableCell>
                    <TableCell className="text-xs font-mono">{(point.remainingWT_mm || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-xs font-mono">{(point.wearDepth_mm || 0).toFixed(2)}</TableCell>
                    <TableCell className={`text-xs font-mono font-bold ${point.wornBurstSF < 1.25 ? 'text-red-400' : 'text-emerald-400'}`}>{(point.wornBurstSF || 0).toFixed(2)}</TableCell>
                    <TableCell className={`text-xs font-mono font-bold ${point.wornCollapseSF < 1.25 ? 'text-red-400' : 'text-emerald-400'}`}>{(point.wornCollapseSF || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-xs text-slate-500">No critical depths found below safety thresholds.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WearProfileTab;