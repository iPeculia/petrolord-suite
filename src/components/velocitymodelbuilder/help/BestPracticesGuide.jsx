import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

const BestPracticesGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white">Industry Best Practices</h2>
        
        <div className="grid grid-cols-1 gap-4">
            <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-emerald-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Quality Control First
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                    Always QC checkshot data for datum inconsistencies and cycle skips before building velocity functions. A bad checkshot point at shallow depth can bias the entire gradient.
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-yellow-400 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Simplicity Rule
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                    Start with a simple V0 + kZ model. Only introduce anisotropy (delta/epsilon) or complex compaction terms if the simple model fails to match well tops within tolerance. Over-parameterization leads to instability.
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Lateral Consistency
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                    Ensure velocity maps are geologically consistent. Abrupt changes in V0 or k between neighboring wells usually indicate data errors rather than geological reality, unless crossing a major fault.
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default BestPracticesGuide;