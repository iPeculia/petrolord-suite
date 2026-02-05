import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Settings2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FaciesModeler = () => {
  const { toast } = useToast();
  const [method, setMethod] = useState('sis');
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setProgress(0);
    toast({ title: "Simulation Started", description: `Running ${method === 'sis' ? 'Sequential Indicator Simulation' : 'Object Modeling'}...` });
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          toast({ title: "Simulation Complete", description: "Facies model generated successfully." });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
      <CardHeader>
        <CardTitle className="text-white">Facies Modeling</CardTitle>
        <CardDescription>Stochastic simulation configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 overflow-auto">
        <div className="space-y-2">
          <Label className="text-slate-300">Algorithm</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="sis">Sequential Indicator Simulation (SIS)</SelectItem>
              <SelectItem value="object">Object-Based Modeling (Boolean)</SelectItem>
              <SelectItem value="ik">Indicator Kriging (Deterministic)</SelectItem>
              <SelectItem value="tgs">Truncated Gaussian Simulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="variogram" className="w-full">
          <TabsList className="bg-slate-950 border border-slate-800 w-full">
            <TabsTrigger value="variogram" className="flex-1">Variogram</TabsTrigger>
            <TabsTrigger value="conditioning" className="flex-1">Conditioning</TabsTrigger>
            <TabsTrigger value="trends" className="flex-1">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="variogram" className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-slate-400">Major Range (m)</Label>
                <span className="text-sm font-mono text-emerald-400">1500</span>
              </div>
              <Slider defaultValue={[1500]} max={5000} step={100} className="py-2" />
              
              <div className="flex justify-between items-center">
                <Label className="text-slate-400">Minor Range (m)</Label>
                <span className="text-sm font-mono text-emerald-400">800</span>
              </div>
              <Slider defaultValue={[800]} max={3000} step={50} className="py-2" />
              
              <div className="flex justify-between items-center">
                <Label className="text-slate-400">Vertical Range (m)</Label>
                <span className="text-sm font-mono text-emerald-400">15</span>
              </div>
              <Slider defaultValue={[15]} max={100} step={1} className="py-2" />
              
              <div className="flex justify-between items-center">
                <Label className="text-slate-400">Azimuth (deg)</Label>
                <span className="text-sm font-mono text-emerald-400">45</span>
              </div>
              <Slider defaultValue={[45]} max={360} step={5} className="py-2" />
            </div>
          </TabsContent>
          
          <TabsContent value="conditioning" className="mt-4 p-4 text-sm text-slate-400 bg-slate-950 border border-slate-800 rounded-lg">
            <p>Hard data conditioning enabled for 12 wells.</p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">Well-A1</Badge>
              <Badge variant="outline">Well-B2</Badge>
              <Badge variant="outline">+10 others</Badge>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label className="text-slate-300">Number of Realizations</Label>
          <Select defaultValue="1">
            <SelectTrigger className="bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="1">1 (Single Run)</SelectItem>
              <SelectItem value="10">10 (Quick Uncertainty)</SelectItem>
              <SelectItem value="50">50 (Standard)</SelectItem>
              <SelectItem value="100">100 (Detailed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Simulation Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={handleRun} disabled={isRunning}>
          {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FaciesModeler;