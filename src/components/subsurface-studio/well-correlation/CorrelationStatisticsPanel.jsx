import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, MoveVertical, Activity } from 'lucide-react';

const CorrelationStatisticsPanel = ({ lines, wells }) => {
    const stats = useMemo(() => {
        const totalLines = lines.length;
        let totalDip = 0;
        let totalThickness = 0; 
        let validThicknessCount = 0;

        // Calculate basic dip stats from lines
        lines.forEach(l => {
            // Assuming linear dip for now, ideally need well X/Y distance
            const dip = Math.abs(l.depth2 - l.depth1);
            totalDip += dip;
        });

        const avgDip = totalLines > 0 ? totalDip / totalLines : 0;

        return { 
            totalLines, 
            avgDip,
            maxDip: lines.length > 0 ? Math.max(...lines.map(l => Math.abs(l.depth2 - l.depth1))) : 0
        };
    }, [lines]);

    return (
        <div className="p-4 space-y-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3 h-3"/> Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3"/> Avg Dip
                        </div>
                        <div className="text-lg font-bold text-amber-400 font-mono">
                            {stats.avgDip.toFixed(1)} <span className="text-xs text-slate-500 font-normal">m</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                            <MoveVertical className="w-3 h-3"/> Max Dip
                        </div>
                        <div className="text-lg font-bold text-red-400 font-mono">
                            {stats.maxDip.toFixed(1)} <span className="text-xs text-slate-500 font-normal">m</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {stats.totalLines > 0 && (
                <div className="text-[10px] text-slate-500 bg-slate-900 p-2 rounded text-center">
                    Analysis based on {stats.totalLines} active correlation lines.
                </div>
            )}
        </div>
    );
};

export default CorrelationStatisticsPanel;