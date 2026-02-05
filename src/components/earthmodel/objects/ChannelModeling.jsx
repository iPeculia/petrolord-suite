import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, GitBranch, Save, Play, Box, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ChannelModeling = ({ onBack }) => {
  const { toast } = useToast();
  const [params, setParams] = useState({
    width: 250,
    depth: 12,
    sinuosity: 1.4,
    length: 2500,
    azimuth: 45,
    stacking: 'vertical'
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSave = () => {
    toast({ title: "Channel Object Saved", description: "Geometry and properties stored in library." });
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
        setIsSimulating(false);
        toast({ title: "Preview Updated", description: "Channel visualization refreshed." });
    }, 1000);
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
              <GitBranch className="w-6 h-6 text-orange-500" />
              Channel Modeling
            </h2>
            <p className="text-slate-400 text-sm">Define fluvial and submarine channel geometries.</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300" onClick={handleSimulate} disabled={isSimulating}>
                {isSimulating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Preview
            </Button>
            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-500">
                <Save className="w-4 h-4 mr-2" /> Save Object
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-base text-white">Geometry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Width (m)</Label>
                            <span className="text-xs text-orange-400 font-mono">{params.width}</span>
                        </div>
                        <Slider 
                            value={[params.width]} 
                            max={1000} 
                            step={10} 
                            onValueChange={([v]) => setParams({...params, width: v})} 
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Thickness/Depth (m)</Label>
                            <span className="text-xs text-orange-400 font-mono">{params.depth}</span>
                        </div>
                        <Slider 
                            value={[params.depth]} 
                            max={50} 
                            step={1} 
                            onValueChange={([v]) => setParams({...params, depth: v})} 
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Sinuosity Index</Label>
                            <span className="text-xs text-orange-400 font-mono">{params.sinuosity}</span>
                        </div>
                        <Slider 
                            value={[params.sinuosity]} 
                            min={1.0} max={3.0} 
                            step={0.1} 
                            onValueChange={([v]) => setParams({...params, sinuosity: v})} 
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Length (m)</Label>
                            <span className="text-xs text-orange-400 font-mono">{params.length}</span>
                        </div>
                        <Slider 
                            value={[params.length]} 
                            max={10000} 
                            step={100} 
                            onValueChange={([v]) => setParams({...params, length: v})} 
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-base text-white">Orientation & Stacking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Azimuth (deg)</Label>
                            <span className="text-xs text-orange-400 font-mono">{params.azimuth}°</span>
                        </div>
                        <div className="relative w-24 h-24 mx-auto border-2 border-slate-700 rounded-full flex items-center justify-center bg-slate-950">
                            <div 
                                className="absolute w-1 h-10 bg-orange-500 origin-bottom top-2 left-1/2 -translate-x-1/2 transition-transform"
                                style={{ transform: `rotate(${params.azimuth}deg) translateY(-50%)` }}
                            />
                            <span className="text-xs text-slate-500">N</span>
                        </div>
                        <Slider 
                            value={[params.azimuth]} 
                            max={360} 
                            step={5} 
                            onValueChange={([v]) => setParams({...params, azimuth: v})} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Stacking Pattern</Label>
                        <Select value={params.stacking} onValueChange={(v) => setParams({...params, stacking: v})}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="vertical">Vertical Aggregation</SelectItem>
                                <SelectItem value="lateral">Lateral Migration</SelectItem>
                                <SelectItem value="compensational">Compensational</SelectItem>
                                <SelectItem value="random">Random</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col overflow-hidden relative">
                <CardHeader className="absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-slate-900/80 to-transparent pb-8 pt-4 px-4">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Box className="w-4 h-4" /> 3D Preview
                    </CardTitle>
                </CardHeader>
                <div className="flex-1 bg-black relative flex items-center justify-center">
                    {/* Placeholder for actual WebGL canvas */}
                    <div className="text-center">
                        <div className="w-64 h-32 border border-dashed border-slate-700 rounded flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                            {/* Simple CSS representation of a sinuous channel */}
                            <svg width="100%" height="100%" viewBox="0 0 200 100" className="opacity-50">
                                <path 
                                    d={`M0,50 Q50,${50 - (params.sinuosity * 20)} 100,50 T200,50`} 
                                    fill="none" 
                                    stroke="#f97316" 
                                    strokeWidth={params.width / 20} // Scaled width
                                    className="drop-shadow-lg"
                                />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-sm">Interactive 3D preview available on desktop client</p>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 p-2 rounded border border-slate-800 backdrop-blur">
                        <p className="text-xs text-slate-400 font-mono">
                            Vol: {((params.width * params.depth * params.length) / 1e6).toFixed(2)} Mm³
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="h-48 bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm text-white">Properties Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <Tabs defaultValue="porosity" className="w-full">
                        <TabsList className="bg-slate-950 border-slate-800 mb-4">
                            <TabsTrigger value="porosity">Porosity</TabsTrigger>
                            <TabsTrigger value="perm">Permeability</TabsTrigger>
                            <TabsTrigger value="facies">Facies</TabsTrigger>
                        </TabsList>
                        <TabsContent value="porosity" className="text-sm text-slate-400">
                            <div className="flex items-center gap-4">
                                <Label className="w-24">Mean PHI</Label>
                                <Input className="w-24 h-8 bg-slate-950 border-slate-700" defaultValue="0.25" />
                                <span className="text-xs">v/v</span>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ChannelModeling;