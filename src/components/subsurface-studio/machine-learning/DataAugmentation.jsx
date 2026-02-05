import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { CopyPlus } from 'lucide-react';

const DataAugmentation = () => {
    return (
        <div className="space-y-4 h-full p-1">
             <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><CopyPlus className="w-4 h-4 mr-2 text-orange-400"/> Synthetic Data Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Noise Injection Level</Label>
                        <Slider defaultValue={[10]} max={50} step={1} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Sample Multiplier (x)</Label>
                        <Slider defaultValue={[2]} max={10} step={1} />
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Generate Synthetic Samples</Button>
                </CardContent>
             </Card>
        </div>
    );
};

export default DataAugmentation;