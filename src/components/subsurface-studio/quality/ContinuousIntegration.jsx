import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GitMerge } from 'lucide-react';

const ContinuousIntegration = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <GitMerge className="w-5 h-5 mr-2 text-purple-400" /> CI Pipeline
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Checkout</span>
            <span>Install</span>
            <span>Lint</span>
            <span>Test</span>
            <span>Build</span>
            <span>Deploy</span>
        </div>
        <div className="h-2 bg-slate-800 rounded overflow-hidden flex">
            <div className="w-1/6 bg-green-500"></div>
            <div className="w-1/6 bg-green-500"></div>
            <div className="w-1/6 bg-green-500"></div>
            <div className="w-1/6 bg-green-500"></div>
            <div className="w-1/6 bg-green-500"></div>
            <div className="w-1/6 bg-blue-500 animate-pulse"></div>
        </div>
    </div>
);

export default ContinuousIntegration;