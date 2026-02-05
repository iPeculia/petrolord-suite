import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ContextualHelp = ({ title, content, className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn("inline-flex items-center justify-center rounded-full text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition-colors p-0.5 ml-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500", className)}>
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="sr-only">Help info for {title}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-slate-900 border-slate-800 text-slate-200 shadow-xl p-4" side="top">
        <div className="space-y-2">
          {title && <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            {title}
          </h4>}
          <p className="text-xs leading-relaxed text-slate-400">
            {content}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ContextualHelp;