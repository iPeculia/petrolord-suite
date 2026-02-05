import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

const ModelEvaluation = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <LineChart className="w-12 h-12 mx-auto text-pink-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Metrics & Validation</h3>
            <p className="text-sm text-slate-500 mt-2">Confusion matrices, ROC curves, F1 Scores.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-900 rounded">Precision: <span className="text-green-400">0.92</span></div>
                <div className="p-2 bg-slate-900 rounded">Recall: <span className="text-green-400">0.88</span></div>
            </div>
        </CardContent>
    </Card>
);

export default ModelEvaluation;