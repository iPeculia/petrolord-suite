import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CloudRain, PlayCircle } from 'lucide-react';

const DisasterRecoveryPlanning = () => {
    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><CloudRain className="w-4 h-4 mr-2 text-blue-400"/> Business Continuity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="text-xs text-slate-500 uppercase font-bold">Recovery Time Objective (RTO)</div>
                            <div className="text-2xl font-mono text-white mt-1">4 Hours</div>
                            <div className="text-[10px] text-green-400 mt-1">Current: 1.5h (Simulated)</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="text-xs text-slate-500 uppercase font-bold">Recovery Point Objective (RPO)</div>
                            <div className="text-2xl font-mono text-white mt-1">15 Mins</div>
                            <div className="text-[10px] text-green-400 mt-1">Current: 2m (Lag)</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded border border-slate-800">
                        <div>
                            <div className="font-bold text-sm text-slate-200">DR Drill Status</div>
                            <div className="text-xs text-slate-400">Last successful failover test: 28 days ago</div>
                        </div>
                        <Button variant="destructive" size="sm">
                            <PlayCircle className="w-4 h-4 mr-2" /> Initiate Drill
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DisasterRecoveryPlanning;