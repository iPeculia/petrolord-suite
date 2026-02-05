import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    MousePointer2, 
    Move, 
    Ruler, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    Download,
    Activity,
    Waves,
    Link2,
    Spline,
    Undo,
    Redo,
    Maximize,
    Eye,
    Layers
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ToolButton = ({ icon: Icon, label, active, onClick, disabled, variant="ghost" }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle 
                    pressed={active} 
                    onPressedChange={onClick}
                    disabled={disabled}
                    aria-label={label}
                    className="data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400 h-8 w-8 p-0"
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

const ActionButton = ({ icon: Icon, label, onClick, disabled }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick} disabled={disabled}>
                    <Icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>{label}</p></TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const SeismicInterpretationToolbar = ({ 
    activeTool, 
    setActiveTool, 
    onZoomIn, 
    onZoomOut, 
    onFit,
    onReset,
    onExport,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    analysisMode,
    setAnalysisMode
}) => {
    return (
        <div className="h-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex items-center px-2 gap-1 shrink-0 shadow-md z-10">
            <div className="flex items-center gap-0.5">
                <ToolButton icon={MousePointer2} label="Select / Pointer" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
                <ToolButton icon={Move} label="Pan View" active={activeTool === 'pan'} onClick={() => setActiveTool('pan')} />
                <ToolButton icon={Ruler} label="Measure Distance" active={activeTool === 'measure'} onClick={() => setActiveTool('measure')} />
            </div>

            <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

            <div className="flex items-center gap-0.5">
                <ToolButton icon={Spline} label="Horizon Picking" active={activeTool === 'horizon'} onClick={() => setActiveTool('horizon')} />
                <ToolButton icon={Activity} label="Fault Picking" active={activeTool === 'fault'} onClick={() => setActiveTool('fault')} />
            </div>

            <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

            <div className="flex items-center gap-0.5">
                <ToolButton icon={Waves} label="Analysis Mode (Amplitude/Freq)" active={analysisMode} onClick={() => setAnalysisMode(!analysisMode)} />
                <ToolButton icon={Link2} label="Well Tie Mode" active={activeTool === 'well-tie'} onClick={() => setActiveTool('well-tie')} />
            </div>

            <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

            <div className="flex items-center gap-0.5">
                <ActionButton icon={Undo} label="Undo" onClick={onUndo} disabled={!canUndo} />
                <ActionButton icon={Redo} label="Redo" onClick={onRedo} disabled={!canRedo} />
            </div>

            <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

            <div className="flex items-center gap-0.5">
                <ActionButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
                <ActionButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
                <ActionButton icon={Maximize} label="Fit to View" onClick={onFit} />
                <ActionButton icon={RotateCcw} label="Reset View" onClick={onReset} />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2 border-slate-700 bg-slate-800">
                            <Download className="h-3 w-3 mr-2" /> Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                        <DropdownMenuItem onClick={() => onExport('png')}><Layers className="mr-2 h-4 w-4" /> PNG Image</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport('json')}><Activity className="mr-2 h-4 w-4" /> GeoJSON</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport('segy')}><Waves className="mr-2 h-4 w-4" /> SEG-Y (Picks)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default SeismicInterpretationToolbar;