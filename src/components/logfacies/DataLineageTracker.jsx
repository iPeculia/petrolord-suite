import React from 'react';
import { GitCommit, Database, ArrowDown, History, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const events = [
    { id: 4, type: 'model', title: 'Classification Run', desc: 'XGBoost Model v2.1 executed', time: '10:15 AM', user: 'System', current: true },
    { id: 3, type: 'qc', title: 'Curve Despiking', desc: 'Removed 3 spikes in DT curve', time: '10:12 AM', user: 'J. Doe' },
    { id: 2, type: 'process', title: 'Normalization', desc: 'Min-Max scaling applied to GR, RHOB', time: '10:05 AM', user: 'J. Doe' },
    { id: 1, type: 'ingest', title: 'Data Import', desc: 'Imported Well-A01.las', time: '10:00 AM', user: 'System' },
];

const DataLineageTracker = () => {
    return (
        <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400"/> 
                    History
                </h3>
                <Badge variant="outline" className="text-xs">v2.1</Badge>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="relative border-l-2 border-slate-700 ml-3 space-y-8 pb-8">
                    {events.map((event) => (
                        <div key={event.id} className="relative pl-8">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${event.current ? 'bg-green-500 border-green-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-900 border-slate-600'}`}></div>
                            <div className={`rounded-lg p-3 border transition-colors ${event.current ? 'bg-slate-800 border-slate-600' : 'bg-transparent border-slate-800 hover:border-slate-700'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-medium ${event.current ? 'text-white' : 'text-slate-400'}`}>{event.title}</h4>
                                    <span className="text-[10px] text-slate-600">{event.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2 leading-relaxed">{event.desc}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                        <GitCommit className="w-3 h-3" /> {event.user}
                                    </div>
                                    {!event.current && (
                                        <Button size="icon" variant="ghost" className="h-5 w-5 text-slate-500 hover:text-blue-400" title="Restore this state">
                                            <RotateCcw className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default DataLineageTracker;