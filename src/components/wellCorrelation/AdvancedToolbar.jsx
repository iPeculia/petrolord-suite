import React from 'react';
import { useAdvancedVisualization } from '@/hooks/useAdvancedVisualization';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointer2, Hand, ZoomIn, Ruler, Pencil, Type, 
  Download, Layers, Undo2, Redo2, Grid, FileImage
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ToolButton = ({ icon: Icon, label, isActive, onClick, shortcut }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={isActive ? "secondary" : "ghost"} 
          size="icon" 
          className={`h-8 w-8 ${isActive ? 'bg-blue-600 text-white hover:bg-blue-500' : 'text-slate-400 hover:text-white'}`}
          onClick={onClick}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs bg-slate-900 border-slate-800">
        <p>{label} {shortcut && <span className="text-slate-500 ml-1">({shortcut})</span>}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const AdvancedToolbar = ({ onToggleLayers, onToggleAnalysis }) => {
  const { 
    activeTool, 
    setTool, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    handleExport 
  } = useAdvancedVisualization();

  return (
    <div className="h-10 border-b border-slate-800 bg-slate-900 flex items-center px-2 gap-1 shrink-0">
      
      {/* Selection & Navigation */}
      <div className="flex items-center gap-1">
        <ToolButton 
          icon={MousePointer2} 
          label="Select" 
          isActive={activeTool === 'select'} 
          onClick={() => setTool('select')}
          shortcut="V"
        />
        <ToolButton 
          icon={Hand} 
          label="Pan" 
          isActive={activeTool === 'pan'} 
          onClick={() => setTool('pan')}
          shortcut="Space"
        />
        <ToolButton 
          icon={ZoomIn} 
          label="Zoom Area" 
          isActive={activeTool === 'zoom'} 
          onClick={() => setTool('zoom')}
          shortcut="Z"
        />
      </div>

      <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

      {/* Tools */}
      <div className="flex items-center gap-1">
        <ToolButton 
          icon={Ruler} 
          label="Measure Depth" 
          isActive={activeTool === 'measure'} 
          onClick={() => setTool('measure')}
          shortcut="M"
        />
        <ToolButton 
          icon={Pencil} 
          label="Annotate" 
          isActive={activeTool === 'annotate'} 
          onClick={() => setTool('annotate')}
          shortcut="A"
        />
        <ToolButton 
          icon={Type} 
          label="Add Text" 
          isActive={activeTool === 'text'} 
          onClick={() => setTool('text')}
          shortcut="T"
        />
      </div>

      <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

      {/* Panels */}
      <div className="flex items-center gap-1">
        <ToolButton 
          icon={Layers} 
          label="Layers" 
          onClick={onToggleLayers}
          shortcut="L"
        />
        <ToolButton 
          icon={Grid} 
          label="Analysis" 
          onClick={onToggleAnalysis}
        />
      </div>

      <div className="flex-1" />

      {/* History */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 disabled:opacity-30" 
          onClick={undo} 
          disabled={!canUndo}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 disabled:opacity-30" 
          onClick={redo} 
          disabled={!canRedo}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5 bg-slate-700 mx-1" />

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-300 hover:text-white">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
          <DropdownMenuItem onClick={() => handleExport('png', 'correlation-canvas')}>
            <FileImage className="w-3 h-3 mr-2" /> Export as Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf', 'correlation-canvas')}>
            <FileImage className="w-3 h-3 mr-2" /> Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
};

export default AdvancedToolbar;