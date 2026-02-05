import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const DesignSummary = ({ results }) => {
    // Calculate aggregate status
    let status = 'PASS';
    let minBurst = 99;
    let minCollapse = 99;
    let minTension = 99;

    if (results) {
        Object.values(results).forEach(r => {
            if (r.status === 'FAIL') status = 'FAIL';
            else if (r.status === 'WARNING' && status !== 'FAIL') status = 'WARNING';
            
            minBurst = Math.min(minBurst, parseFloat(r.burstMargin));
            minCollapse = Math.min(minCollapse, parseFloat(r.collapseMargin));
            minTension = Math.min(minTension, parseFloat(r.tensionMargin));
        });
    }

    if (minBurst === 99) {
        // No data
        return (
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 text-center text-xs text-slate-500">
                    Awaiting calculations...
                </CardContent>
            </Card>
        );
    }

    const StatusIcon = status === 'PASS' ? CheckCircle2 : status === 'WARNING' ? AlertTriangle : XCircle;
    const statusColor = status === 'PASS' ? 'text-emerald-400' : status === 'WARNING' ? 'text-amber-400' : 'text-red-400';
    const borderColor = status === 'PASS' ? 'border-emerald-500/20' : status === 'WARNING' ? 'border-amber-500/20' : 'border-red-500/20';
    const bgColor = status === 'PASS' ? 'bg-emerald-500/5' : status === 'WARNING' ? 'bg-amber-500/5' : 'bg-red-500/5';

    return (
        <Card className={`bg-slate-900 border-slate-800 ${borderColor}`}>
            <CardContent className={`p-4 ${bgColor}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-200">Design Summary</h3>
                    <div className={`flex items-center ${statusColor}`}>
                        <StatusIcon className="w-5 h-5 mr-2" />
                        <span className="font-bold">{status}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 block">Min Burst</span>
                        <span className={`text-sm font-mono font-bold ${minBurst < 1.1 ? 'text-red-400' : 'text-white'}`}>{minBurst.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 block">Min Coll.</span>
                        <span className={`text-sm font-mono font-bold ${minCollapse < 1.0 ? 'text-red-400' : 'text-white'}`}>{minCollapse.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-500 block">Min Tens.</span>
                        <span className={`text-sm font-mono font-bold ${minTension < 1.3 ? 'text-red-400' : 'text-white'}`}>{minTension.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DesignSummary;