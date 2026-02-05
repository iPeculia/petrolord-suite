import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ReservoirSummaryReport = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-400">Reservoir Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-between items-baseline">
                    <h2 className="text-3xl font-bold text-white">Zone A</h2>
                    <span className="text-sm text-slate-400">1250 - 1380 m</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Net Sand</div>
                        <div className="text-2xl font-mono text-white">45.5 <span className="text-sm text-slate-500">m</span></div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Net Pay</div>
                        <div className="text-2xl font-mono text-emerald-400">32.8 <span className="text-sm text-slate-500">m</span></div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Net-to-Gross</div>
                        <div className="text-2xl font-mono text-white">0.35</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase mb-1">Avg Porosity</div>
                        <div className="text-2xl font-mono text-white">18.2 <span className="text-sm text-slate-500">%</span></div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-xs text-slate-500 uppercase mb-1">Est. HCPV</div>
                        <div className="text-3xl font-mono text-blue-400">12.5 <span className="text-lg text-slate-500">MMbbl</span></div>
                    </div>
                </div>
                
                <Separator className="bg-slate-800" />
                
                <div className="text-xs text-slate-500">
                    <p>Based on Cutoffs: Vsh &lt; 0.4, Phi &gt; 0.08, Sw &lt; 0.5</p>
                    <p className="mt-1">Updated: {new Date().toLocaleTimeString()}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReservoirSummaryReport;