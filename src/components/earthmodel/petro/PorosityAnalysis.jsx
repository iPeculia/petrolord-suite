import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Layers, Download, TrendingDown } from 'lucide-react';

const PorosityAnalysis = ({ onBack }) => {
  const [model, setModel] = useState('density');

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-orange-500" />
              Porosity Analysis
            </h2>
            <p className="text-slate-400 text-sm">Calculate total and effective porosity from logs.</p>
          </div>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle className="text-white text-base">Method Selection</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Calculation Model</Label>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="density">Density (Rhob)</SelectItem>
                                <SelectItem value="neutron">Neutron (Nphi)</SelectItem>
                                <SelectItem value="sonic">Sonic (Wyllie)</SelectItem>
                                <SelectItem value="nd_combo">Neutron-Density Crossplot</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {model === 'density' && (
                        <>
                            <div className="space-y-2">
                                <Label>Matrix Density (g/cc)</Label>
                                <Input className="bg-slate-950 border-slate-700" defaultValue="2.65" />
                            </div>
                            <div className="space-y-2">
                                <Label>Fluid Density (g/cc)</Label>
                                <Input className="bg-slate-950 border-slate-700" defaultValue="1.0" />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle className="text-white text-base">Compaction Trend</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <TrendingDown className="w-4 h-4" /> Exponential Decay
                    </div>
                    <div className="space-y-2">
                        <Label>Surface Porosity (Phi0)</Label>
                        <Input className="bg-slate-950 border-slate-700" defaultValue="0.45" />
                    </div>
                    <div className="space-y-2">
                        <Label>Compaction Coefficient (k)</Label>
                        <Input className="bg-slate-950 border-slate-700" defaultValue="0.0003" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
            <CardHeader><CardTitle className="text-white text-base">Log Visualization</CardTitle></CardHeader>
            <CardContent className="flex-1 bg-slate-950 m-4 border border-slate-800 rounded flex items-center justify-center">
                <div className="text-slate-500 text-sm">Interactive Log Plot Placeholder</div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PorosityAnalysis;