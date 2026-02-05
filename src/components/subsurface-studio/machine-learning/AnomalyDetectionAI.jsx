import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Search } from 'lucide-react';

const AnomalyDetectionAI = () => {
    return (
        <div className="space-y-4 h-full p-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="bg-slate-950 border-slate-800 border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                                    <AlertTriangle className="w-4 h-4" /> Anomaly Detected
                                </div>
                                <span className="text-xs text-slate-500">Well-0{i}</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-2">
                                Abnormal pressure gradient detected at 2,450m. Deviation from trend exceeds 3 sigma.
                            </p>
                            <div className="mt-2 flex gap-2">
                                <button className="text-xs text-blue-400 hover:underline flex items-center"><Search className="w-3 h-3 mr-1"/> Investigate</button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
        </div>
    );
};

export default AnomalyDetectionAI;