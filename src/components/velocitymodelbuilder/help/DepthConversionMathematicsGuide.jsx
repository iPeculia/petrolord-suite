import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FunctionSquare } from 'lucide-react';

const DepthConversionMathematicsGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <FunctionSquare className="w-5 h-5 text-purple-400" /> Depth Conversion Mathematics
      </h2>
      <div className="grid gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Linear Velocity Function (V0 + kZ)</h3>
            <p className="text-sm text-slate-400">
              The standard function for clastic basins where velocity increases with compaction.
            </p>
            <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm text-emerald-400">
              <p>V_inst = V0 + k * Z</p>
              <p className="mt-2 text-xs text-slate-500">
                Z = Depth, V0 = Surface Velocity, k = Compaction Factor
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm text-blue-400">
              <p>Z = (V0/k) * (exp(k*T) - 1)</p>
              <p className="mt-2 text-xs text-slate-500">
                Time-to-Depth explicit formula (where T is One-Way Time)
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Average Velocity Method</h3>
            <p className="text-sm text-slate-400">
              Simple layer-cake conversion often used for quick looks or carbonate layers.
            </p>
            <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-sm text-orange-400">
              <p>Z = V_avg * T_owt</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepthConversionMathematicsGuide;