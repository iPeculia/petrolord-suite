import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Activity } from 'lucide-react';

const FaultBuilder = () => {
  return (
    <Card className="h-full bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Fault Framework</CardTitle>
            <CardDescription>Define structural faults and throws</CardDescription>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
            <Plus className="w-4 h-4 mr-2" /> New Fault
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-xs text-slate-500 uppercase">Major Faults</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">45</div>
              <div className="text-xs text-slate-500 uppercase">Fault Sticks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">Sealed</div>
              <div className="text-xs text-slate-500 uppercase">Status</div>
            </div>
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center p-3 bg-slate-950 border border-slate-800 rounded hover:border-blue-500/50 cursor-pointer">
                <Activity className="w-4 h-4 text-rose-500 mr-3" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">Fault_Major_0{i}</div>
                  <div className="text-xs text-slate-500">Normal • Throw: 120m • Dip: 65°</div>
                </div>
                <div className="text-xs font-mono text-slate-600">Valid</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaultBuilder;