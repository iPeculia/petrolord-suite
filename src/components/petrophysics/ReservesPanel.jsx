import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Coins, Play, Save, Trash2, Plus, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { calculateZonalStats, calculateVolumetrics } from '@/utils/petrophysicsCalculations';

const ReservesPanel = ({ petroState, onSaveReserves }) => {
  const { activeWellId, wells, markers, loading } = petroState;
  const activeWell = wells.find(w => w.id === activeWellId);

  const [zones, setZones] = useState([]);
  const [activeZone, setActiveZone] = useState({
      name: "New Zone",
      topMarker: null,
      baseMarker: null,
      topDepth: 0,
      baseDepth: 0,
      area: 640, // acres
      fluidType: 'oil',
      bo: 1.2,
      bg: 0.005,
      rf: 0.3,
      cutoffs: {
          vshMax: 0.4,
          phiMin: 0.08,
          swMax: 0.5
      }
  });

  const [calculatedResults, setCalculatedResults] = useState([]);

  // Derived list of markers for the active well
  const wellMarkers = useMemo(() => {
      return markers.filter(m => m.well_id === activeWellId).sort((a,b) => a.depth - b.depth);
  }, [markers, activeWellId]);

  const handleZoneParamChange = (key, value, nestedKey) => {
      if (nestedKey) {
          setActiveZone(prev => ({
              ...prev,
              [key]: { ...prev[key], [nestedKey]: value }
          }));
      } else {
          setActiveZone(prev => ({ ...prev, [key]: value }));
      }
  };

  const handleMarkerSelection = (type, markerName) => {
      const marker = wellMarkers.find(m => m.name === markerName);
      if (marker) {
          setActiveZone(prev => ({
              ...prev,
              [type === 'top' ? 'topMarker' : 'baseMarker']: markerName,
              [type === 'top' ? 'topDepth' : 'baseDepth']: marker.depth
          }));
      }
  };

  const handleCalculate = () => {
      if (!activeWell || !activeWell.data) return;
      
      // Calculate logic
      const stats = calculateZonalStats(
          activeWell.data, 
          activeWell.curveMap, 
          parseFloat(activeZone.topDepth), 
          parseFloat(activeZone.baseDepth), 
          activeZone.cutoffs,
          activeWell.statistics.step || 0.5
      );

      if (!stats) {
          // Handle error or empty
          return;
      }

      const volumes = calculateVolumetrics(stats, activeZone);

      const result = {
          id: crypto.randomUUID(),
          ...activeZone,
          stats,
          volumes,
          timestamp: new Date().toISOString()
      };

      setCalculatedResults(prev => [result, ...prev]);
  };

  const handleRemoveResult = (id) => {
      setCalculatedResults(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
        {/* Left: Input Configuration */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <Card className="bg-slate-950 border-slate-800 flex-1 flex flex-col">
                <CardHeader className="pb-2 border-b border-slate-800 bg-slate-900/50">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        Reserves Parameters
                    </CardTitle>
                </CardHeader>
                
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-5">
                        {/* Zone Definition */}
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-400 uppercase tracking-wider">Zone Definition</Label>
                            <div className="space-y-2">
                                <Label className="text-[10px] text-slate-500">Zone Name</Label>
                                <Input 
                                    value={activeZone.name} 
                                    onChange={e => handleZoneParamChange('name', e.target.value)}
                                    className="h-8 bg-slate-900 border-slate-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Top Marker</Label>
                                    <Select value={activeZone.topMarker || ''} onValueChange={v => handleMarkerSelection('top', v)}>
                                        <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wellMarkers.map(m => <SelectItem key={m.id} value={m.name}>{m.name} ({m.depth})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Base Marker</Label>
                                    <Select value={activeZone.baseMarker || ''} onValueChange={v => handleMarkerSelection('base', v)}>
                                        <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wellMarkers.map(m => <SelectItem key={m.id} value={m.name}>{m.name} ({m.depth})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input type="number" value={activeZone.topDepth} onChange={e => handleZoneParamChange('topDepth', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-800" placeholder="Top Depth" />
                                <Input type="number" value={activeZone.baseDepth} onChange={e => handleZoneParamChange('baseDepth', parseFloat(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-800" placeholder="Base Depth" />
                            </div>
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Reservoir Parameters */}
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-400 uppercase tracking-wider">Reservoir Inputs</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Area (Acres)</Label>
                                    <Input type="number" value={activeZone.area} onChange={e => handleZoneParamChange('area', parseFloat(e.target.value))} className="h-8 bg-slate-900 border-slate-700" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Fluid Type</Label>
                                    <Select value={activeZone.fluidType} onValueChange={v => handleZoneParamChange('fluidType', v)}>
                                        <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="oil">Oil</SelectItem>
                                            <SelectItem value="gas">Gas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">FVF ({activeZone.fluidType === 'oil' ? 'Bo' : 'Bg'})</Label>
                                    <Input 
                                        type="number" step="0.001"
                                        value={activeZone.fluidType === 'oil' ? activeZone.bo : activeZone.bg} 
                                        onChange={e => handleZoneParamChange(activeZone.fluidType === 'oil' ? 'bo' : 'bg', parseFloat(e.target.value))} 
                                        className="h-8 bg-slate-900 border-slate-700" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Recovery Factor</Label>
                                    <Input type="number" step="0.01" value={activeZone.rf} onChange={e => handleZoneParamChange('rf', parseFloat(e.target.value))} className="h-8 bg-slate-900 border-slate-700" />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Cutoffs */}
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-400 uppercase tracking-wider">Pay Cutoffs</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Max Vsh</Label>
                                    <Input type="number" step="0.05" value={activeZone.cutoffs.vshMax} onChange={e => handleZoneParamChange('cutoffs', parseFloat(e.target.value), 'vshMax')} className="h-8 bg-slate-900 border-slate-700" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Min Phi</Label>
                                    <Input type="number" step="0.01" value={activeZone.cutoffs.phiMin} onChange={e => handleZoneParamChange('cutoffs', parseFloat(e.target.value), 'phiMin')} className="h-8 bg-slate-900 border-slate-700" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] text-slate-500">Max Sw</Label>
                                    <Input type="number" step="0.05" value={activeZone.cutoffs.swMax} onChange={e => handleZoneParamChange('cutoffs', parseFloat(e.target.value), 'swMax')} className="h-8 bg-slate-900 border-slate-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <Button onClick={handleCalculate} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white">
                        <Play className="w-4 h-4 mr-2" /> Calculate Volumes
                    </Button>
                </div>
            </Card>
        </div>

        {/* Right: Results Dashboard */}
        <div className="flex-1 flex flex-col gap-4">
            <Card className="bg-slate-950 border-slate-800 flex-1 flex flex-col">
                <CardHeader className="pb-2 border-b border-slate-800 flex flex-row justify-between items-center">
                    <CardTitle className="text-sm font-bold text-white">Calculation Summary</CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-slate-700" 
                        onClick={() => onSaveReserves(calculatedResults)}
                        disabled={calculatedResults.length === 0}
                    >
                        <Save className="w-3 h-3 mr-2" /> Save All
                    </Button>
                </CardHeader>
                
                <div className="flex-1 overflow-auto">
                    {calculatedResults.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-xs text-slate-400">Zone</TableHead>
                                    <TableHead className="text-xs text-slate-400">Interval</TableHead>
                                    <TableHead className="text-xs text-slate-400">Net Pay (ft)</TableHead>
                                    <TableHead className="text-xs text-slate-400">Avg Phi</TableHead>
                                    <TableHead className="text-xs text-slate-400">Avg Sw</TableHead>
                                    <TableHead className="text-xs text-slate-400 text-right">STOIIP/GIIP</TableHead>
                                    <TableHead className="text-xs text-slate-400 text-right">Recoverable</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calculatedResults.map((res) => (
                                    <TableRow key={res.id} className="border-slate-800 hover:bg-slate-900/50">
                                        <TableCell className="font-medium text-slate-200">{res.name}</TableCell>
                                        <TableCell className="text-xs text-slate-400">
                                            {res.topDepth.toFixed(0)} - {res.baseDepth.toFixed(0)} ft
                                        </TableCell>
                                        <TableCell className="text-slate-300">{res.stats.payThickness.toFixed(1)}</TableCell>
                                        <TableCell className="text-slate-300">{(res.stats.avgPhi * 100).toFixed(1)}%</TableCell>
                                        <TableCell className="text-slate-300">{(res.stats.avgSw * 100).toFixed(1)}%</TableCell>
                                        <TableCell className="text-right text-yellow-400 font-mono">
                                            {res.fluidType === 'oil' 
                                                ? `${(res.volumes.ooip / 1e6).toFixed(2)} MMstb` 
                                                : `${(res.volumes.ogip / 1e9).toFixed(2)} Bscf`}
                                        </TableCell>
                                        <TableCell className="text-right text-green-400 font-mono font-bold">
                                            {res.fluidType === 'oil' 
                                                ? `${(res.volumes.reserves / 1e6).toFixed(2)} MMstb` 
                                                : `${(res.volumes.reserves / 1e9).toFixed(2)} Bscf`}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-600 hover:text-red-400" onClick={() => handleRemoveResult(res.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                            <p>No calculations yet.</p>
                            <p className="text-xs mt-1">Define a zone and click calculate.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 h-32 shrink-0">
                <Card className="bg-slate-900 border-slate-800 flex flex-col justify-center p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Net Pay</p>
                    <p className="text-2xl font-bold text-white">
                        {calculatedResults.reduce((sum, r) => sum + r.stats.payThickness, 0).toFixed(1)} <span className="text-sm font-normal text-slate-500">ft</span>
                    </p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 flex flex-col justify-center p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Oil Reserves</p>
                    <p className="text-2xl font-bold text-green-400">
                        {(calculatedResults.filter(r => r.fluidType === 'oil').reduce((sum, r) => sum + r.volumes.reserves, 0) / 1e6).toFixed(2)} <span className="text-sm font-normal text-slate-500">MMstb</span>
                    </p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 flex flex-col justify-center p-4">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Gas Reserves</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {(calculatedResults.filter(r => r.fluidType === 'gas').reduce((sum, r) => sum + r.volumes.reserves, 0) / 1e9).toFixed(2)} <span className="text-sm font-normal text-slate-500">Bscf</span>
                    </p>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default ReservesPanel;