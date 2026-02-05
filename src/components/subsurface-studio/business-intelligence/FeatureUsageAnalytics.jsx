import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointerClick } from 'lucide-react';

const FeatureUsageAnalytics = () => {
    const features = [
        { name: '3D Visualization', usage: 92, trend: 'up' },
        { name: 'Seismic Interpretation', usage: 65, trend: 'up' },
        { name: 'Well Correlation', usage: 78, trend: 'stable' },
        { name: 'Machine Learning Studio', usage: 34, trend: 'up' },
        { name: 'Report Generator', usage: 45, trend: 'down' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <MousePointerClick className="w-5 h-5 mr-2 text-purple-400" /> Feature Adoption
            </h3>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Module Utilization Heatmap</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                            <span className="text-sm text-slate-300 font-medium">{f.name}</span>
                            <div className="flex items-center gap-4 w-1/2">
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div 
                                        className={`h-full rounded-full ${f.usage > 75 ? 'bg-green-500' : f.usage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                        style={{width: `${f.usage}%`}}
                                    ></div>
                                </div>
                                <span className="text-xs font-mono text-slate-400 w-8 text-right">{f.usage}%</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default FeatureUsageAnalytics;