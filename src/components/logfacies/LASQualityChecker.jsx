import React from 'react';
import { AlertCircle, CheckCircle, FileSearch, Info, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const LASQualityChecker = () => {
    return (
        <div className="grid grid-cols-1 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="pb-2 border-b border-slate-800">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileSearch className="w-5 h-5 text-amber-400"/> 
                        Data Health Scorecard
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-center py-2">
                        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-lime-500/30">
                            <div className="absolute inset-0 border-4 border-lime-500 rounded-full border-t-transparent rotate-45"></div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-lime-400">88</div>
                                <div className="text-xs text-slate-400 uppercase">Quality Score</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-300">Curve Completeness</span>
                                <span className="text-green-400 font-mono">98%</span>
                            </div>
                            <Progress value={98} className="h-2 bg-slate-800" indicatorClassName="bg-green-500"/>
                        </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-300">Depth Consistency</span>
                                <span className="text-green-400 font-mono">100%</span>
                            </div>
                            <Progress value={100} className="h-2 bg-slate-800" indicatorClassName="bg-green-500"/>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="pb-2 border-b border-slate-800">
                    <CardTitle className="text-lg">Detected Issues</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-[250px] p-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-red-950/20 border border-red-900/50 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-300">Null Values in RHOB</h4>
                                    <p className="text-xs text-slate-400 mt-1">Found 45 null values in density curve between 1500-1520m.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-amber-300">Abnormal Spikes (DT)</h4>
                                    <p className="text-xs text-slate-400 mt-1">Sonic curve shows potential cycle skipping spikes at 1845m.</p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default LASQualityChecker;