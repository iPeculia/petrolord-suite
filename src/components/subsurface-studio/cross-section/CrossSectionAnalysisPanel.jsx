import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { TrendingUp, Ruler, Layers, Activity } from 'lucide-react';

const CrossSectionAnalysisPanel = ({ assets, projectionData }) => {
    
    // Computed Stats
    const stats = useMemo(() => {
        if (!projectionData) return null;
        
        const wellCount = projectionData.wells.length;
        const sectionLen = projectionData.length;
        const avgSpacing = wellCount > 1 ? sectionLen / (wellCount - 1) : 0;
        
        // Stratigraphic Stats (based on Tops)
        const topsData = {};
        projectionData.wells.forEach(w => {
            (w.meta.tops || []).forEach(top => {
                if(!topsData[top.name]) topsData[top.name] = [];
                topsData[top.name].push(top.md);
            });
        });

        const stratTrends = Object.entries(topsData).map(([name, depths]) => ({
            name,
            min: Math.min(...depths),
            max: Math.max(...depths),
            avg: depths.reduce((a,b)=>a+b,0)/depths.length
        })).sort((a,b) => a.avg - b.avg);

        return { wellCount, sectionLen, avgSpacing, stratTrends };
    }, [projectionData]);

    if (!stats) return <div className="p-4 text-center text-slate-500">No analysis data available.</div>;

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="grid grid-cols-2 gap-2 shrink-0">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3 text-center">
                        <div className="text-xs text-slate-400">Length</div>
                        <div className="text-lg font-bold text-lime-400">{(stats.sectionLen/1000).toFixed(2)} km</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3 text-center">
                        <div className="text-xs text-slate-400">Avg Spacing</div>
                        <div className="text-lg font-bold text-cyan-400">{(stats.avgSpacing).toFixed(0)} m</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="strat" className="flex-grow flex flex-col min-h-0">
                <TabsList className="w-full bg-slate-800 border-slate-700">
                    <TabsTrigger value="strat" className="flex-1"><Layers className="w-3 h-3 mr-2"/> Stratigraphy</TabsTrigger>
                    <TabsTrigger value="props" className="flex-1"><Activity className="w-3 h-3 mr-2"/> Properties</TabsTrigger>
                </TabsList>

                <TabsContent value="strat" className="flex-grow min-h-0">
                    <Card className="bg-slate-800/30 border-slate-700 h-full flex flex-col">
                        <CardHeader className="py-2 px-4"><CardTitle className="text-xs">Horizon Depth Variation</CardTitle></CardHeader>
                        <CardContent className="flex-grow p-2 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.stratTrends} layout="vertical" margin={{left: 40}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis type="number" stroke="#94a3b8" />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 10}} />
                                    <Tooltip contentStyle={{background: '#1e293b', borderColor: '#475569', fontSize: '12px'}} />
                                    <Bar dataKey="avg" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="props" className="flex-grow min-h-0">
                    <div className="p-4 text-center text-slate-500 text-xs italic">
                        Property analysis requires log data integration.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CrossSectionAnalysisPanel;