import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const ContextTooltip = ({ content, children }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help group">
            {children}
            <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-slate-900 border-slate-800 text-slate-300 max-w-xs text-xs p-3 leading-relaxed shadow-xl">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContextTooltip;