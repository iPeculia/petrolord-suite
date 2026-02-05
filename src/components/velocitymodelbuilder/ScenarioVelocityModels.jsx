import React from 'react';
import { GitBranch, Play, Copy, Trash, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ScenarioVelocityModels = () => {
    const scenarios = [
        { id: 'base', name: 'Base Case', color: 'bg-blue-500', active: true, type: 'Deterministic' },
        { id: 'low', name: 'Low Velocity (P10)', color: 'bg-red-500', active: false, type: 'Probabilistic' },
        { id: 'high', name: 'High Velocity (P90)', color: 'bg-emerald-500', active: false, type: 'Probabilistic' }
    ];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-400"/> Scenarios
                </CardTitle>
                <Button size="icon" variant="ghost" className="h-6 w-6"><PlusCircle className="w-4 h-4 text-slate-400"/></Button>
            </CardHeader>
            <CardContent className="p-0">
                {scenarios.map(scen => (
                    <div key={scen.id} className={`p-3 border-b border-slate-800 flex items-center justify-between hover:bg-slate-800/50 group cursor-pointer ${scen.active ? 'bg-slate-800/80' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${scen.color}`}></div>
                            <div>
                                <div className={`text-sm ${scen.active ? 'font-bold text-white' : 'text-slate-400'}`}>{scen.name}</div>
                                <div className="text-[10px] text-slate-500">{scen.type}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="w-3 h-3 text-slate-400"/></Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Clone</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {scen.id !== 'base' && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-900/20"><Trash className="w-3 h-3 text-red-400"/></Button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="p-3 bg-slate-950/30">
                    <Button variant="outline" className="w-full text-xs h-8 border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Play className="w-3 h-3 mr-2" /> Compare Volumes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScenarioVelocityModels;