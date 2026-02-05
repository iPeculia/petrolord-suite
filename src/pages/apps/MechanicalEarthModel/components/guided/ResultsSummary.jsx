import React from 'react';
import { useGuidedMode } from '../../contexts/GuidedModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, icon, unit }) => (
    <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-slate-400">{unit}</p>
        </CardContent>
    </Card>
);

const ResultsSummary = () => {
    const { state } = useGuidedMode();
    const { results } = state;

    if (!results || !results.summary) {
        return (
             <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle>Results Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-400">No calculation results available. Please run a calculation first.</p>
                </CardContent>
             </Card>
        );
    }
    
    const { summary } = results;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
                title="Avg. Vertical Stress Gradient"
                value={summary.avg_sv_gradient?.toFixed(2) ?? 'N/A'}
                unit="psi/ft"
                icon={<Activity className="h-4 w-4 text-slate-400" />}
            />
            <StatCard 
                title="Avg. Pore Pressure Gradient"
                value={summary.avg_pp_gradient?.toFixed(2) ?? 'N/A'}
                unit="psi/ft (equivalent)"
                icon={<TrendingUp className="h-4 w-4 text-slate-400" />}
            />
            <StatCard 
                title="Data Quality Score"
                value={summary.qualityScore ?? 'N/A'}
                unit="/ 100"
                icon={<ShieldCheck className="h-4 w-4 text-slate-400" />}
            />
        </div>
    );
};

export default ResultsSummary;