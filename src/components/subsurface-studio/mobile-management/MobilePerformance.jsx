import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BatteryCharging } from 'lucide-react';

const MobilePerformance = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <BatteryCharging className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Resource Impact</h3>
            <p className="text-sm text-slate-500 mt-2">Est. Battery Drain: Low (&lt; 5% / hr)</p>
        </CardContent>
    </Card>
);

export default MobilePerformance;