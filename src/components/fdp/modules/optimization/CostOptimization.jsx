import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const CostOptimization = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Pareto Analysis (Top Cost Drivers)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>FPSO Lease / Purchase</span>
                                    <span>35% of Total</span>
                                </div>
                                <Progress value={35} className="h-2 bg-slate-800" indicatorClassName="bg-red-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>Drilling Rig Rate</span>
                                    <span>25% of Total</span>
                                </div>
                                <Progress value={25} className="h-2 bg-slate-800" indicatorClassName="bg-orange-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>Subsea Umbilicals</span>
                                    <span>15% of Total</span>
                                </div>
                                <Progress value={15} className="h-2 bg-slate-800" indicatorClassName="bg-yellow-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Optimization Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
                                <div>
                                    <span className="text-slate-200 font-medium">Equipment Standardization</span>
                                    <p className="text-slate-400 text-xs">Potential savings: $15M by using standard subsea trees.</p>
                                </div>
                            </li>
                            <li className="flex items-start text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
                                <div>
                                    <span className="text-slate-200 font-medium">Campaign Grouping</span>
                                    <p className="text-slate-400 text-xs">Grouping with nearby project saves mob/demob costs ($5M).</p>
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CostOptimization;