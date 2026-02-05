import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

const PerformanceOptimization = () => {
    return (
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4 text-yellow-400 font-bold text-sm">
                    <Zap className="h-4 w-4" /> Power Saver Mode
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300">Reduce 3D Quality</Label>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300">Disable Animations</Label>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-300">Limit FPS (30)</Label>
                        <Switch defaultChecked />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PerformanceOptimization;