import React from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MousePointer2, Ruler, PenTool, Save, Trash2, Undo, Redo, ZoomIn, Move, Route, RotateCcw } from 'lucide-react';

const CrossSectionToolbar = ({ activeTool, setActiveTool, onUndo, onRedo, onClear, onFit, onSave, onDefineLine }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-md border border-slate-700 shadow-xl backdrop-blur-md">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle pressed={activeTool === 'select'} onPressedChange={() => setActiveTool('select')} size="sm" className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400 h-8 w-8 p-0">
                            <MousePointer2 className="w-4 h-4" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>Select Objects</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle pressed={activeTool === 'pan'} onPressedChange={() => setActiveTool('pan')} size="sm" className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400 h-8 w-8 p-0">
                            <Move className="w-4 h-4" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>Pan / Zoom</TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-slate-700 mx-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle pressed={activeTool === 'define_line'} onPressedChange={onDefineLine} size="sm" className="data-[state=on]:bg-amber-500/20 data-[state=on]:text-amber-400 h-8 w-8 p-0">
                            <Route className="w-4 h-4" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>Draw Section Line on Map</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle pressed={activeTool === 'measure_dist'} onPressedChange={() => setActiveTool('measure_dist')} size="sm" className="data-[state=on]:bg-green-500/20 data-[state=on]:text-green-400 h-8 w-8 p-0">
                            <Ruler className="w-4 h-4" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>Measure Distance</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle pressed={activeTool === 'measure_dip'} onPressedChange={() => setActiveTool('measure_dip')} size="sm" className="data-[state=on]:bg-green-500/20 data-[state=on]:text-green-400 h-8 w-8 p-0">
                            <RotateCcw className="w-4 h-4" />
                        </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>Measure Dip</TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-slate-700 mx-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onFit} className="h-8 w-8 p-0 hover:bg-slate-800">
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fit to Screen</TooltipContent>
                </Tooltip>

                <div className="flex gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onUndo} className="h-8 w-8 p-0 hover:bg-slate-800">
                                <Undo className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onRedo} className="h-8 w-8 p-0 hover:bg-slate-800">
                                <Redo className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-5 bg-slate-700 mx-1" />
                
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear View</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default CrossSectionToolbar;