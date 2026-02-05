import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MousePointer2, Move, Ruler, Calculator, RefreshCw, BarChart3, Box, ZoomIn, ZoomOut, RotateCcw, Download, Undo, Redo, Eye, Layers } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ToolButton = ({ icon: Icon, label, active, onClick, disabled }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle 
                    pressed={active} 
                    onPressedChange={onClick}
                    disabled={disabled}
                    aria-label={label}
                    className="data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400"
                >
                    <Icon className="h-4 w-4" />
                </Toggle>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const PropertyModelingToolbar = ({ 
    activeTool, 
    setActiveTool, 
    onZoomIn, 
    onZoomOut, 
    onReset,
    onExport,
    onUndo,
    onRedo,
    toggleLayerManager
}) => {
    return (
        <div className="h-12 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex items-center px-4 gap-2 shrink-0">
            <div className="flex items-center gap-1 mr-2">
                <ToolButton 
                    icon={MousePointer2} 
                    label="Select" 
                    active={activeTool === 'select'} 
                    onClick={() => setActiveTool('select')} 
                />
                <ToolButton 
                    icon={Move} 
                    label="Pan / Rotate" 
                    active={activeTool === 'pan'} 
                    onClick={() => setActiveTool('pan')} 
                />
                <ToolButton 
                    icon={Ruler} 
                    label="Measure" 
                    active={activeTool === 'measure'} 
                    onClick={() => setActiveTool('measure')} 
                />
            </div>

            <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />

            <div className="flex items-center gap-1">
                <ToolButton 
                    icon={Box} 
                    label="Volumetrics" 
                    active={activeTool === 'volumetrics'} 
                    onClick={() => setActiveTool('volumetrics')} 
                />
                <ToolButton 
                    icon={RefreshCw} 
                    label="Distribute Properties" 
                    active={activeTool === 'distribute'} 
                    onClick={() => setActiveTool('distribute')} 
                />
                <ToolButton 
                    icon={Calculator} 
                    label="Uncertainty Analysis" 
                    active={activeTool === 'uncertainty'} 
                    onClick={() => setActiveTool('uncertainty')} 
                />
                 <ToolButton 
                    icon={BarChart3} 
                    label="Analysis" 
                    active={activeTool === 'analysis'} 
                    onClick={() => setActiveTool('analysis')} 
                />
            </div>

            <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />

             <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={onUndo}><Undo className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onRedo}><Redo className="h-4 w-4" /></Button>
            </div>

            <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={onZoomIn}><ZoomIn className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onZoomOut}><ZoomOut className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onReset}><RotateCcw className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={toggleLayerManager}><Eye className="h-4 w-4" /></Button>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onExport} className="h-8">
                    <Download className="h-3 w-3 mr-2" /> Export
                </Button>
            </div>
        </div>
    );
};

export default PropertyModelingToolbar;