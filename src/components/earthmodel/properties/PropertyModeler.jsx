import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PropertyModeler = () => {
  const { toast } = useToast();
  const [property, setProperty] = useState('phi');
  const [method, setMethod] = useState('sgs');

  const handleRun = () => {
    toast({ title: "Modeling Started", description: `Distributing ${property} using ${method}...` });
  };

  return (
    <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
      <CardHeader>
        <CardTitle className="text-white">Property Modeling</CardTitle>
        <CardDescription>Geostatistical distribution of properties</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        <div className="space-y-2">
          <Label className="text-slate-300">Target Property</Label>
          <Select value={property} onValueChange={setProperty}>
            <SelectTrigger className="bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="phi">Porosity (PHI)</SelectItem>
              <SelectItem value="k">Permeability (K)</SelectItem>
              <SelectItem value="sw">Water Saturation (Sw)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Algorithm</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="sgs">Sequential Gaussian Simulation (SGS)</SelectItem>
              <SelectItem value="kriging">Ordinary Kriging (Deterministic)</SelectItem>
              <SelectItem value="cokriging">Co-Kriging (Multivariate)</SelectItem>
              <SelectItem value="moving_avg">Moving Average</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-sm font-medium text-slate-300 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-400" /> Constraints
          </h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="facies-control" defaultChecked />
            <Label htmlFor="facies-control" className="text-sm text-slate-400">Condition to Facies Model</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="trend-control" />
            <Label htmlFor="trend-control" className="text-sm text-slate-400">Apply Vertical Trend</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="soft-data" />
            <Label htmlFor="soft-data" className="text-sm text-slate-400">Use Seismic as Soft Data (Co-kriging)</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleRun}>
          <Play className="w-4 h-4 mr-2" /> Run Distribution
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyModeler;