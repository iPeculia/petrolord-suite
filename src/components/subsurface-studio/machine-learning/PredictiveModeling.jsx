import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

const PredictiveModeling = () => {
    const data = [
        { depth: 1000, actual: 20, predicted: 22 },
        { depth: 1100, actual: 25, predicted: 24 },
        { depth: 1200, actual: 40, predicted: 38 },
        { depth: 1300, actual: 35, predicted: 36 },
        { depth: 1400, actual: 28, predicted: 30 },
    ];

    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-slate-200">
                        <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" /> Production Rate Forecast
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="depth" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                                <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual" />
                                <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeDasharray="5 5" name="AI Prediction" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button size="sm" className="bg-emerald-600">Run Prediction</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PredictiveModeling;