import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ToggleLeft, Activity } from 'lucide-react';

const EnterpriseFeatureEngine = () => {
    const features = [
        { name: 'AI-Driven Interpretation', key: 'ai_interp', active: true, usage: 'High', risk: 'Low' },
        { name: 'Real-time Collaboration', key: 'rt_collab', active: true, usage: 'Very High', risk: 'Medium' },
        { name: 'Advanced Seismic Attributes', key: 'adv_seismic', active: false, usage: 'None', risk: 'High' },
        { name: 'Beta: GPU Acceleration', key: 'gpu_accel', active: false, usage: 'Low', risk: 'High' },
        { name: 'Legacy Export Support', key: 'leg_export', active: true, usage: 'Medium', risk: 'Low' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <ToggleLeft className="w-5 h-5 mr-2 text-indigo-400" /> Feature Flags
                    </h3>
                    <p className="text-xs text-slate-400">Manage platform capabilities and rollouts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {features.map((feat, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full bg-slate-900 ${feat.active ? 'text-green-400' : 'text-slate-500'}`}>
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-200 flex items-center gap-2">
                                        {feat.name}
                                        <Badge variant="outline" className="text-[10px] border-slate-700">{feat.key}</Badge>
                                    </div>
                                    <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                        <span>Usage: {feat.usage}</span>
                                        <span>•</span>
                                        <span>Risk: {feat.risk}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">{feat.active ? 'Enabled' : 'Disabled'}</span>
                                <Switch checked={feat.active} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EnterpriseFeatureEngine;