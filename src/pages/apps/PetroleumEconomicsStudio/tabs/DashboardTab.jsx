import React, { useState, useMemo } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine, Bar, BarChart, Cell } from 'recharts';
import { Loader2, DollarSign, TrendingUp, Activity, PieChart, BarChart3, Plus, HelpCircle, GraduationCap, PlayCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WorkflowDiagram from '@/components/PetroleumEconomicsStudio/WorkflowDiagram';
import ResultsExplainer from '@/components/PetroleumEconomicsStudio/ResultsExplainer';
import DashboardTutorial from '@/components/PetroleumEconomicsStudio/DashboardTutorial';
import ComparisonTutorial from '@/components/PetroleumEconomicsStudio/ComparisonTutorial';
import QuickTipsCarousel from '@/components/PetroleumEconomicsStudio/QuickTipsCarousel';

const formatCurrency = (value, currency = 'USD') => {
  if (value === undefined || value === null) return '-';
  const absValue = Math.abs(value);
  const prefix = value < 0 ? '- ' : '';
  if (absValue >= 1000000) return `${prefix}${currency} ${(absValue / 1000000).toFixed(1)} MM`;
  if (absValue >= 1000) return `${prefix}${currency} ${(absValue / 1000).toFixed(1)} k`;
  return `${prefix}${currency} ${absValue.toFixed(0)}`;
};

const DashboardTab = () => {
  const { calculationResults, modelSettings, productionData, loading, loadDemoModel, createScenario } = usePetroleumEconomics();
  const [productionView, setProductionView] = useState('rate'); 
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showComparisonHelp, setShowComparisonHelp] = useState(false);

  const chartData = useMemo(() => {
    if (!calculationResults?.annualResults) return [];
    let cumOil = 0, cumGas = 0, cumCashflow = 0;
    return calculationResults.annualResults.map((row) => {
      const prodRow = productionData.find(p => p.year === row.year) || {};
      const oilRate = prodRow.oil_rate || 0;
      const gasRate = prodRow.gas_rate || 0;
      cumOil += oilRate; cumGas += gasRate; cumCashflow = row.cumulative_cashflow;
      return {
        year: row.year, oilRate, gasRate, cumOil, cumGas, capex: row.capex, opex: row.opex,
        grossRevenue: row.gross_revenue, netCashflow: row.net_cashflow, cumCashflow: cumCashflow,
        govtTake: row.govt_take, tax: row.tax, royalties: row.royalties,
      };
    });
  }, [calculationResults, productionData]);

  const metrics = calculationResults?.metrics || {};

  if (loading && !chartData.length) return <div className="flex h-64 items-center justify-center text-slate-500"><Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading Dashboard...</div>;

  if (!chartData.length) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 bg-slate-950">
        <div className="max-w-md w-full text-center space-y-6">
            <div className="bg-slate-900 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center border border-slate-800 shadow-xl"><BarChart3 className="w-10 h-10 text-blue-500" /></div>
            <div className="space-y-2"><h3 className="text-2xl font-bold text-white">No Model Data</h3><p className="text-slate-400">This model currently has no active scenario data. You can load a sample project or start creating a new scenario.</p></div>
            <div className="flex flex-col gap-3 pt-4"><Button onClick={() => loadDemoModel('well')} className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12">Load Demo Model (Single Well)</Button><Button onClick={() => createScenario("New Scenario", "Created via Dashboard")} variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300"><Plus className="w-4 h-4 mr-2" /> Create New Scenario</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-wrap justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800 gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span className="hidden sm:inline">New to Economics Studio?</span>
              </div>
              <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowTutorial(true)} className="h-7 text-xs hover:bg-slate-800 text-slate-300"><PlayCircle className="w-3 h-3 mr-1.5 text-emerald-400" /> Dashboard Tour</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowWorkflow(true)} className="h-7 text-xs hover:bg-slate-800 text-slate-300"><Activity className="w-3 h-3 mr-1.5" /> Workflow</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowExplainer(true)} className="h-7 text-xs hover:bg-slate-800 text-slate-300"><HelpCircle className="w-3 h-3 mr-1.5" /> Explain Metrics</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowComparisonHelp(true)} className="h-7 text-xs hover:bg-slate-800 text-slate-300"><FileText className="w-3 h-3 mr-1.5" /> Compare Guide</Button>
              </div>
          </div>
          <div className="lg:col-span-1">
              <QuickTipsCarousel />
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="kpi-section">
        <KPICard title={`NPV (${(modelSettings.discountRate * 100).toFixed(0)}%)`} value={formatCurrency(metrics.npv)} icon={<DollarSign className="w-4 h-4 text-emerald-400" />} trend={metrics.npv > 0 ? "positive" : "negative"} />
        <KPICard title="IRR" value={`${metrics.irr?.toFixed(1)}%`} icon={<TrendingUp className="w-4 h-4 text-blue-400" />} trend={metrics.irr > 10 ? "positive" : "neutral"} />
        <KPICard title="DPI" value={metrics.dpi?.toFixed(2) + 'x'} icon={<Activity className="w-4 h-4 text-purple-400" />} />
        <KPICard title="Payback Year" value={metrics.payback_year || "N/A"} subtext={metrics.payback_year ? `Year ${metrics.payback_year - modelSettings.startYear}` : "No payback"} icon={<Activity className="w-4 h-4 text-amber-400" />} />
        <KPICard title="Govt Take" value="-" icon={<PieChart className="w-4 h-4 text-rose-400" />} />
        <KPICard title="Unit Tech Cost" value={`$${metrics.unit_technical_cost?.toFixed(2)}/boe`} icon={<BarChart3 className="w-4 h-4 text-slate-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800" id="production-chart">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div><CardTitle className="text-base font-medium text-slate-200">Production Profile</CardTitle><CardDescription>Oil & Gas Forecast</CardDescription></div>
            <div className="flex items-center gap-2"><Label className="text-xs text-slate-400">View:</Label><div className="flex bg-slate-950 rounded border border-slate-800 p-0.5"><button onClick={() => setProductionView('rate')} className={cn("px-2 py-0.5 text-xs rounded", productionView === 'rate' ? "bg-slate-800 text-white" : "text-slate-400")}>Rate</button><button onClick={() => setProductionView('cumulative')} className={cn("px-2 py-0.5 text-xs rounded", productionView === 'cumulative' ? "bg-slate-800 text-white" : "text-slate-400")}>Cum</button></div></div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey={productionView === 'rate' ? "oilRate" : "cumOil"} name="Oil" stroke="#16a34a" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey={productionView === 'rate' ? "gasRate" : "cumGas"} name="Gas" stroke="#dc2626" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800" id="cost-chart">
          <CardHeader><CardTitle className="text-base font-medium text-slate-200">Expenditure Profile</CardTitle><CardDescription>CAPEX & OPEX by Year</CardDescription></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
                <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }} />
                <Legend />
                <Bar dataKey="capex" name="CAPEX" stackId="a" fill="#2563eb" />
                <Bar dataKey="opex" name="OPEX" stackId="a" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showWorkflow} onOpenChange={setShowWorkflow}><DialogContent className="bg-slate-950 border-slate-800 max-w-5xl"><DialogHeader><DialogTitle>Workflow</DialogTitle></DialogHeader><div className="py-6"><WorkflowDiagram /></div></DialogContent></Dialog>
      <Dialog open={showExplainer} onOpenChange={setShowExplainer}><DialogContent className="bg-slate-950 border-slate-800 max-w-2xl"><DialogHeader><DialogTitle>Metrics</DialogTitle></DialogHeader><div className="py-2"><ResultsExplainer /></div></DialogContent></Dialog>
      <Dialog open={showComparisonHelp} onOpenChange={setShowComparisonHelp}><DialogContent className="bg-slate-950 border-slate-800 max-w-3xl"><DialogHeader><DialogTitle>Compare Scenarios</DialogTitle></DialogHeader><div className="py-2"><ComparisonTutorial /></div></DialogContent></Dialog>
      <DashboardTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
};

const KPICard = ({ title, value, icon, subtext, trend }) => (
  <Card className="bg-slate-900 border-slate-800 hover:bg-slate-800/50 transition-colors">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2"><span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>{icon}</div>
      <div className={cn("text-xl font-bold font-mono truncate", trend === 'positive' ? "text-emerald-400" : (trend === 'negative' ? "text-red-400" : "text-white"))}>{value}</div>
      {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
    </CardContent>
  </Card>
);

export default DashboardTab;