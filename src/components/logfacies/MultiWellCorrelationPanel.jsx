import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, PlusCircle, AlignCenterVertical, MoveVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Placeholder well strip for visual representation
const WellStrip = ({ name, isActive }) => (
    <div className={`h-full w-48 flex-shrink-0 border-r border-slate-800 flex flex-col ${isActive ? 'bg-slate-900' : 'bg-slate-950'}`}>
        <div className="h-10 border-b border-slate-800 flex items-center justify-center bg-slate-900 px-2">
            <span className="text-xs font-bold text-slate-300 truncate">{name}</span>
        </div>
        <div className="flex-1 relative">
            {/* Synthetic log trace */}
            <svg width="100%" height="100%" preserveAspectRatio="none" className="opacity-50">
                <path d="M 10 0 Q 40 50 10 100 T 30 200 T 10 300 T 40 400 T 10 500" stroke="#22c55e" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M 60 0 Q 90 50 60 100 T 80 200 T 60 300 T 90 400 T 60 500" stroke="#ef4444" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* Correlation markers */}
            <div className="absolute top-[20%] left-0 right-0 border-t border-yellow-500/50 border-dashed"></div>
            <div className="absolute top-[45%] left-0 right-0 border-t border-blue-500/50 border-dashed"></div>
            <div className="absolute top-[70%] left-0 right-0 border-t border-purple-500/50 border-dashed"></div>
        </div>
    </div>
);

const MultiWellCorrelationPanel = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 border-b border-slate-800 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-orange-400" /> 
                    Multi-Well Correlation
                </CardTitle>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">
                        <AlignCenterVertical className="w-3 h-3 mr-2" /> Flatten on Marker
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-400 hover:text-blue-300">
                        <PlusCircle className="w-3 h-3 mr-2" /> Add Well
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col relative">
                {/* Correlation Canvas */}
                <ScrollArea className="flex-1 w-full" orientation="horizontal">
                    <div className="flex h-full min-w-max">
                        <div className="w-12 border-r border-slate-800 bg-slate-950 flex flex-col pt-10 items-center text-[10px] text-slate-500 space-y-10">
                            {/* Depth Axis Placeholder */}
                            <span>1000</span>
                            <span>1100</span>
                            <span>1200</span>
                            <span>1300</span>
                            <span>1400</span>
                        </div>
                        <WellStrip name="Well A-01" isActive={true} />
                        <WellStrip name="Well B-04" />
                        <WellStrip name="Well C-02" />
                        <WellStrip name="Well D-09" />
                        {/* Correlation Lines Overlay (SVG usually) */}
                        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" style={{left: 48}}>
                            {/* Example correlation line connecting tops */}
                            <path d="M 0 120 L 192 130 L 384 115 L 576 140" stroke="rgba(234, 179, 8, 0.5)" strokeWidth="2" fill="none" strokeDasharray="4" />
                            <text x="10" y="115" fill="#eab308" fontSize="10">Top Sand A</text>
                        </svg>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default MultiWellCorrelationPanel;