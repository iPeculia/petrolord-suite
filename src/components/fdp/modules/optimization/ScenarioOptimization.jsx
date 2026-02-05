import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptimizationService } from '@/services/fdp/OptimizationService';
import { Loader2, Play } from 'lucide-react';

const ScenarioOptimization = () => {
    const [optimizing, setOptimizing] = useState(false);
    const [result, setResult] = useState(null);

    const handleOptimize = async () => {
        setOptimizing(true);
        try {
            const res = await OptimizationService.optimizeScenario({}, {}, {});
            setResult(res);
        } finally {
            setOptimizing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white text-sm">Scenario Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center py-8">
                        <Button onClick={handleOptimize} disabled={optimizing} className="bg-purple-600 hover:bg-purple-700 w-48">
                            {optimizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            {optimizing ? 'Optimizing...' : 'Run Optimizer'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">Optimized Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-2">
                                    <span>Well Count</span>
                                    <span className="text-white font-mono">{result.solution.wellCount}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-2">
                                    <span>Facility Capacity</span>
                                    <span className="text-white font-mono">{result.solution.facilityCapacity.toLocaleString()} bpd</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-2">
                                    <span>Schedule Strategy</span>
                                    <span className="text-white font-mono">{result.solution.drillingSchedule}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">Improvement Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase">NPV Improvement</div>
                                    <div className="text-3xl font-bold text-green-400">+{result.improvement.npv}%</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase">CAPEX Reduction</div>
                                    <div className="text-3xl font-bold text-blue-400">{Math.abs(result.improvement.capex)}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ScenarioOptimization;