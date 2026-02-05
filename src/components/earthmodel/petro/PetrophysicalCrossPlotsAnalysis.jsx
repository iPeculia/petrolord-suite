import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2, Maximize2 } from 'lucide-react';

const PetrophysicalCrossPlotsAnalysis = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-pink-500" />
              Cross-Plot Analysis
            </h2>
            <p className="text-slate-400 text-sm">Multi-well property regressions and clustering.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-white text-sm">Porosity vs. Permeability (Semi-Log)</CardTitle>
                <Maximize2 className="w-4 h-4 text-slate-500 cursor-pointer" />
            </CardHeader>
            <CardContent className="flex-1 relative">
                <div className="absolute inset-4 border border-dashed border-slate-700 rounded bg-slate-950 flex items-center justify-center text-slate-600">
                    Scatter Plot Area
                </div>
            </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-white text-sm">Neutron vs. Density (Lithology)</CardTitle>
                <Maximize2 className="w-4 h-4 text-slate-500 cursor-pointer" />
            </CardHeader>
            <CardContent className="flex-1 relative">
                <div className="absolute inset-4 border border-dashed border-slate-700 rounded bg-slate-950 flex items-center justify-center text-slate-600">
                    Scatter Plot Area
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetrophysicalCrossPlotsAnalysis;