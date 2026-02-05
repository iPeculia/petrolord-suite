import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecommendationEngine = () => {
    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-gradient-to-br from-yellow-900/20 to-slate-950 border-yellow-900/50 border">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500"><Lightbulb className="w-5 h-5"/></div>
                        <div>
                            <h4 className="text-sm font-bold text-yellow-100">Infill Drilling Opportunity</h4>
                            <p className="text-xs text-yellow-200/70 mt-1">
                                Based on drainage radius analysis, sector 4B is under-depleted. A new vertical well here could recover an additional 1.2 MMbbl.
                            </p>
                            <Button size="sm" variant="ghost" className="mt-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 -ml-2 text-xs">
                                View Location <ArrowRight className="w-3 h-3 ml-1"/>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-full text-blue-500"><Target className="w-5 h-5"/></div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-200">Completion Optimization</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                Increasing proppant concentration by 15% in Stage 4 matches high-yield patterns from offset wells.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecommendationEngine;