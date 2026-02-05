import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskIntegrationService } from '@/services/fdp/RiskIntegrationService';

const RiskMatrix = ({ risks }) => {
    const matrixData = RiskIntegrationService.getMatrixData(risks);
    
    // Matrix labels
    const impacts = ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'];
    const probabilities = ['Almost Certain', 'Likely', 'Possible', 'Unlikely', 'Rare']; // Rows top to bottom

    const getCellColor = (r, c) => {
        // Standard risk matrix coloring
        // r is row (0=Almost Certain, 4=Rare)
        // c is col (0=Negligible, 4=Catastrophic)
        // Calculation based on score roughly: (5-r) * (c+1)
        const score = (5-r) * (c+1);
        if (score >= 15) return 'bg-red-600 hover:bg-red-500';
        if (score >= 8) return 'bg-orange-500 hover:bg-orange-400';
        if (score >= 4) return 'bg-yellow-500 hover:bg-yellow-400';
        return 'bg-green-500 hover:bg-green-400';
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white text-sm">Risk Heat Map</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
                <div className="relative">
                    {/* Y Axis Label */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Probability
                    </div>

                    <div className="grid grid-cols-[auto_1fr] gap-2">
                        {/* Y Axis Ticks */}
                        <div className="flex flex-col justify-between py-4 text-right pr-2">
                            {probabilities.map(p => (
                                <div key={p} className="h-16 flex items-center justify-end text-xs text-slate-400 font-medium">{p}</div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            {/* Matrix Grid */}
                            <div className="grid grid-rows-5 gap-1">
                                {matrixData.map((row, rIdx) => (
                                    <div key={rIdx} className="grid grid-cols-5 gap-1">
                                        {row.map((count, cIdx) => (
                                            <div 
                                                key={cIdx} 
                                                className={`w-24 h-16 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm transition-colors cursor-pointer ${getCellColor(rIdx, cIdx)}`}
                                                title={`${probabilities[rIdx]} / ${impacts[cIdx]}`}
                                            >
                                                {count > 0 ? count : ''}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* X Axis Ticks */}
                            <div className="grid grid-cols-5 gap-1 text-center pt-2">
                                {impacts.map(i => (
                                    <div key={i} className="text-xs text-slate-400 font-medium w-24">{i}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* X Axis Label */}
                    <div className="text-center mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-24">
                        Impact (Consequence)
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RiskMatrix;