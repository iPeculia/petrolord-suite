import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';

const PetrophysicalVisualization = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">Data Visualization</h2>
            <p className="text-slate-400 text-sm">Interactive plots for petrophysical analysis.</p>
          </div>
        </div>
        <Button variant="outline" className="border-slate-700">
          <Download className="w-4 h-4 mr-2" /> Export Plots
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-sm">Porosity vs Permeability (Semi-Log)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative bg-slate-950 m-4 rounded border border-slate-800 border-dashed flex items-center justify-center">
            <div className="text-slate-500 text-sm">Scatter Plot Canvas</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-sm">Water Saturation Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative bg-slate-950 m-4 rounded border border-slate-800 border-dashed flex items-center justify-center">
            <div className="text-slate-500 text-sm">Histogram Canvas</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-sm">Buckles Plot (BVW)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative bg-slate-950 m-4 rounded border border-slate-800 border-dashed flex items-center justify-center">
            <div className="text-slate-500 text-sm">Buckles Plot Canvas</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white text-sm">Pickett Plot</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative bg-slate-950 m-4 rounded border border-slate-800 border-dashed flex items-center justify-center">
            <div className="text-slate-500 text-sm">Pickett Plot Canvas</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetrophysicalVisualization;