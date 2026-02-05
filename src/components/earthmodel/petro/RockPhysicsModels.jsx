import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, Settings } from 'lucide-react';

const RockPhysicsModels = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-rose-500" />
              Rock Physics Modeling
            </h2>
            <p className="text-slate-400 text-sm">Fluid substitution and velocity modeling.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Gassmann Fluid Substitution</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">Calculate elastic properties for different fluid scenarios (Brine, Oil, Gas).</p>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-slate-700 text-slate-300 h-20 flex flex-col gap-2">
                        <span className="text-lg font-bold">In-Situ</span>
                        <span className="text-xs font-normal">Original Conditions</span>
                    </Button>
                    <Button variant="outline" className="border-slate-700 text-slate-300 h-20 flex flex-col gap-2">
                        <span className="text-lg font-bold text-rose-400">100% Brine</span>
                        <span className="text-xs font-normal">Wet Case</span>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Velocity-Porosity Transforms</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-700">
                    <span className="text-slate-300 text-sm">Wyllie Time Average</span>
                    <Settings className="w-4 h-4 text-slate-500 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-700">
                    <span className="text-slate-300 text-sm">Raymer-Hunt-Gardner</span>
                    <Settings className="w-4 h-4 text-slate-500 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-700">
                    <span className="text-slate-300 text-sm">Han (Shaly Sand)</span>
                    <Settings className="w-4 h-4 text-slate-500 cursor-pointer" />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RockPhysicsModels;