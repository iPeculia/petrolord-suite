import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const ContextHelp = ({ content, className }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle 
            className={cn(
                "w-4 h-4 text-slate-500 hover:text-emerald-400 cursor-help transition-colors ml-1 inline-block align-middle", 
                className
            )} 
        />
      </TooltipTrigger>
      <TooltipContent className="bg-slate-900 text-slate-200 border-slate-800 max-w-xs text-xs p-3 shadow-xl">
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ContextHelp;