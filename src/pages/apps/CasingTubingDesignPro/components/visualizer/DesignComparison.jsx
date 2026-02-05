import React from 'react';
import WellboreVisualization from './WellboreVisualization';
import { Badge } from '@/components/ui/badge';

const DesignComparison = ({ designA, designB }) => {
    return (
        <div className="flex flex-1 h-full gap-4">
            <div className="flex-1 flex flex-col border border-slate-800 rounded-lg overflow-hidden bg-slate-900/20">
                <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">Current Design</span>
                    <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-400">Active</Badge>
                </div>
                <div className="flex-1 relative">
                    <WellboreVisualization 
                        casingStrings={designA.casingStrings || []} 
                        tubingStrings={designA.tubingStrings || []} 
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col border border-slate-800 rounded-lg overflow-hidden bg-slate-900/20">
                <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">Comparison Case (Baseline)</span>
                    <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">Snapshot</Badge>
                </div>
                <div className="flex-1 relative">
                    <WellboreVisualization 
                        casingStrings={designB.casingStrings || []} 
                        tubingStrings={designB.tubingStrings || []} 
                    />
                </div>
            </div>
        </div>
    );
};

export default DesignComparison;