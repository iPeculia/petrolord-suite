import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const RiskIndicator = ({ riskLevel = 'low', explanation }) => {
    const riskConfig = {
        low: {
            icon: <ShieldCheck className="h-5 w-5 text-green-400" />,
            label: 'Low Risk',
            color: 'bg-green-500/20 text-green-400 border-green-500/30',
        },
        medium: {
            icon: <ShieldAlert className="h-5 w-5 text-yellow-400" />,
            label: 'Caution',
            color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        },
        high: {
            icon: <Shield className="h-5 w-5 text-red-400" />,
            label: 'High Risk',
            color: 'bg-red-500/20 text-red-400 border-red-500/30',
        },
    };
    
    const config = riskConfig[riskLevel] || riskConfig.low;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium", config.color)}>
                        {config.icon}
                        <span>{config.label}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white border-slate-700">
                    <p>{explanation || 'Risk assessment placeholder.'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default RiskIndicator;