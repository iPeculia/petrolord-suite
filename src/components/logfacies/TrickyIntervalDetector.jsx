import React from 'react';
import { AlertTriangle, ArrowRight, Layers, ScanLine, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const flags = [
    { id: 1, depth: '1245.0 - 1248.5m', reason: 'Thin Bed Effect (<0.5m)', type: 'Resolution', confidence: 'Low', icon: Layers },
    { id: 2, depth: '1420.0 - 1435.0m', reason: 'Bad Hole (Caliper > BS + 3")', type: 'Quality', confidence: 'Very Low', icon: AlertTriangle },
    { id: 3, depth: '1680.0 - 1690.0m', reason: 'Mixed Facies (Sand/Shale Lamination)', type: 'Ambiguity', confidence: 'Medium', icon: ScanLine },
    { id: 4, depth: '1850.0 - 1855.0m', reason: 'Low Confidence (<60%)', type: 'Uncertainty', confidence: 'Low', icon: HelpCircle },
];

const TrickyIntervalDetector = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg h-full flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-white">Flagged Intervals</h3>
                </div>
                <Badge variant="secondary">{flags.length}</Badge>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {flags.map((flag) => {
                        const Icon = flag.icon;
                        return (
                            <div key={flag.id} className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-amber-900/50 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-slate-500" />
                                        <span className="font-mono text-slate-200 text-sm font-medium">{flag.depth}</span>
                                    </div>
                                    <Badge variant="outline" className={
                                        flag.type === 'Quality' ? 'text-red-400 border-red-900 bg-red-900/10' : 
                                        'text-amber-400 border-amber-900 bg-amber-900/10'
                                    }>
                                        {flag.type}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-400 mb-3 pl-6">{flag.reason}</p>
                                <div className="flex items-center justify-between pl-6">
                                    <span className="text-[10px] text-slate-500">Model Conf: {flag.confidence}</span>
                                    <Button size="xs" variant="ghost" className="h-6 text-blue-400 hover:text-white hover:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Inspect <ArrowRight className="w-3 h-3 ml-1"/>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default TrickyIntervalDetector;