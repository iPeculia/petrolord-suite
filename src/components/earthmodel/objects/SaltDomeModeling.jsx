import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Droplet, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SaltDomeModeling = ({ onBack }) => {
  const { toast } = useToast();
  const [params, setParams] = useState({
    diameter: 2000,
    height: 3000,
    shape: 'circular',
    overhang: 200
  });

  const handleSave = () => {
    toast({ title: "Salt Dome Saved", description: "Added to object library." });
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
              <Droplet className="w-6 h-6 text-white" />
              Salt Dome Modeling
            </h2>
            <p className="text-slate-400 text-sm">Define salt diapir geometries and interactions.</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-slate-100 text-slate-900 hover:bg-slate-200">
            <Save className="w-4 h-4 mr-2" /> Save Object
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Geometry</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Shape Type</Label>
                    <Select value={params.shape} onValueChange={(v) => setParams({...params, shape: v})}>
                        <SelectTrigger className="bg-slate-950 border-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                            <SelectItem value="circular">Circular Diapir</SelectItem>
                            <SelectItem value="elliptical">Elliptical Wall</SelectItem>
                            <SelectItem value="canopy">Salt Canopy/Sheet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-3">
                    <Label>Base Diameter (m)</Label>
                    <Slider value={[params.diameter]} max={10000} step={100} onValueChange={([v]) => setParams({...params, diameter: v})} />
                    <div className="text-right text-xs text-slate-400 font-mono">{params.diameter}m</div>
                </div>

                <div className="space-y-3">
                    <Label>Height (m)</Label>
                    <Slider value={[params.height]} max={5000} step={100} onValueChange={([v]) => setParams({...params, height: v})} />
                    <div className="text-right text-xs text-slate-400 font-mono">{params.height}m</div>
                </div>

                <div className="space-y-3">
                    <Label>Overhang (m)</Label>
                    <Slider value={[params.overhang]} max={1000} step={50} onValueChange={([v]) => setParams({...params, overhang: v})} />
                    <div className="text-right text-xs text-slate-400 font-mono">{params.overhang}m</div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-white">Vertical Profile Preview</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-[300px] bg-black rounded-lg border border-slate-800 relative overflow-hidden">
                {/* Simple SVG visualization of a salt dome */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-80">
                    <path 
                        d={`M60,200 Q50,150 40,100 Q30,${100 - (params.overhang/20)} 60,50 Q100,20 140,50 Q170,${100 - (params.overhang/20)} 160,100 Q150,150 140,200 Z`} 
                        fill="#e2e8f0" 
                        stroke="none"
                    />
                </svg>
                <div className="absolute bottom-2 right-2 text-xs text-slate-500">Vertical Exaggeration: 1x</div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaltDomeModeling;