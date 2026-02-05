import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';

const UncertaintyAnalysis = () => {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white">Sensitivity Parameters</CardTitle>
          <CardDescription>Variables influencing STOIIP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['OWC Depth', 'Average Porosity', 'Net-to-Gross', 'Formation Volume Factor'].map((param, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-sm text-slate-300">{param}</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                ± 15%
              </Badge>
            </div>
          ))}
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-500">
            <TrendingUp className="w-4 h-4 mr-2" /> Run Sensitivity
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Tornado Chart</CardTitle>
          <CardDescription>Impact on Gross Rock Volume (GRV)</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] bg-slate-950/50 rounded-lg border border-slate-800 border-dashed">
          <div className="text-center text-slate-500">
            <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chart visualization placeholder</p>
            <p className="text-xs">Run sensitivity analysis to generate results</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UncertaintyAnalysis;