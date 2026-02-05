import React from 'react';
import { Layers, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const HorizonConversionWorkflow = () => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center">
                <Card className="bg-slate-900 border-slate-800 p-4 text-center hover:border-blue-500 cursor-pointer transition-colors group">
                    <Layers className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs font-bold text-slate-300">Time Horizon</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Top_Reservoir.grd</p>
                </Card>
                
                <div className="flex flex-col items-center">
                    <div className="w-full h-1 bg-slate-800 rounded relative">
                        <div className="absolute top-0 left-0 h-full w-1/2 bg-emerald-500 rounded"></div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        <span className="text-xs text-emerald-400 font-bold">Processing</span>
                    </div>
                </div>

                <Card className="bg-slate-900 border-slate-800 p-4 text-center opacity-50">
                    <Layers className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-300">Depth Horizon</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Pending...</p>
                </Card>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Conversion Progress</span>
                    <span>45%</span>
                </div>
                <Progress value={45} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                <div className="mt-3 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-slate-400">Cancel</Button>
                    <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-500">Start Workflow</Button>
                </div>
            </div>
        </div>
    );
};

export default HorizonConversionWorkflow;