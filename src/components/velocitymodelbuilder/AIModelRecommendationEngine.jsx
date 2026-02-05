import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIModelRecommendationEngine = () => {
  const recommendations = [
    { 
        id: 1, 
        title: 'Acquire Checkshot for Well-09', 
        desc: 'High uncertainty in SE sector. A checkshot here would reduce depth error by ~15%.', 
        impact: 'High', 
        icon: Target 
    },
    { 
        id: 2, 
        title: 'Switch Layer 2 to Compaction Trend', 
        desc: 'Linear gradient fit is poor (R²=0.65). Compaction trend improves fit to R²=0.92.', 
        impact: 'Medium', 
        icon: TrendingUp 
    },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" /> Strategic Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {recommendations.map(rec => (
            <div key={rec.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                <div className="flex gap-3">
                    <div className="mt-1 min-w-[24px]">
                        <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                            <rec.icon className="w-3 h-3 text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-200">{rec.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">{rec.desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${rec.impact === 'High' ? 'bg-red-900/20 text-red-400 border-red-900' : 'bg-blue-900/20 text-blue-400 border-blue-900'}`}>
                                Impact: {rec.impact}
                            </span>
                            <Button variant="link" className="h-auto p-0 text-[10px] text-emerald-400 hover:text-emerald-300">
                                Apply Fix <ArrowRight className="w-2 h-2 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIModelRecommendationEngine;