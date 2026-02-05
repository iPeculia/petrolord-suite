import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FrequencyAnalysisPanel = ({ spectrumData }) => {
    // Calculate dominant frequency simply
    let domFreq = 0;
    let maxMag = 0;
    if(spectrumData) {
        spectrumData.forEach(d => {
            if(d.magnitude > maxMag) {
                maxMag = d.magnitude;
                domFreq = d.frequency;
            }
        });
    }

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center text-purple-400">
                    <Activity className="w-4 h-4 mr-2" /> Frequency Spectrum
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Filter className="w-3 h-3"/></Button>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-32 w-full">
                    {spectrumData && spectrumData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spectrumData}>
                                <defs>
                                    <linearGradient id="colorMag" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="frequency" stroke="#94a3b8" fontSize={9} tickCount={5} />
                                <YAxis hide />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}}
                                    labelFormatter={(label) => `${parseFloat(label).toFixed(1)} Hz`}
                                />
                                <Area type="monotone" dataKey="magnitude" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMag)" />
                                <ReferenceLine x={domFreq} stroke="#facc15" strokeDasharray="3 3" label={{ value: 'Dom', position: 'top', fill: '#facc15', fontSize: 9 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded">
                            No frequency data
                        </div>
                    )}
                </div>
                <div className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded flex justify-between">
                    <span>Dominant Freq:</span>
                    <span className="text-white font-mono">{domFreq.toFixed(1)} Hz</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FrequencyAnalysisPanel;