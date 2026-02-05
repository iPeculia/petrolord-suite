import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PropertyDistributionPanel = ({ onRunModel }) => {
    const { toast } = useToast();
    const [property, setProperty] = useState('porosity');
    const [method, setMethod] = useState('kriging');
    const [range, setRange] = useState(1500); // Variogram range

    const handleRun = () => {
        toast({ title: "Distribution Started", description: `Running ${method} for ${property}...` });
        if(onRunModel) onRunModel(property, method, range);
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-blue-400">
                    <RefreshCw className="w-4 h-4 mr-2" /> Property Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Target Property</Label>
                    <Select value={property} onValueChange={setProperty}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="porosity">Porosity (PHIE)</SelectItem>
                            <SelectItem value="permeability">Permeability (K)</SelectItem>
                            <SelectItem value="saturation">Water Saturation (Sw)</SelectItem>
                            <SelectItem value="facies">Facies</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Algorithm</Label>
                    <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kriging">Kriging (Gaussian)</SelectItem>
                            <SelectItem value="sgs">Seq. Gaussian Sim.</SelectItem>
                            <SelectItem value="idw">Inverse Distance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label className="text-xs text-slate-400">Variogram Range (m)</Label>
                        <span className="text-xs text-slate-300 font-mono">{range}m</span>
                    </div>
                    <Slider 
                        value={[range]} 
                        min={100} max={5000} step={100} 
                        onValueChange={([v]) => setRange(v)}
                    />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs" size="sm" onClick={handleRun}>
                    <Database className="w-3 h-3 mr-2" /> Populate Grid
                </Button>
            </CardContent>
        </Card>
    );
};

export default PropertyDistributionPanel;