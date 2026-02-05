import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

const InteractiveTraining = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Gamepad2 className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Interactive Simulations</h3>
            <p className="text-sm text-slate-500 mt-2">Walkthroughs and guided tours configuration.</p>
        </CardContent>
    </Card>
);
export default InteractiveTraining;