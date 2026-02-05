import React from 'react';
import { Progress } from '@/components/ui/progress';

const ExportProgressTracker = ({ progress, status }) => (
    <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">{status || 'Ready'}</span>
            <span className="text-slate-300">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1" />
    </div>
);
export default ExportProgressTracker;