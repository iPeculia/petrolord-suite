import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

const DashboardAnalytics = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-2 text-teal-400" /> BI Dashboard Config
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-8 text-center text-slate-500">
                <p>Configure widgets and layout for the main Analytics Overview.</p>
                <div className="grid grid-cols-3 gap-4 mt-6 opacity-50 pointer-events-none">
                    <div className="h-32 bg-slate-900 rounded border border-slate-800"></div>
                    <div className="h-32 bg-slate-900 rounded border border-slate-800"></div>
                    <div className="h-32 bg-slate-900 rounded border border-slate-800"></div>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default DashboardAnalytics;