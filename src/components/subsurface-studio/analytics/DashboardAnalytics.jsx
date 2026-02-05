import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStudio } from '@/contexts/StudioContext';
import { useAnalytics } from './AnalyticsContext';
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from './VisualizationLibrary';
import { Activity, Database, Layers, Share2, Clock, Zap } from 'lucide-react';

const MetricCard = ({ title, value, subtext, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">{title}</div>
                <div className="text-2xl font-mono font-bold text-slate-100 mt-1">{value}</div>
                {subtext && <div className="text-[10px] text-slate-500 mt-1">{subtext}</div>}
            </div>
            <div className={`p-3 rounded-full bg-slate-800/50 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </CardContent>
    </Card>
);

const DashboardAnalytics = () => {
    const { allAssets } = useStudio();
    const { metrics, generateSummary } = useAnalytics();
    const [stats, setStats] = useState({ wells: 0, horizons: 0, seismic: 0, faults: 0 });

    useEffect(() => {
        const counts = {
            wells: allAssets.filter(a => a.type === 'well').length,
            horizons: allAssets.filter(a => a.type === 'horizon').length,
            seismic: allAssets.filter(a => a.type === 'seismic').length,
            faults: allAssets.filter(a => a.type === 'fault').length,
        };
        setStats(counts);
    }, [allAssets]);

    const assetTypeData = [
        { name: 'Wells', value: stats.wells },
        { name: 'Horizons', value: stats.horizons },
        { name: 'Seismic', value: stats.seismic },
        { name: 'Faults', value: stats.faults },
    ].filter(d => d.value > 0);

    // Mock performance data
    const performanceData = [
        { time: '10:00', load: 450, render: 120 },
        { time: '10:05', load: 420, render: 115 },
        { time: '10:10', load: 550, render: 140 },
        { time: '10:15', load: 480, render: 125 },
        { time: '10:20', load: 460, render: 118 },
    ];

    const summary = generateSummary();

    return (
        <div className="p-4 space-y-4 h-full overflow-y-auto bg-slate-950 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Assets" value={allAssets.length} subtext="+12% this week" icon={Database} color="text-blue-400" />
                <MetricCard title="Session Time" value={`${Math.floor(summary.durationSeconds / 60)}m`} subtext="Active now" icon={Clock} color="text-green-400" />
                <MetricCard title="Interactions" value={summary.totalInteractions} subtext="Clicks & Edits" icon={Activity} color="text-purple-400" />
                <MetricCard title="Avg Load Time" value="465ms" subtext="Optimal range" icon={Zap} color="text-yellow-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-sm text-slate-200">Asset Distribution</CardTitle></CardHeader>
                    <CardContent>
                        <SimplePieChart data={assetTypeData} nameKey="name" valueKey="value" />
                    </CardContent>
                </Card>
                 <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-sm text-slate-200">System Performance (ms)</CardTitle></CardHeader>
                    <CardContent>
                        <SimpleLineChart data={performanceData} xKey="time" yKeys={['load', 'render']} colors={['#3b82f6', '#10b981']} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardAnalytics;