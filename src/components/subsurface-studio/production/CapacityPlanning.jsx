import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const CapacityPlanning = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Resource Forecasting</h3>
            <p className="text-sm text-slate-500 mt-2">Projected storage runway: 8 months.</p>
        </CardContent>
    </Card>
);
export default CapacityPlanning;