import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
        </CardContent>
    </Card>
);

const OptimizationOverview = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Potential NPV Uplift" 
                    value="+$45M" 
                    subtitle="Identified via optimization" 
                    icon={ArrowUpRight} 
                    color="green" 
                />
                <StatCard 
                    title="Cost Savings" 
                    value="12%" 
                    subtitle="CAPEX reduction opportunities" 
                    icon={Zap} 
                    color="blue" 
                />
                <StatCard 
                    title="Optimization Runs" 
                    value="28" 
                    subtitle="Scenarios evaluated" 
                    icon={Target} 
                    color="purple" 
                />
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                            <div>
                                <h4 className="text-white font-medium">Drilling Campaign Acceleration</h4>
                                <p className="text-sm text-slate-400">Adding a 2nd rig reduces time to first oil by 6 months, improving NPV by $32M.</p>
                            </div>
                            <span className="bg-green-900 text-green-300 px-3 py-1 rounded text-xs font-bold">High Impact</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                            <div>
                                <h4 className="text-white font-medium">Facility Capacity Rightsizing</h4>
                                <p className="text-sm text-slate-400">Reducing gas handling capacity to 150 MMscfd saves $45M CAPEX with minimal production deferment.</p>
                            </div>
                            <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded text-xs font-bold">Medium Impact</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OptimizationOverview;