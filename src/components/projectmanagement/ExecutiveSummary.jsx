import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity, PieChart } from 'lucide-react';
import { calculateCPI, calculateSPI } from '@/utils/projectManagementCalculations';

const MetricCard = ({ title, value, subtext, trend, icon: Icon, colorClass }) => (
  <Card className="bg-slate-900 border-slate-800">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        {trend && (
            <span className={`flex items-center ${trend > 0 ? 'text-green-400' : 'text-red-400'} mr-2`}>
                {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(trend)}%
            </span>
        )}
        <span className="text-slate-500">{subtext}</span>
      </div>
    </CardContent>
  </Card>
);

const ExecutiveSummary = ({ projects, risks = [] }) => {
  const metrics = useMemo(() => {
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.baseline_budget) || 0), 0);
    const totalActual = projects.reduce((sum, p) => sum + (parseFloat(p.actual_cost) || 0), 0); // Assuming actual_cost field added or derived
    
    // Simplified aggregate SPI/CPI calculation
    // Ideally, this weights by project size
    const activeProjects = projects.filter(p => p.stage !== 'Concept' && p.stage !== 'Closeout');
    const avgSPI = activeProjects.length ? (activeProjects.reduce((sum, p) => sum + (p.spi || 1), 0) / activeProjects.length).toFixed(2) : 1.00;
    const avgCPI = activeProjects.length ? (activeProjects.reduce((sum, p) => sum + (p.cpi || 1), 0) / activeProjects.length).toFixed(2) : 1.00;

    const highRisks = risks.filter(r => r.risk_score >= 15).length;
    
    const statusCounts = {
        Green: projects.filter(p => p.status === 'Green').length,
        Amber: projects.filter(p => p.status === 'Amber').length,
        Red: projects.filter(p => p.status === 'Red').length
    };

    return {
        totalBudget,
        totalForecast: totalBudget * 1.1, // Mock forecast logic
        avgSPI,
        avgCPI,
        highRisks,
        statusCounts
    };
  }, [projects, risks]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
            title="Total Portfolio Value" 
            value={formatCurrency(metrics.totalBudget)} 
            subtext="Baseline Budget"
            trend={5.2}
            icon={DollarSign}
            colorClass="text-emerald-400"
        />
        <MetricCard 
            title="Schedule Performance" 
            value={metrics.avgSPI} 
            subtext="Avg SPI (Weighted)"
            trend={-2.1}
            icon={Activity}
            colorClass="text-blue-400"
        />
        <MetricCard 
            title="Cost Performance" 
            value={metrics.avgCPI} 
            subtext="Avg CPI (Weighted)"
            trend={0.8}
            icon={PieChart}
            colorClass="text-purple-400"
        />
        <MetricCard 
            title="Critical Risks" 
            value={metrics.highRisks} 
            subtext="Risks Score > 15"
            trend={-10} // Negative trend for risks is good? Let's assume negative number means count went down
            icon={AlertTriangle}
            colorClass="text-red-400"
        />
        
        {/* Mini RAG Breakdown included in layout via CSS grid spanning or just simple summary below */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Project Health Breakdown:</span>
            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-white font-bold">{metrics.statusCounts.Green}</span>
                    <span className="text-slate-500 text-sm">On Track</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-white font-bold">{metrics.statusCounts.Amber}</span>
                    <span className="text-slate-500 text-sm">At Risk</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-white font-bold">{metrics.statusCounts.Red}</span>
                    <span className="text-slate-500 text-sm">Critical</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ExecutiveSummary;