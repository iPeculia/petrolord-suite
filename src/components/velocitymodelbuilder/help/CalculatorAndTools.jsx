import React from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalculatorAndTools = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Calculator className="w-5 h-5 text-emerald-400" /> Interactive Tools
      </h2>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col items-center text-center space-y-4">
        <p className="text-slate-300 text-sm">
            Access our quick-look calculators without leaving the help center.
        </p>
        <div className="flex gap-4">
            <Button variant="outline" className="border-slate-700">V0-k Estimator</Button>
            <Button variant="outline" className="border-slate-700">Depth Converter</Button>
            <Button variant="outline" className="border-slate-700">Unit Swap (ft/m)</Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorAndTools;