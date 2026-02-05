import React from 'react';
import { FileSearch, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const QCReportBuilder = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                    <FileSearch className="w-4 h-4 text-amber-400" /> QC Summary Report
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500 uppercase">Overall Score</span>
                        <div className="text-2xl font-bold text-lime-400">92/100</div>
                    </div>
                    <div className="w-20 h-20 relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-lime-500 border-t-transparent rotate-[-45deg]"></div>
                        <CheckCircle className="w-8 h-8 text-lime-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-xs flex justify-between text-slate-400"><span>Completeness</span><span>100%</span></div>
                    <Progress value={100} className="h-1.5" />
                    <div className="text-xs flex justify-between text-slate-400 mt-2"><span>Signal-to-Noise</span><span>85%</span></div>
                    <Progress value={85} className="h-1.5" />
                </div>

                <ScrollArea className="flex-1 bg-slate-950 rounded border border-slate-800 p-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Flagged Issues</h4>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-xs text-slate-300">
                            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                            <span>Possible cycle skipping on DT at 1450-1455m</span>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-300">
                            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                            <span>Density washout correction needed at 1200m</span>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default QCReportBuilder;