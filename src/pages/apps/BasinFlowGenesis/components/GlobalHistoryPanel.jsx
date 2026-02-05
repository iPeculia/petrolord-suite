import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Thermometer, TrendingDown, TrendingUp } from 'lucide-react';
import { useBasinFlow } from '../contexts/BasinFlowContext';

const GlobalHistoryPanel = () => {
    const { state, dispatch } = useBasinFlow();
    const { heatFlow } = state;

    return (
        <Card className="h-full bg-slate-950 border-l border-slate-800 rounded-none w-full max-w-sm">
            <CardHeader className="border-b border-slate-800 py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-purple-400" />
                    Global History
                </CardTitle>
            </CardHeader>
            <Tabs defaultValue="thermal" className="h-[calc(100%-50px)] flex flex-col">
                <div className="px-4 pt-2 bg-slate-900">
                    <TabsList className="w-full justify-start h-8 bg-transparent border-b border-slate-800 rounded-none p-0">
                        <TabsTrigger value="thermal" className="text-xs data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none h-full px-2">Thermal</TabsTrigger>
                        <TabsTrigger value="subsidence" className="text-xs data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-2">Subsidence</TabsTrigger>
                        <TabsTrigger value="erosion" className="text-xs data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-full px-2">Erosion</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="thermal" className="flex-1 p-4 mt-0">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                                <Thermometer className="w-3 h-3" /> Heat Flow Model
                            </h3>
                            <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                <div className="mb-3">
                                    <Label className="text-xs text-slate-400">Base Heat Flow (mW/m²)</Label>
                                    <Input 
                                        type="number" 
                                        value={heatFlow.value}
                                        onChange={(e) => dispatch({ type: 'UPDATE_HEAT_FLOW', payload: { value: parseFloat(e.target.value) } })}
                                        className="mt-1 bg-slate-950 h-8"
                                    />
                                </div>
                                <div className="text-xs text-slate-500 italic">
                                    Constant heat flow applied at base of model. Future updates will allow time-variant heat flow.
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-slate-300">Surface Temperature</h3>
                            <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-slate-400">Present Day:</span>
                                    <span className="text-xs text-white">20°C</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Gradient:</span>
                                    <span className="text-xs text-white">Auto-calculated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="subsidence" className="flex-1 p-4 mt-0 text-slate-400 text-sm text-center">
                    <TrendingDown className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>Subsidence history controls coming in Phase 2</p>
                </TabsContent>

                <TabsContent value="erosion" className="flex-1 p-4 mt-0 text-slate-400 text-sm text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>Erosion event manager coming in Phase 2</p>
                </TabsContent>
            </Tabs>
        </Card>
    );
};

export default GlobalHistoryPanel;