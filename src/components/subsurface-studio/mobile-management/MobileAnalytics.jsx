import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

const MobileAnalytics = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <PieChart className="w-12 h-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">User Demographics</h3>
            <p className="text-sm text-slate-500 mt-2">65% Mobile vs 35% Desktop</p>
        </CardContent>
    </Card>
);

export default MobileAnalytics;