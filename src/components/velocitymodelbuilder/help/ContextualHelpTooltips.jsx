import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';

export const HelpTooltip = ({ content, side = 'top', icon = 'help' }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="cursor-help inline-flex items-center align-middle ml-1 opacity-70 hover:opacity-100 transition-opacity">
            {icon === 'info' ? (
                <Info className="w-3 h-3 text-blue-400" />
            ) : (
                <HelpCircle className="w-3 h-3 text-slate-400 hover:text-blue-400" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs bg-slate-900 border-slate-700 text-slate-300 text-xs p-3 shadow-xl z-[60]">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;