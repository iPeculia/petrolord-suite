import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, AlertCircle } from 'lucide-react';

const AnalysisPanel = () => {
    return (
        <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-400">Select models and parameters for stress analysis.</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Play className="w-4 h-4 mr-2" /> Run Full Analysis
                    </Button>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Results Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                        <p>No analysis run yet.</p>
                    </div>
                </CardContent>
             </Card>
        </div>
    );
};

export default AnalysisPanel;