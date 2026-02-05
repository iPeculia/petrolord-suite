import React from 'react';
import { PenTool, MousePointer2, Eraser } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LassoSelectionTool = ({ onModeChange, onClear }) => {
    return (
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <ToggleGroup type="single" defaultValue="pointer" onValueChange={onModeChange}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ToggleGroupItem value="pointer" aria-label="Pointer" className="h-8 w-8 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white">
                                <MousePointer2 className="h-4 w-4" />
                            </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent side="bottom"><p>Selection Mode</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ToggleGroupItem value="lasso" aria-label="Lasso" className="h-8 w-8 p-0 data-[state=on]:bg-blue-600 data-[state=on]:text-white">
                                <PenTool className="h-4 w-4" />
                            </ToggleGroupItem>
                        </TooltipTrigger>
                        <TooltipContent side="bottom"><p>Freehand Lasso</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </ToggleGroup>
            <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400 hover:bg-red-950/30" onClick={onClear}>
                <Eraser className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default LassoSelectionTool;