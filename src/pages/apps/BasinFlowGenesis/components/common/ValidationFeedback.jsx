import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ValidationFeedback = ({ result }) => {
    if (!result || (result.isValid && result.warnings.length === 0)) return null;

    return (
        <div className="space-y-2 my-4 animate-in fade-in slide-in-from-top-2">
            {/* Errors */}
            {result.errors.length > 0 && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Error</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                            {result.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
                <Alert className="bg-amber-900/20 border-amber-900/50 text-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-500">Warning</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                            {result.warnings.map((warn, i) => (
                                <li key={i}>{warn}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Success (if valid but has warnings, or strictly valid) */}
            {result.isValid && result.errors.length === 0 && result.warnings.length === 0 && (
                 <Alert className="bg-emerald-900/20 border-emerald-900/50 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <AlertTitle className="text-emerald-500">Ready to Proceed</AlertTitle>
                    <AlertDescription className="text-xs">All validation checks passed.</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export const ValidationTooltip = ({ message, children }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 text-slate-200 border-slate-800">
                <p>{message}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);