import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, GitMerge, ArrowRight } from 'lucide-react';

const LogFaciesAdvanced = () => {
  return (
    <div className="h-full p-6 bg-slate-950 overflow-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Advanced Log Facies Integration</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Model Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Well-A1 Match</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400">98%</Badge>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
              </div>
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Well-B2 Match</span>
                  <Badge className="bg-yellow-500/10 text-yellow-400">85%</Badge>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[85%]" />
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-500">
              <GitMerge className="w-4 h-4 mr-2" /> Auto-Correlate
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Facies Probability Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-slate-800 rounded bg-slate-950/50 text-slate-500">
              Visualization of Facies Probabilities vs Depth (Mock)
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                View Detailed Logs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogFaciesAdvanced;