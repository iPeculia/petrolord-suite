import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DisasterRecovery = () => (
    <div className="h-full p-1 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-red-400" /> Disaster Recovery
            </h3>
            <Button variant="destructive" size="sm"><ShieldAlert className="w-4 h-4 mr-2" /> Initiate Failover</Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">Last Full Backup</div>
                    <div className="text-lg font-bold text-white mt-1">2 hours ago</div>
                    <div className="text-[10px] text-green-400 flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1"/> Verified</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">RPO / RTO Status</div>
                    <div className="text-lg font-bold text-white mt-1">5m / 15m</div>
                    <div className="text-[10px] text-slate-400 mt-1">Within SLA limits</div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default DisasterRecovery;