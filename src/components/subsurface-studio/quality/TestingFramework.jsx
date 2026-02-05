import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Settings, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

const TestingFramework = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <Terminal className="w-5 h-5 mr-2 text-purple-400" /> Testing Framework
                    </h3>
                    <p className="text-xs text-slate-400">Centralized control for Jest, Cypress, and K6 runners.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" /> Config</Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700"><Play className="w-4 h-4 mr-2" /> Run All Suites</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-300 flex justify-between">
                            Unit Testing (Jest)
                            <Badge variant="outline" className="text-green-400 border-green-800 bg-green-900/20">v29.7.0</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white mb-1">4,238</div>
                        <div className="text-xs text-slate-500">Total Test Cases</div>
                        <div className="mt-3 flex items-center text-xs text-green-400">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> 100% Passing
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-300 flex justify-between">
                            E2E Testing (Cypress)
                            <Badge variant="outline" className="text-blue-400 border-blue-800 bg-blue-900/20">v13.6.0</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white mb-1">142</div>
                        <div className="text-xs text-slate-500">Critical User Flows</div>
                        <div className="mt-3 flex items-center text-xs text-yellow-400">
                            <AlertTriangle className="w-3 h-3 mr-1" /> 2 Flaky Tests Detected
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-300 flex justify-between">
                            Load Testing (k6)
                            <Badge variant="outline" className="text-orange-400 border-orange-800 bg-orange-900/20">v0.48.0</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white mb-1">25ms</div>
                        <div className="text-xs text-slate-500">Avg Response Time (p95)</div>
                        <div className="mt-3 flex items-center text-xs text-green-400">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> SLA Met
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TestingFramework;