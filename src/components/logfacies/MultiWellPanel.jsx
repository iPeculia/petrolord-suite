import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitMerge, ArrowRight } from 'lucide-react';

const MultiWellPanel = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-slate-500 bg-slate-900 border border-slate-800 rounded-lg border-dashed">
            <GitMerge className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">Multi-Well Correlation</h3>
            <p className="text-center max-w-md text-sm mb-6">
                Select multiple wells from your project tree to enable cross-section view and stratigraphic correlation.
            </p>
            <div className="flex items-center gap-4 opacity-50">
                <div className="w-24 h-32 bg-slate-800 rounded border border-slate-700"></div>
                <ArrowRight className="w-6 h-6" />
                <div className="w-24 h-32 bg-slate-800 rounded border border-slate-700"></div>
                <ArrowRight className="w-6 h-6" />
                <div className="w-24 h-32 bg-slate-800 rounded border border-slate-700"></div>
            </div>
        </div>
    );
};

export default MultiWellPanel;