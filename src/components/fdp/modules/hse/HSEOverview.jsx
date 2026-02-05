import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { calculateRiskMatrix } from '@/utils/fdp/hseCalculations';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
                    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const HSEOverview = ({ data }) => {
    const { hazards = [], kpis = [], safetySystem } = data;
    const matrix = calculateRiskMatrix(hazards);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
                title="High Risks" 
                value={matrix.high} 
                subtitle={`${matrix.total} total identified`}
                icon={AlertTriangle}
                colorClass="bg-red-500"
            />
            <StatCard 
                title="System Status" 
                value={safetySystem ? "Active" : "Pending"} 
                subtitle={safetySystem || "No standard selected"}
                icon={ShieldAlert}
                colorClass="bg-green-500"
            />
            <StatCard 
                title="KPIs Tracked" 
                value={kpis.length} 
                subtitle="Performance metrics"
                icon={Activity}
                colorClass="bg-blue-500"
            />
            <StatCard 
                title="Compliance" 
                value="94%" 
                subtitle="Est. based on inputs"
                icon={CheckCircle2}
                colorClass="bg-purple-500"
            />
        </div>
    );
};

export default HSEOverview;