import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    MousePointer2, 
    MoveVertical, 
    Ruler, 
    PenTool, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    Download,
    Ghost,
    Layers,
    BrainCircuit,
    Save,
    Upload
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ToolButton = ({ icon: Icon, label, active, onClick, disabled, color }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle 
                    pressed={active} 
                    onPressedChange={onClick}
                    disabled={disabled}
                    aria-label={label}
                    className={`data-[state=on]:bg-lime-500/20 data-[state=on]:text-lime-400 ${color || ''}`}
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

const WellCorrelationToolbar = ({ 
    activeTool, 
    setActiveTool, 
    onZoomIn, 
    onZoomOut, 
    onFit, 
    onExport,
    onSaveSession,
    ghostMode,
    setGhostMode,
    aiMode,
    setAiMode
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
                    icon={MoveVertical} 
                    label="Pan / Shift" 
                    active={activeTool === 'pan'} 
                    onClick={() => setActiveTool('pan')} 
                />
                <ToolButton 
                    icon={Ruler} 
                    label="Measure" 
                    active={activeTool === 'measure'} 
                    onClick={() => setActiveTool('measure')} 
                />
                <ToolButton 
                    icon={PenTool} 
                    label="Correlation Line" 
                    active={activeTool === 'correlate'} 
                    onClick={() => setActiveTool('correlate')} 
                />
            </div>

            <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />

            <div className="flex items-center gap-1">
                <ToolButton 
                    icon={Ghost} 
                    label="Ghost Curve Mode" 
                    active={ghostMode} 
                    onClick={() => setGhostMode(!ghostMode)} 
                    color="text-purple-400 data-[state=on]:text-purple-300 data-[state=on]:bg-purple-900/20"
                />
                <ToolButton 
                    icon={BrainCircuit} 
                    label="AI Assist" 
                    active={aiMode} 
                    onClick={() => setAiMode(!aiMode)} 
                    color="text-cyan-400 data-[state=on]:text-cyan-300 data-[state=on]:bg-cyan-900/20"
                />
            </div>

            <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={onZoomIn}><ZoomIn className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onZoomOut}><ZoomOut className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onFit}><RotateCcw className="h-4 w-4" /></Button>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onSaveSession} className="h-8">
                    <Save className="h-3 w-3 mr-2" /> Save
                </Button>
                <Button variant="outline" size="sm" onClick={onExport} className="h-8">
                    <Download className="h-3 w-3 mr-2" /> Export
                </Button>
            </div>
        </div>
    );
};

export default WellCorrelationToolbar;