import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Move, PlusCircle } from 'lucide-react';

const CustomDashboardBuilder = () => {
    return (
        <div className="h-full p-1 flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <LayoutDashboard className="w-5 h-5 mr-2 text-emerald-400" /> Dashboard Builder
                </h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline">Add Widget</Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Save Layout</Button>
                </div>
            </div>

            <div className="flex-grow bg-slate-950 border border-slate-800 rounded-lg p-4 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-10" 
                     style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
                </div>

                <div className="grid grid-cols-4 gap-4 h-full pointer-events-none">
                    {/* Mock Widgets */}
                    <Card className="col-span-2 row-span-2 bg-slate-900/80 border-slate-700 border-dashed pointer-events-auto flex flex-col">
                        <div className="p-2 border-b border-slate-800 flex justify-between items-center cursor-move bg-slate-900">
                            <span className="text-xs font-bold text-slate-400">Production Overview</span>
                            <Move className="w-3 h-3 text-slate-600" />
                        </div>
                        <div className="flex-grow flex items-center justify-center text-slate-600 text-xs">Chart Area</div>
                    </Card>
                    
                    <Card className="col-span-1 row-span-1 bg-slate-900/80 border-slate-700 border-dashed pointer-events-auto flex flex-col">
                        <div className="p-2 border-b border-slate-800 flex justify-between items-center cursor-move bg-slate-900">
                            <span className="text-xs font-bold text-slate-400">Active Rigs</span>
                            <Move className="w-3 h-3 text-slate-600" />
                        </div>
                        <div className="flex-grow flex items-center justify-center text-slate-600 text-2xl font-bold">12</div>
                    </Card>

                     <Card className="col-span-1 row-span-1 bg-slate-900/80 border-slate-700 border-dashed pointer-events-auto flex flex-col justify-center items-center hover:bg-slate-800/50 cursor-pointer transition-colors text-slate-500 hover:text-emerald-400">
                        <PlusCircle className="w-8 h-8 mb-2" />
                        <span className="text-xs">Add Widget</span>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomDashboardBuilder;