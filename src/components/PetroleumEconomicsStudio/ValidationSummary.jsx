import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const ValidationSummary = ({ isOpen, onClose, issues, onFix }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-slate-950 border-l border-slate-800 text-slate-100">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Validation Report
          </SheetTitle>
          <SheetDescription>
            {issues.length} issues found in your current model configuration.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
            <div className="space-y-4">
                {issues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="font-medium text-emerald-400">All Checks Passed</h3>
                        <p className="text-sm text-slate-500 mt-1">Your model data looks consistent and complete.</p>
                    </div>
                ) : (
                    issues.map((issue, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex gap-3 group hover:border-slate-700 transition-colors">
                            <div className="mt-0.5">
                                {issue.type === 'critical' ? <XCircle className="w-5 h-5 text-red-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={cn("text-sm font-medium", issue.type === 'critical' ? 'text-red-400' : 'text-yellow-400')}>
                                        {issue.location}
                                    </h4>
                                    {issue.fixAction && (
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={() => onFix(issue)}
                                            className="h-6 text-xs text-blue-400 hover:text-white -mt-1 -mr-2"
                                        >
                                            Fix <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 mt-1 leading-snug">{issue.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ValidationSummary;