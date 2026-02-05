import React from 'react';
import { ArrowDownUp, Activity, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TimeDepthConversionEngine = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <ArrowDownUp className="w-5 h-5 text-blue-500"/> Conversion Engine
                </h3>
                <div className="flex gap-1">
                    <div className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-[10px] font-mono border border-blue-800">T→D</div>
                    <div className="px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded text-[10px] font-mono border border-emerald-800">D→T</div>
                </div>
            </div>
            <CardContent className="p-4">
                <Tabs defaultValue="single">
                    <TabsList className="w-full bg-slate-950 border border-slate-800 mb-4">
                        <TabsTrigger value="single" className="flex-1">Single Point</TabsTrigger>
                        <TabsTrigger value="batch" className="flex-1">Batch / Grid</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="single" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-semibold">Input Time (TWT ms)</label>
                                <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white font-mono text-lg" placeholder="0.00" />
                            </div>
                            <div className="flex items-end">
                                <Button className="w-full bg-blue-600 hover:bg-blue-500">
                                    Convert to Depth <Play className="w-3 h-3 ml-2"/>
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center">
                            <div className="text-xs text-slate-500 mb-1">Result Depth (TVDss)</div>
                            <div className="text-2xl font-mono text-emerald-400 font-bold">-- m</div>
                        </div>
                    </TabsContent>

                    <TabsContent value="batch" className="space-y-4">
                        <div className="p-4 border-2 border-dashed border-slate-700 rounded bg-slate-800/30 text-center">
                            <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">Drop Horizon Grid or Well Tops CSV here</p>
                        </div>
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600">
                            Run Batch Conversion
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default TimeDepthConversionEngine;