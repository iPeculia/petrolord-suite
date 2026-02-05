import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateFacilityCost } from '@/utils/fdp/facilitiesCalculations';
import { DollarSign } from 'lucide-react';

const FacilitiesCostEstimation = ({ facility }) => {
    if (!facility) return <div className="text-slate-500 p-4">Select a facility to view costs.</div>;

    const costs = calculateFacilityCost(facility);
    const lifeOfField = facility.designLife || 20;
    const totalLifecycle = costs.capex + (costs.opex * lifeOfField) + costs.decommissioning;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Total CAPEX</div>
                        <div className="text-2xl font-bold text-orange-400">${costs.capex.toFixed(1)}M</div>
                        <div className="text-xs text-slate-500 mt-1">Initial investment</div>
                    </div>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Annual OPEX</div>
                        <div className="text-2xl font-bold text-orange-300">${costs.opex.toFixed(1)}M</div>
                        <div className="text-xs text-slate-500 mt-1">Per year operation</div>
                    </div>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <div className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Lifecycle Cost</div>
                        <div className="text-2xl font-bold text-white">${totalLifecycle.toFixed(1)}M</div>
                        <div className="text-xs text-slate-500 mt-1">{lifeOfField} years + decom</div>
                    </div>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-white flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        Cost Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                                <span>Hull / Structure</span>
                                <span>35%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-slate-500 h-full" style={{ width: '35%' }} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                                <span>Topsides / Processing</span>
                                <span>45%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-slate-400 h-full" style={{ width: '45%' }} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-300">
                                <span>Mooring / Installation</span>
                                <span>20%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-slate-600 h-full" style={{ width: '20%' }} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacilitiesCostEstimation;