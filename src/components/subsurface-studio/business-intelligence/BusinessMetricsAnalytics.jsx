import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, CreditCard, Briefcase, Users } from 'lucide-react';

const BusinessMetricsAnalytics = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-green-400" /> Business KPI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">MRR</div>
                    <div className="text-2xl font-bold text-white flex items-center">
                        <DollarSign className="w-5 h-5 text-green-500" /> 24,500
                    </div>
                    <div className="text-[10px] text-green-400">+5.2% vs last month</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">Enterprise Seats</div>
                    <div className="text-2xl font-bold text-white flex items-center">
                        <Users className="w-5 h-5 text-blue-500 mr-2" /> 1,240
                    </div>
                    <div className="text-[10px] text-slate-400">85% Utilization</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">Churn Rate</div>
                    <div className="text-2xl font-bold text-white flex items-center">
                        <CreditCard className="w-5 h-5 text-red-500 mr-2" /> 1.2%
                    </div>
                    <div className="text-[10px] text-green-400">-0.1% vs last month</div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default BusinessMetricsAnalytics;