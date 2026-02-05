import React, { useState } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Loader2, RefreshCw, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SensitivityTab = () => {
  const { calculateSensitivity, modelSettings } = usePetroleumEconomics();

  // --- State ---
  const [params, setParams] = useState({
    price: 20, // +/- %
    capex: 20, // +/- %
    opex: 20,  // +/- %
    production: 10, // +/- %
    startDate: 1 // +/- years
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeView, setActiveView] = useState('npv');

  // --- Helpers ---
  const formatCurrency = (val) => {
      if (val === undefined || isNaN(val)) return '-';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: modelSettings.currency || 'USD', maximumFractionDigits: 1, minimumFractionDigits: 0 }).format(val / 1000000) + ' MM';
  };

  const formatPercent = (val) => {
      if (val === undefined || isNaN(val)) return '-';
      return val.toFixed(1) + '%';
  };

  const handleParamChange = (key, val) => {
    setParams(prev => ({ ...prev, [key]: parseInt(val) }));
    // Invalidate results to force re-run
    setResults(null);
  };

  const handleReset = () => {
      setParams({
        price: 20,
        capex: 20,
        opex: 20,
        production: 10,
        startDate: 1
      });
      setResults(null);
  };

  const runAnalysis = async () => {
      setIsCalculating(true);
      // Small delay to allow UI render update
      setTimeout(async () => {
          try {
              const res = await calculateSensitivity(params);
              setResults(res);
          } catch (e) {
              console.error("Sensitivity failed", e);
          } finally {
              setIsCalculating(false);
          }
      }, 100);
  };

  // --- Rendering ---

  return (
    <div className="flex flex-col h-full space-y-6 pb-8">
      
      {/* 1. Control Panel */}
      <Card className="bg-slate-900 border-slate-800 shrink-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div>
                    <CardTitle className="text-base text-slate-200">Sensitivity Parameters</CardTitle>
                    <CardDescription>Define swing range for variables relative to Base Case.</CardDescription>
                </div>
                <TooltipProvider>
                    <UITooltip>
                        <TooltipTrigger><HelpCircle className="w-4 h-4 text-slate-500" /></TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                            <p>Tornado analysis runs multiple scenarios by varying one parameter at a time (One-Factor-At-A-Time). The Base Case is compared against a High case (Base + Swing) and Low case (Base - Swing).</p>
                        </TooltipContent>
                    </UITooltip>
                </TooltipProvider>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset} className="border-slate-700 bg-slate-800 text-slate-400 hover:text-white">
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button onClick={runAnalysis} disabled={isCalculating} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px]">
                    {isCalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    {isCalculating ? 'Running...' : 'Run Analysis'}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <ParamControl label="Price Sensitivity" value={params.price} onChange={(v) => handleParamChange('price', v)} suffix="%" options={[10, 20, 30, 40, 50]} />
                <ParamControl label="CAPEX Sensitivity" value={params.capex} onChange={(v) => handleParamChange('capex', v)} suffix="%" options={[10, 20, 30, 40, 50]} />
                <ParamControl label="OPEX Sensitivity" value={params.opex} onChange={(v) => handleParamChange('opex', v)} suffix="%" options={[10, 20, 30, 40, 50]} />
                <ParamControl label="Production Vol." value={params.production} onChange={(v) => handleParamChange('production', v)} suffix="%" options={[10, 20, 30]} />
                <ParamControl label="Start Date Shift" value={params.startDate} onChange={(v) => handleParamChange('startDate', v)} suffix="yr" options={[1, 2, 3, 5]} />
            </div>
        </CardContent>
      </Card>

      {/* 2. Results Area */}
      <div className="flex-1 min-h-0">
        {!results && !isCalculating && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
                <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                <p>Click &quot;Run Analysis&quot; to generate sensitivity tornado charts.</p>
            </div>
        )}

        {isCalculating && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900/30 rounded-lg">
                <Loader2 className="w-10 h-10 mb-3 animate-spin text-blue-500" />
                <p>Calculating multiple economic scenarios...</p>
            </div>
        )}

        {results && !isCalculating && (
            <Tabs value={activeView} onValueChange={setActiveView} className="h-full flex flex-col">
                <TabsList className="bg-slate-900 border border-slate-800 w-fit">
                    <TabsTrigger value="npv">NPV Tornado</TabsTrigger>
                    <TabsTrigger value="irr">IRR Tornado</TabsTrigger>
                    <TabsTrigger value="table">Data Table</TabsTrigger>
                </TabsList>

                <div className="flex-1 mt-4 relative">
                    {/* NPV Tornado */}
                    <TabsContent value="npv" className="absolute inset-0 m-0">
                        <TornadoChart 
                            data={results.analysisData} 
                            metric="npv" 
                            baseValue={results.baseNPV} 
                            formatVal={formatCurrency}
                            title="NPV Sensitivity"
                        />
                    </TabsContent>

                    {/* IRR Tornado */}
                    <TabsContent value="irr" className="absolute inset-0 m-0">
                        <TornadoChart 
                            data={results.analysisData} 
                            metric="irr" 
                            baseValue={results.baseIRR} 
                            formatVal={formatPercent}
                            title="IRR Sensitivity"
                        />
                    </TabsContent>

                    {/* Data Table */}
                    <TabsContent value="table" className="absolute inset-0 m-0 overflow-auto">
                        <Card className="bg-slate-900 border-slate-800">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-300">Variable</TableHead>
                                        <TableHead className="text-slate-300 text-center">Swing</TableHead>
                                        <TableHead className="text-slate-300 text-right">Low Input Result</TableHead>
                                        <TableHead className="text-blue-400 text-center font-bold border-x border-slate-800 bg-slate-950/50">Base Case</TableHead>
                                        <TableHead className="text-slate-300 text-right">High Input Result</TableHead>
                                        <TableHead className="text-slate-300 text-right">Range</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.analysisData.map((row) => (
                                        <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell className="font-medium text-slate-200">{row.name}</TableCell>
                                            <TableCell className="text-center text-slate-400 text-xs">
                                                ±{row.paramValue}{row.paramType === 'pct' ? '%' : ' yr'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-slate-300">
                                                <div><span className="text-xs text-slate-500 mr-2">NPV:</span>{formatCurrency(row.lowCase.npv)}</div>
                                                <div><span className="text-xs text-slate-500 mr-2">IRR:</span>{formatPercent(row.lowCase.irr)}</div>
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-blue-400 font-bold border-x border-slate-800 bg-slate-950/30">
                                                <div>{formatCurrency(results.baseNPV)}</div>
                                                <div className="text-sm">{formatPercent(results.baseIRR)}</div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-slate-300">
                                                <div><span className="text-xs text-slate-500 mr-2">NPV:</span>{formatCurrency(row.highCase.npv)}</div>
                                                <div><span className="text-xs text-slate-500 mr-2">IRR:</span>{formatPercent(row.highCase.irr)}</div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-emerald-400">
                                                {formatCurrency(row.npvRange)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        )}
      </div>
    </div>
  );
};

const ParamControl = ({ label, value, onChange, suffix, options }) => (
    <div className="space-y-2">
        <div className="flex justify-between">
            <Label className="text-xs text-slate-400">{label}</Label>
            <span className="text-xs font-mono text-blue-400">±{value}{suffix}</span>
        </div>
        <Select value={value.toString()} onValueChange={onChange}>
            <SelectTrigger className="h-8 bg-slate-950 border-slate-800 text-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map(opt => (
                    <SelectItem key={opt} value={opt.toString()}>±{opt}{suffix}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

// Customized Tornado Chart Component
const TornadoChart = ({ data, metric, baseValue, formatVal, title }) => {
    // Transform data for Recharts to handle "Diverging Bar"
    const chartData = data.map(item => {
        const lowDelta = item[`${metric}LowDelta`];
        const highDelta = item[`${metric}HighDelta`];
        
        return {
            name: item.name,
            lowDelta: lowDelta,
            highDelta: highDelta,
            // Helper for tooltip
            lowVal: item.lowCase[metric],
            highVal: item.highCase[metric],
            baseVal: baseValue,
            range: item[`${metric}Range`]
        };
    });

    return (
        <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{title} Tornado</CardTitle>
                <CardDescription className="text-xs">Impact of parameter swings on {metric.toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        layout="vertical" 
                        data={chartData} 
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        barCategoryGap={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => (val > 0 ? '+' : '') + formatVal(val).replace(' MM', '')} />
                        <YAxis dataKey="name" type="category" stroke="#e2e8f0" fontSize={12} width={100} tick={{ fill: '#e2e8f0' }} />
                        <Tooltip 
                            cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    return (
                                        <div className="bg-slate-950 border border-slate-800 p-3 rounded shadow-xl text-slate-200 text-xs">
                                            <div className="font-bold mb-2 text-sm">{d.name} Sensitivity</div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                <span className="text-slate-400">Base Case:</span>
                                                <span className="font-mono text-blue-400 text-right">{formatVal(d.baseVal)}</span>
                                                
                                                <span className="text-slate-400">Low Input Impact:</span>
                                                <span className={cn("font-mono text-right", d.lowDelta > 0 ? "text-emerald-400" : "text-red-400")}>
                                                    {d.lowDelta > 0 ? '+' : ''}{formatVal(d.lowDelta)}
                                                </span>

                                                <span className="text-slate-400">High Input Impact:</span>
                                                <span className={cn("font-mono text-right", d.highDelta > 0 ? "text-emerald-400" : "text-red-400")}>
                                                    {d.highDelta > 0 ? '+' : ''}{formatVal(d.highDelta)}
                                                </span>
                                                
                                                <div className="col-span-2 border-t border-slate-800 my-1"></div>
                                                <span className="text-slate-300 font-medium">Total Range:</span>
                                                <span className="font-mono text-white text-right">{formatVal(d.range)}</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} />
                        
                        <Bar dataKey="lowDelta" name="Low Input Case" stackId="stack" fill="#ef4444">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-low-${index}`} fill={entry.lowDelta >= 0 ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                        <Bar dataKey="highDelta" name="High Input Case" stackId="stack" fill="#10b981">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-high-${index}`} fill={entry.highDelta >= 0 ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                
                <div className="flex justify-center gap-6 mt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Positive Impact (Beneficial)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Negative Impact (Detrimental)</div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SensitivityTab;