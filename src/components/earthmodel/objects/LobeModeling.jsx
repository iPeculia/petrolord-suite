import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Layers, Save, Play, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LobeModeling = ({ onBack }) => {
  const { toast } = useToast();
  const [params, setParams] = useState({
    length: 1500,
    width: 800,
    thickness: 8,
    azimuth: 0,
    curvature: 0.5
  });

  const handleSave = () => {
    toast({ title: "Lobe Object Saved", description: "Added to object library." });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-yellow-500" />
              Lobe Modeling
            </h2>
            <p className="text-slate-400 text-sm">Define deltaic and fan lobe geometries.</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-500">
            <Save className="w-4 h-4 mr-2" /> Save Object
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Dimensions</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Radial Length (m)</Label>
                    <Slider value={[params.length]} max={5000} step={50} onValueChange={([v]) => setParams({...params, length: v})} />
                    <div className="text-right text-xs text-yellow-400 font-mono">{params.length}m</div>
                </div>
                <div className="space-y-3">
                    <Label>Max Width (m)</Label>
                    <Slider value={[params.width]} max={3000} step={50} onValueChange={([v]) => setParams({...params, width: v})} />
                    <div className="text-right text-xs text-yellow-400 font-mono">{params.width}m</div>
                </div>
                <div className="space-y-3">
                    <Label>Max Thickness (m)</Label>
                    <Slider value={[params.thickness]} max={50} step={1} onValueChange={([v]) => setParams({...params, thickness: v})} />
                    <div className="text-right text-xs text-yellow-400 font-mono">{params.thickness}m</div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Orientation</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
                 <div className="relative w-40 h-40 border-2 border-slate-700 rounded-full flex items-center justify-center bg-slate-950">
                    <div 
                        className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[40px] border-b-yellow-500 origin-bottom top-1/2 left-1/2 -translate-x-1/2 -translate-y-full transition-transform"
                        style={{ transform: `translate(-50%, 0) rotate(${params.azimuth}deg)` }}
                    />
                    <span className="text-xs text-slate-500 absolute top-2">0°</span>
                    <span className="text-xs text-slate-500 absolute right-2">90°</span>
                    <span className="text-xs text-slate-500 absolute bottom-2">180°</span>
                    <span className="text-xs text-slate-500 absolute left-2">270°</span>
                </div>
                <div className="mt-4 w-full">
                    <Slider value={[params.azimuth]} max={360} step={5} onValueChange={([v]) => setParams({...params, azimuth: v})} />
                    <div className="text-center mt-2 text-sm text-white">{params.azimuth}°</div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Preview</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-64 bg-black rounded-lg border border-slate-800">
                <div className="text-slate-500 text-sm">Top-down View</div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LobeModeling;