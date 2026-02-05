import React from 'react';
import { GitBranch, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ScenarioSetManager = () => {
    const scenarios = [
        { id: 'base', name: 'Base Case', color: 'bg-blue-500', active: true },
        { id: 'low', name: 'Low Velocity (P10)', color: 'bg-red-500', active: false },
        { id: 'high', name: 'High Velocity (P90)', color: 'bg-emerald-500', active: false }
    ];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-400"/> Scenario Manager
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {scenarios.map(scen => (
                    <div key={scen.id} className={`p-3 border-b border-slate-800 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer ${scen.active ? 'bg-slate-800/80' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${scen.color}`}></div>
                            <span className={`text-sm ${scen.active ? 'font-bold text-white' : 'text-slate-400'}`}>{scen.name}</span>
                        </div>
                        {scen.active && <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-300">Active</Badge>}
                    </div>
                ))}
                <div className="p-3 bg-slate-950/30">
                    <Button variant="outline" className="w-full text-xs h-8 border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Play className="w-3 h-3 mr-2" /> Run All Scenarios
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScenarioSetManager;