import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SearchCheck } from 'lucide-react';

const ExplainableAI = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <SearchCheck className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Explainability (XAI)</h3>
            <p className="text-sm text-slate-500 mt-2">SHAP values and feature importance visualization.</p>
        </CardContent>
    </Card>
);

export default ExplainableAI;