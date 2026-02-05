import React from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ScenarioSetComparator = () => {
  const scenarios = [
    { name: 'Low Case (P10)', depthDiff: '-45m', volDiff: '-12%', color: 'bg-red-500' },
    { name: 'Base Case (P50)', depthDiff: '0m', volDiff: '0%', color: 'bg-blue-500' },
    { name: 'High Case (P90)', depthDiff: '+55m', volDiff: '+15%', color: 'bg-emerald-500' }
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2 border-b border-slate-800">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-amber-400"/> Scenario Comparator
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
            {scenarios.map((scen, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${scen.color}`}></div>
                            <span className="text-sm font-medium text-slate-200">{scen.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-slate-700">{scen.volDiff} GRV</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Depth Impact @ Top Res:</span>
                        <span className={`${scen.depthDiff.startsWith('-') ? 'text-red-400' : scen.depthDiff.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
                            {scen.depthDiff}
                        </span>
                    </div>
                    <Progress value={50 + parseFloat(scen.volDiff)} className="h-1 bg-slate-800" indicatorClassName={scen.color.replace('bg-', 'bg-')} />
                </div>
            ))}
        </CardContent>
    </Card>
  );
};

export default ScenarioSetComparator;