import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Layers, Play } from 'lucide-react';
import { earthModelService } from '@/services/earthModelService';

const SurfaceBuilder = ({ activeProject, onJobSubmitted }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    inputData: '',
    method: 'kriging',
    resolution: 100,
    smoothing: 0.5,
    name: 'New Surface'
  });

  const handleSubmit = async () => {
    if(!activeProject) {
        toast({ title: "No Active Project", description: "Please select a project first.", variant: "destructive"});
        return;
    }
    
    try {
        // Simulate job submission
        await earthModelService.createJob(activeProject.id, 'interpolation', config);
        toast({ title: "Job Submitted", description: `Building surface: ${config.name}` });
        if(onJobSubmitted) onJobSubmitted();
    } catch (e) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
        <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-blue-500"/> Surface Builder
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Surface Name</Label>
                    <Input 
                        value={config.name} 
                        onChange={(e) => setConfig({...config, name: e.target.value})}
                        placeholder="e.g., Top Reservoir" 
                    />
                </div>

                <div className="space-y-2">
                    <Label>Input Data Source</Label>
                    <Select onValueChange={(v) => setConfig({...config, inputData: v})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select well tops or point set" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="wells_top_a">Wells - Top A</SelectItem>
                            <SelectItem value="wells_top_b">Wells - Top B</SelectItem>
                            <SelectItem value="seismic_points">Seismic Points</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Interpolation Method</Label>
                    <Select defaultValue="kriging" onValueChange={(v) => setConfig({...config, method: v})}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kriging">Kriging (Gaussian Process)</SelectItem>
                            <SelectItem value="min_curvature">Minimum Curvature</SelectItem>
                            <SelectItem value="idw">Inverse Distance Weighting</SelectItem>
                            <SelectItem value="convergent">Convergent Interpolation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>Grid Resolution (m)</Label>
                            <span className="text-slate-400">{config.resolution}m</span>
                        </div>
                        <Slider 
                            defaultValue={[100]} 
                            max={500} 
                            min={10} 
                            step={10} 
                            onValueChange={(v) => setConfig({...config, resolution: v[0]})}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>Smoothing Factor</Label>
                            <span className="text-slate-400">{config.smoothing}</span>
                        </div>
                        <Slider 
                            defaultValue={[0.5]} 
                            max={1} 
                            min={0} 
                            step={0.1} 
                            onValueChange={(v) => setConfig({...config, smoothing: v[0]})}
                        />
                    </div>
                </div>

                <Button className="w-full mt-4" onClick={handleSubmit}>
                    <Play className="mr-2 h-4 w-4" /> Build Surface
                </Button>
            </CardContent>
        </Card>
    </div>
  );
};

export default SurfaceBuilder;