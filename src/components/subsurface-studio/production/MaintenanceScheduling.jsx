import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const MaintenanceScheduling = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 mx-auto text-orange-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Maintenance Windows</h3>
            <p className="text-sm text-slate-500 mt-2">Next window: Sunday, 02:00 AM UTC (Database Vacuum).</p>
        </CardContent>
    </Card>
);
export default MaintenanceScheduling;