import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChartSquare, Ship } from 'lucide-react';

const WellStrategy = ({ wells, rigCount = 1 }) => {
    // Simple sequential scheduling logic simulation
    // In a real app, this would use date-fns and a proper gantt library
    const schedule = [];
    let currentDayOffset = 0;

    wells.forEach(well => {
        const duration = well.days || 30;
        schedule.push({
            ...well,
            start: currentDayOffset,
            end: currentDayOffset + duration,
            color: well.type.includes('Producer') ? 'bg-green-600' : 'bg-blue-600'
        });
        currentDayOffset += duration;
    });

    const totalDays = currentDayOffset;
    const chartWidthPercent = 100; 

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-400 uppercase">Rig Count</div>
                            <div className="text-2xl font-bold text-white">{rigCount}</div>
                        </div>
                        <Ship className="w-8 h-8 text-slate-600" />
                    </div>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Total Drilling Days</div>
                        <div className="text-2xl font-bold text-white">{totalDays}</div>
                    </div>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Campaign Duration</div>
                        <div className="text-2xl font-bold text-white">{(totalDays / 365).toFixed(1)} Years</div>
                    </div>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-white flex items-center">
                        <GanttChartSquare className="w-5 h-5 mr-2 text-indigo-400" />
                        Drilling Sequence (Sequential)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 mt-4 relative">
                        {/* Timeline header could go here */}
                        <div className="flex justify-between text-xs text-slate-500 border-b border-slate-800 pb-2 mb-2">
                            <span>Start</span>
                            <span>Day {Math.round(totalDays/2)}</span>
                            <span>Day {totalDays}</span>
                        </div>

                        {schedule.map(item => (
                            <div key={item.id} className="flex items-center gap-4 group">
                                <div className="w-24 text-xs text-slate-300 text-right truncate">{item.name}</div>
                                <div className="flex-1 bg-slate-800 h-6 rounded overflow-hidden relative">
                                    <div 
                                        className={`absolute top-0 bottom-0 ${item.color} rounded transition-all hover:brightness-110`}
                                        style={{
                                            left: `${(item.start / totalDays) * chartWidthPercent}%`,
                                            width: `${((item.end - item.start) / totalDays) * chartWidthPercent}%`
                                        }}
                                    >
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/90 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.days}d
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {schedule.length === 0 && (
                            <div className="text-center text-slate-500 py-8 text-sm">No wells to schedule.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WellStrategy;