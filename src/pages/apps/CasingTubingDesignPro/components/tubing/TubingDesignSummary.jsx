import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, XCircle, Activity, Box } from 'lucide-react';

const TubingDesignSummary = ({ results, flowAnalysis }) => {
    // Determine overall status from detailed results
    let status = 'PASS';
    let minBurst = 99;
    let minCollapse = 99;
    let minTension = 99;
    let minCompression = 99;

    if (results && results.length > 0) {
        results.forEach(r => {
            const b = parseFloat(r.burstSF);
            const c = parseFloat(r.collapseSF);
            const t = parseFloat(r.tensionSF);
            const comp = parseFloat(r.compressionSF);

            if (b < minBurst) minBurst = b;
            if (c < minCollapse) minCollapse = c;
            if (t < minTension) minTension = t;
            if (comp < minCompression) minCompression = comp;

            if (r.status === 'FAIL') status = 'FAIL';
            else if (r.status === 'WARNING' && status !== 'FAIL') status = 'WARNING';
        });
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
                
                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[9px] text-slate-500 block uppercase">Min Burst</span>
                        <span className={`text-sm font-mono font-bold ${minBurst < 1.1 ? 'text-red-400' : 'text-white'}`}>{minBurst === 99 ? '-' : minBurst.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[9px] text-slate-500 block uppercase">Min Coll.</span>
                        <span className={`text-sm font-mono font-bold ${minCollapse < 1.0 ? 'text-red-400' : 'text-white'}`}>{minCollapse === 99 ? '-' : minCollapse.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[9px] text-slate-500 block uppercase">Min Tens.</span>
                        <span className={`text-sm font-mono font-bold ${minTension < 1.3 ? 'text-red-400' : 'text-white'}`}>{minTension === 99 ? '-' : minTension.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-center">
                        <span className="text-[9px] text-slate-500 block uppercase">Min Comp.</span>
                        <span className={`text-sm font-mono font-bold ${minCompression < 1.2 ? 'text-red-400' : 'text-white'}`}>{minCompression === 99 ? '-' : minCompression.toFixed(2)}</span>
                    </div>
                </div>
                
                {flowAnalysis && (
                    <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                        <div className="flex items-center text-cyan-400">
                            <Activity className="w-3 h-3 mr-1" />
                            <span>Max Rate: <span className="font-bold font-mono">{flowAnalysis.maxRate}</span> bbl/d</span>
                        </div>
                        <div className="flex items-center text-slate-400">
                            <Box className="w-3 h-3 mr-1" />
                            <span>Regime: {flowAnalysis.regime}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TubingDesignSummary;