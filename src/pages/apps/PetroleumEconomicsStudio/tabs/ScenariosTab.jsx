import React, { useState, useEffect, useMemo } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, Lock, Unlock, Trash2, Plus, MoreHorizontal, FileText, ArrowRightLeft, Check, PlayCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ScenariosTab = () => {
  const { scenarios, activeScenario, setActiveScenario, cloneScenario, deleteScenario, updateScenarioStatus, createScenario, fetchComparisonResults, comparisonData, modelSettings, calculateIncrementalMetrics } = usePetroleumEconomics();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'compare'
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [incrementalMode, setIncrementalMode] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('summary');

  const handleSelect = (id) => {
    setSelectedScenarios(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!newScenarioName) return;
    await createScenario(newScenarioName, 'New user scenario');
    setIsCreateOpen(false);
    setNewScenarioName('');
  };

  // When viewMode changes to 'compare', ensure we have detailed data
  useEffect(() => {
    if (viewMode === 'compare' && selectedScenarios.length > 0) {
      fetchComparisonResults(selectedScenarios);
    }
  }, [viewMode, selectedScenarios, fetchComparisonResults]);

  const formatCurrency = (val) => {
      if (val === undefined || val === null) return '-';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatMillions = (val) => {
      if (val === undefined || val === null) return '-';
      return (val / 1000000).toFixed(1) + ' MM';
  };

  const formatPercent = (val) => {
      if (val === undefined || val === null) return '-';
      return val.toFixed(1) + '%';
  };

  const formatDelta = (val, type = 'currency') => {
      if (val === undefined || val === null) return '-';
      const absVal = Math.abs(val);
      const prefix = val > 0 ? '+' : (val < 0 ? '-' : '');
      const colorClass = val > 0 ? 'text-emerald-400' : (val < 0 ? 'text-red-400' : 'text-slate-400');
      
      if (type === 'percent') {
          return <span className={colorClass}>{prefix}{absVal.toFixed(1)}%</span>;
      }
      if (type === 'points') {
          return <span className={colorClass}>{prefix}{absVal.toFixed(1)} pts</span>;
      }
      return <span className={colorClass}>{prefix}{formatCurrency(absVal)}</span>;
  };

  // Memoize Waterfall & Detailed Data Calculation
  const comparisonAnalytics = useMemo(() => {
      if (!comparisonData || selectedScenarios.length < 2) return {};
      
      const baseCase = scenarios.find(s => s.is_base_scenario && selectedScenarios.includes(s.id)) || scenarios.find(s => s.id === selectedScenarios[0]);
      if (!baseCase) return {};
      
      const baseResults = comparisonData[baseCase.id] || [];
      const baseMetrics = baseCase.metrics || {};

      const analytics = {};

      selectedScenarios.forEach(scenId => {
          if (scenId === baseCase.id) return;
          const scenObj = scenarios.find(s => s.id === scenId);
          const scenResults = comparisonData[scenId] || [];
          const scenMetrics = scenObj?.metrics || {};

          if (baseResults.length > 0 && scenResults.length > 0) {
              const calc = calculateIncrementalMetrics(baseResults, scenResults, baseMetrics, scenMetrics, modelSettings.discountRate);
              if (calc) {
                  analytics[scenId] = calc;
              }
          }
      });

      return { baseCase, analytics };
  }, [comparisonData, selectedScenarios, scenarios, modelSettings.discountRate, calculateIncrementalMetrics]);


  if (viewMode === 'compare') {
    const comparisonList = scenarios.filter(s => selectedScenarios.includes(s.id));
    const { baseCase, analytics } = comparisonAnalytics;
    
    // Sort so Base Case is first if present
    const sortedList = [...comparisonList].sort((a, b) => (a.id === baseCase?.id ? -1 : b.id === baseCase?.id ? 1 : 0));

    return (
      <div className="space-y-4 h-full flex flex-col animate-in fade-in duration-300">
        <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setViewMode('list')}>
                    <ArrowRightLeft className="w-4 h-4 mr-2" /> Back to List
                </Button>
                <div className="h-6 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                    <Switch checked={incrementalMode} onCheckedChange={setIncrementalMode} id="incremental-mode" />
                    <Label htmlFor="incremental-mode" className={cn("cursor-pointer", incrementalMode ? "text-blue-400 font-semibold" : "text-slate-400")}>
                        Incremental vs {baseCase?.name || 'Base'}
                    </Label>
                </div>
            </div>
            <h2 className="text-lg font-semibold text-white">Scenario Comparison</h2>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-6 overflow-auto pb-10">
                {/* 1. Main Metrics Table */}
                <Card className="bg-slate-900 border-slate-800">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="w-[200px] bg-slate-950 text-slate-400">Metric / Parameter</TableHead>
                                {sortedList.map(s => (
                                    <TableHead key={s.id} className={cn(
                                        "text-center min-w-[150px] bg-slate-950 font-bold border-l border-slate-800",
                                        s.id === baseCase?.id ? "text-blue-400" : "text-white"
                                    )}>
                                        <div className="flex flex-col items-center">
                                            <span>{s.name}</span>
                                            {s.id === baseCase?.id && <Badge variant="secondary" className="mt-1 text-[10px] h-4 bg-slate-800 text-blue-400">Base Case</Badge>}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <MetricRow 
                                label="NPV (10%)" 
                                scenarios={sortedList} 
                                baseId={baseCase?.id} 
                                incremental={incrementalMode} 
                                getValue={(s) => s.metrics?.npv} 
                                formatter={formatCurrency}
                                deltaFormatter={(val) => formatDelta(val)}
                            />
                            <MetricRow 
                                label="NPV % Change" 
                                scenarios={sortedList} 
                                baseId={baseCase?.id} 
                                incremental={incrementalMode} 
                                getValue={(s) => 0} // Dummy, calc happens in row logic mostly or simplified
                                // Custom delta logic for % change requires Base Value access which metric row handles
                                formatter={() => '-'}
                                isPercentageRow={true}
                                baseValueGetter={(s) => s.metrics?.npv}
                            />
                            <MetricRow 
                                label="IRR" 
                                scenarios={sortedList} 
                                baseId={baseCase?.id} 
                                incremental={incrementalMode} 
                                getValue={(s) => s.metrics?.irr} 
                                formatter={formatPercent}
                                deltaFormatter={(val) => formatDelta(val, 'points')}
                            />
                            <MetricRow 
                                label="DPI" 
                                scenarios={sortedList} 
                                baseId={baseCase?.id} 
                                incremental={incrementalMode} 
                                getValue={(s) => s.metrics?.dpi} 
                                formatter={(val) => val?.toFixed(2) + 'x'}
                                deltaFormatter={(val) => formatDelta(val, 'value') + 'x'}
                            />
                            <MetricRow 
                                label="Payback Year" 
                                scenarios={sortedList} 
                                baseId={baseCase?.id} 
                                incremental={incrementalMode} 
                                getValue={(s) => s.metrics?.payback_year} 
                                formatter={(val) => val || '-'}
                                deltaFormatter={(val) => <span className={val > 0 ? "text-red-400" : (val < 0 ? "text-emerald-400" : "text-slate-400")}>{val > 0 ? `+${val}` : val} yrs</span>} 
                            />
                            <TableRow className="bg-slate-900/50 hover:bg-slate-900/50">
                                <TableCell className="font-semibold text-slate-300 mt-4">Status</TableCell>
                                {sortedList.map(s => <TableCell key={s.id} className="border-l border-slate-800"></TableCell>)}
                            </TableRow>
                            <TableRow className="hover:bg-slate-800/50">
                                <TableCell className="text-slate-400 pl-6">State</TableCell>
                                {sortedList.map(s => (
                                    <TableCell key={s.id} className="text-center border-l border-slate-800">
                                        <Badge variant="outline" className="uppercase text-[10px]">{s.status || 'draft'}</Badge>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>

                {/* 2. Detailed Incremental Analysis */}
                {incrementalMode && analytics && (
                    <div className="space-y-6">
                        <Tabs defaultValue={Object.keys(analytics)[0]} className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-300">Analysis vs Base Case</h3>
                                <TabsList className="bg-slate-900 border border-slate-800">
                                    {sortedList.filter(s => s.id !== baseCase?.id && analytics[s.id]).map(s => (
                                        <TabsTrigger key={s.id} value={s.id} className="text-xs">{s.name}</TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {sortedList.filter(s => s.id !== baseCase?.id && analytics[s.id]).map(scenario => {
                                const data = analytics[scenario.id];
                                const waterfallData = data?.waterfallData || [];
                                const annualDeltas = data?.annualDeltas || [];
                                const kpis = data?.kpiDeltas || {};
                                
                                const npvDelta = kpis.npv;
                                const pctImprovement = kpis.npvPercent;

                                return (
                                    <TabsContent key={scenario.id} value={scenario.id} className="space-y-6 mt-0">
                                        
                                        {/* Summary & Waterfall */}
                                        <Card className="bg-slate-900 border-slate-800 p-4">
                                            <CardHeader className="pb-2 px-0">
                                                <div className="flex flex-col gap-1">
                                                    <CardTitle className="text-base text-slate-200">
                                                        Incremental Value Bridge
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {scenario.name} adds <span className={cn("font-bold font-mono", npvDelta >= 0 ? "text-emerald-400" : "text-red-400")}>
                                                            {formatCurrency(npvDelta)}
                                                        </span> NPV vs Base Case 
                                                        ({pctImprovement > 0 ? '+' : ''}{pctImprovement.toFixed(1)}% improvement).
                                                    </CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="px-0">
                                                <div className="h-[350px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
                                                            <Tooltip 
                                                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                                                                formatter={(value) => formatCurrency(value)}
                                                            />
                                                            <ReferenceLine y={0} stroke="#475569" />
                                                            <Bar dataKey="value">
                                                                {waterfallData.map((entry, index) => {
                                                                    // Logic: 
                                                                    // Gain = Green (Positive Revenue, Negative Cost)
                                                                    // Loss = Red (Negative Revenue, Positive Cost)
                                                                    // Total = Blue
                                                                    let color = '#3b82f6';
                                                                    if (entry.type === 'gain') color = '#10b981';
                                                                    if (entry.type === 'loss') color = '#ef4444';
                                                                    return <Cell key={`cell-${index}`} fill={color} />;
                                                                })}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex justify-center gap-6 mt-2 text-xs text-slate-400">
                                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Value Add</div>
                                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Value Erosion</div>
                                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Net Delta</div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Yearly Cashflow Deltas Table */}
                                        <Card className="bg-slate-900 border-slate-800">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base text-slate-200">Yearly Cashflow Deltas</CardTitle>
                                                <CardDescription>Detailed annual differences (Concept - Base)</CardDescription>
                                            </CardHeader>
                                            <div className="overflow-x-auto max-w-full p-4 pt-0">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                                            <TableHead className="text-left min-w-[100px] sticky left-0 bg-slate-900 z-10 text-slate-400">Component</TableHead>
                                                            {annualDeltas.map(row => (
                                                                <TableHead key={row.year} className="text-right min-w-[100px] text-slate-400 font-mono text-xs">{row.year}</TableHead>
                                                            ))}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {['grossRevenue', 'royalties', 'opex', 'capex', 'tax', 'netCashflow', 'cumulativeCashflow'].map(key => (
                                                            <TableRow key={key} className="hover:bg-slate-800/50 border-slate-800">
                                                                <TableCell className="font-medium text-slate-300 capitalize sticky left-0 bg-slate-900 z-10 border-r border-slate-800">
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                </TableCell>
                                                                {annualDeltas.map(row => (
                                                                    <TableCell key={row.year} className="text-right font-mono text-xs text-slate-300">
                                                                        {row[key] !== 0 ? (
                                                                            <span className={cn(
                                                                                // Color logic: 
                                                                                // For Revenue/Cashflow: Positive is Green.
                                                                                // For Costs/Tax: Positive is Red (Cost Increase).
                                                                                ['grossRevenue', 'netCashflow', 'cumulativeCashflow'].includes(key)
                                                                                    ? (row[key] > 0 ? "text-emerald-400" : "text-red-400")
                                                                                    : (row[key] > 0 ? "text-red-400" : "text-emerald-400") // Costs: reduction (neg) is green
                                                                            )}>
                                                                                {row[key] > 0 ? '+' : ''}{formatCurrency(row[key])}
                                                                            </span>
                                                                        ) : '-'}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Card>
                                    </TabsContent>
                                );
                            })}
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            {selectedScenarios.length > 1 && (
                <Button variant="secondary" onClick={() => setViewMode('compare')} className="bg-blue-600 hover:bg-blue-500 text-white">
                    Compare ({selectedScenarios.length})
                </Button>
            )}
            <span className="text-sm text-slate-500 ml-2">
                {scenarios.length} Scenarios Total
            </span>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Scenario
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <Table>
            <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="text-slate-300">Scenario Name</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-right text-slate-300">NPV ($MM)</TableHead>
                    <TableHead className="text-right text-slate-300">IRR (%)</TableHead>
                    <TableHead className="text-right text-slate-300">Created</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {scenarios.map((scenario) => (
                    <TableRow key={scenario.id} className={cn("border-slate-800 hover:bg-slate-800/50 transition-colors", activeScenario?.id === scenario.id ? "bg-blue-950/20 border-l-2 border-l-blue-500" : "")}>
                        <TableCell>
                            <Checkbox 
                                checked={selectedScenarios.includes(scenario.id)}
                                onCheckedChange={() => handleSelect(scenario.id)}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className={cn("font-medium", activeScenario?.id === scenario.id ? "text-blue-400" : "text-slate-200")}>
                                        {scenario.name}
                                    </span>
                                    {scenario.is_base_scenario && <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-slate-700 text-slate-300">Base</Badge>}
                                    {scenario.is_locked && <Lock className="w-3 h-3 text-amber-500" />}
                                </div>
                                <span className="text-xs text-slate-500 truncate max-w-[200px]">{scenario.description}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={cn(
                                "uppercase text-[10px]",
                                scenario.status === 'approved' ? "bg-emerald-950 text-emerald-400 border-emerald-900" :
                                scenario.status === 'reviewed' ? "bg-blue-950 text-blue-400 border-blue-900" :
                                "bg-slate-800 text-slate-400 border-slate-700"
                            )}>
                                {scenario.status || 'draft'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-300">
                            {formatCurrency(scenario.metrics?.npv)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-300">
                            {formatPercent(scenario.metrics?.irr)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                            {format(new Date(scenario.created_at), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                                    <DropdownMenuItem onClick={() => setActiveScenario(scenario)} disabled={activeScenario?.id === scenario.id}>
                                        <PlayCircle className="w-4 h-4 mr-2" /> Load Scenario
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => cloneScenario(scenario.id)}>
                                        <Copy className="w-4 h-4 mr-2" /> Clone
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-700" />
                                    <DropdownMenuItem onClick={() => updateScenarioStatus(scenario.id, { is_locked: !scenario.is_locked })}>
                                        {scenario.is_locked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                        {scenario.is_locked ? 'Unlock' : 'Lock'}
                                    </DropdownMenuItem>
                                    {!scenario.is_locked && (
                                        <DropdownMenuItem 
                                            className="text-red-400 focus:text-red-300 focus:bg-red-950/20"
                                            onClick={() => deleteScenario(scenario.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
                <DialogTitle>Create New Scenario</DialogTitle>
                <DialogDescription className="text-slate-400">Add a new blank scenario to this model.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label>Scenario Name</Label>
                <Input 
                    value={newScenarioName} 
                    onChange={(e) => setNewScenarioName(e.target.value)} 
                    className="bg-slate-800 border-slate-700 mt-2"
                    placeholder="e.g. Low Oil Price Case"
                />
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!newScenarioName}>Create</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for metric rows to handle cleaner rendering logic
const MetricRow = ({ label, scenarios, baseId, incremental, getValue, formatter, deltaFormatter, isPercentageRow, baseValueGetter }) => (
    <TableRow className="hover:bg-slate-800/50">
        <TableCell className="text-slate-400 pl-6">{label}</TableCell>
        {scenarios.map(s => {
            const val = getValue(s);
            
            if (isPercentageRow) {
                if (s.id === baseId || !incremental) return <TableCell key={s.id} className="text-center font-mono text-slate-500 border-l border-slate-800">-</TableCell>;
                const baseVal = baseValueGetter(scenarios.find(sc => sc.id === baseId));
                if (!baseVal) return <TableCell key={s.id} className="text-center font-mono text-slate-500 border-l border-slate-800">-</TableCell>;
                const delta = val - baseVal;
                const pct = (delta / Math.abs(baseVal)) * 100;
                return (
                    <TableCell key={s.id} className="text-center font-mono border-l border-slate-800">
                        <span className={pct > 0 ? "text-emerald-400" : "text-red-400"}>{pct > 0 ? '+' : ''}{pct.toFixed(1)}%</span>
                    </TableCell>
                );
            }

            if (s.id === baseId || !incremental) {
                return (
                    <TableCell key={s.id} className="text-center font-mono text-slate-300 border-l border-slate-800">
                        {formatter(val)}
                    </TableCell>
                );
            } else {
                // Incremental Mode for non-base scenarios
                const baseVal = getValue(scenarios.find(sc => sc.id === baseId));
                const delta = (val || 0) - (baseVal || 0);
                return (
                    <TableCell key={s.id} className="text-center font-mono border-l border-slate-800">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-500 mb-0.5">{formatter(val)}</span>
                            {deltaFormatter(delta)}
                        </div>
                    </TableCell>
                );
            }
        })}
    </TableRow>
);

export default ScenariosTab;