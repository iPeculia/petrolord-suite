import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { GitBranch, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock mini well view
const WellStrip = ({ name }) => (
    <div className="h-full bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 truncate px-2">
            {name}
        </div>
        <div className="flex-1 relative overflow-hidden">
            {/* Mock Log Traces */}
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <path d={`M 10 0 Q 30 50 10 100 T 40 200 T 10 300`} stroke="#22c55e" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d={`M 60 0 Q 80 50 60 100 T 90 200 T 60 300`} stroke="#ef4444" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* Mock Correlation Lines */}
            <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-yellow-500 opacity-50"></div>
            <div className="absolute top-2/3 left-0 right-0 border-t border-dashed border-blue-500 opacity-50"></div>
        </div>
    </div>
);

const CorrelationPanel = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <div className="p-2 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <GitBranch className="w-4 h-4" /> Correlation View (Flattened on Top Sand)
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                    <PlusCircle className="w-3 h-3 mr-1" /> Add Well
                </Button>
            </div>
            <CardContent className="p-0 flex-1">
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={25} minSize={10}>
                        <WellStrip name="Well A-01" />
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-blue-500 transition-colors" />
                    <Panel defaultSize={25} minSize={10}>
                        <WellStrip name="Well B-04" />
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-blue-500 transition-colors" />
                    <Panel defaultSize={25} minSize={10}>
                        <WellStrip name="Well C-02" />
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-blue-500 transition-colors" />
                    <Panel defaultSize={25} minSize={10}>
                        <div className="h-full flex items-center justify-center bg-slate-900/50 text-slate-600">
                            <div className="text-center">
                                <PlusCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <span className="text-xs">Drag well to add</span>
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </CardContent>
        </Card>
    );
};

export default CorrelationPanel;