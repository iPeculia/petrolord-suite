import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateFacilityCapacity, identifyBottlenecks } from '@/utils/fdp/facilitiesCalculations';
import { AlertTriangle, BarChart } from 'lucide-react';

const FacilitiesCapacityAnalysis = ({ facility }) => {
    if (!facility) return <div className="text-slate-500 p-4">Select a facility to view capacity analysis.</div>;

    const capacity = calculateFacilityCapacity(facility);
    // Mock peak production for bottleneck check
    const peakProd = { oil: 110000, gas: 180, water: 90000 };
    const bottlenecks = identifyBottlenecks(facility, peakProd);

    const utilization = Math.round((peakProd.oil / capacity.oilCapacity) * 100);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Oil Capacity</div>
                        <div className="text-2xl font-bold text-white">{capacity.oilCapacity.toLocaleString()} <span className="text-xs text-slate-500">bpd</span></div>
                        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: `${Math.min(utilization, 100)}%` }} />
                        </div>
                        <div className="text-xs text-right mt-1 text-slate-400">{utilization}% Utilization</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Gas Capacity</div>
                        <div className="text-2xl font-bold text-white">{capacity.gasCapacity.toLocaleString()} <span className="text-xs text-slate-500">MMscfd</span></div>
                        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: '60%' }} />
                        </div>
                        <div className="text-xs text-right mt-1 text-slate-400">60% Utilization</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-400 uppercase">Water Handling</div>
                        <div className="text-2xl font-bold text-white">{capacity.waterHandling.toLocaleString()} <span className="text-xs text-slate-500">bpd</span></div>
                        <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full" style={{ width: '45%' }} />
                        </div>
                        <div className="text-xs text-right mt-1 text-slate-400">45% Utilization</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                        Identified Bottlenecks (Peak Production)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {bottlenecks.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                            {bottlenecks.map((b, i) => (
                                <li key={i} className="text-red-300">{b}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-green-400">No bottlenecks identified for base profile.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FacilitiesCapacityAnalysis;