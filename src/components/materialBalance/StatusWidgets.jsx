import React from 'react';
import { CheckCircle2, AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const DataCompletenessWidget = ({ status }) => {
    const items = [
        { label: 'Prod', valid: status?.production === 'Complete' },
        { label: 'Pres', valid: status?.pressure === 'Complete' },
        { label: 'PVT', valid: status?.pvt === 'Complete' },
        { label: 'Tank', valid: true } // Basic tank always present
    ];
    const percent = (items.filter(i => i.valid).length / items.length) * 100;

    return (
        <div className="bg-slate-950 border border-slate-800 rounded p-2 flex flex-col gap-1 min-w-[100px]">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Data Health</span>
            <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-xs font-mono text-slate-300">{percent}%</span>
            </div>
        </div>
    );
};

export const ModelFitWidget = ({ r2 }) => (
    <div className="bg-slate-950 border border-slate-800 rounded p-2 flex items-center gap-2 min-w-[100px]">
        <BarChart3 className={`w-4 h-4 ${r2 > 0.9 ? 'text-green-500' : r2 > 0.7 ? 'text-yellow-500' : 'text-red-500'}`} />
        <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">Fit Quality</div>
            <div className="text-xs font-mono text-slate-200">{r2 ? `R² ${r2.toFixed(3)}` : 'No Fit'}</div>
        </div>
    </div>
);

export const ForecastStatusWidget = ({ hasForecast }) => (
    <div className="bg-slate-950 border border-slate-800 rounded p-2 flex items-center gap-2 min-w-[100px]">
        <TrendingUp className={`w-4 h-4 ${hasForecast ? 'text-blue-500' : 'text-slate-600'}`} />
        <div>
            <div className="text-[9px] text-slate-500 uppercase font-bold">Forecast</div>
            <div className="text-xs font-mono text-slate-200">{hasForecast ? 'Active' : 'None'}</div>
        </div>
    </div>
);