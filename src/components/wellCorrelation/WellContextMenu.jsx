import React from 'react';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuSeparator, 
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent
} from '@/components/ui/context-menu';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowLeftToLine, 
  ArrowRightToLine, 
  Eye, 
  EyeOff, 
  FileText, 
  Copy, 
  Trash2 
} from 'lucide-react';

const WellContextMenu = ({ children, well, onMove, onVisibilityToggle, onSelect }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-300">
        <ContextMenuItem className="text-xs focus:bg-slate-800 focus:text-white" onClick={() => onSelect(well.id)}>
          Select Well
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-slate-800" />
        
        <ContextMenuSub>
          <ContextMenuSubTrigger className="text-xs focus:bg-slate-800 focus:text-white">
            Reorder
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-slate-900 border-slate-800">
            <ContextMenuItem onClick={() => onMove(well.id, 'left')} className="text-xs">
              <ArrowLeft className="w-3 h-3 mr-2" /> Move Left
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onMove(well.id, 'right')} className="text-xs">
              <ArrowRight className="w-3 h-3 mr-2" /> Move Right
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-slate-800" />
            <ContextMenuItem onClick={() => onMove(well.id, 'start')} className="text-xs">
              <ArrowLeftToLine className="w-3 h-3 mr-2" /> Move to Start
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onMove(well.id, 'end')} className="text-xs">
              <ArrowRightToLine className="w-3 h-3 mr-2" /> Move to End
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem onClick={() => onVisibilityToggle(well.id)} className="text-xs focus:bg-slate-800 focus:text-white">
          {well.isHidden ? <Eye className="w-3 h-3 mr-2" /> : <EyeOff className="w-3 h-3 mr-2" />}
          {well.isHidden ? 'Show Well' : 'Hide Well'}
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-slate-800" />
        
        <ContextMenuItem className="text-xs focus:bg-slate-800 focus:text-white">
          <FileText className="w-3 h-3 mr-2" /> View Details
        </ContextMenuItem>
        <ContextMenuItem className="text-xs focus:bg-slate-800 focus:text-white">
          <Copy className="w-3 h-3 mr-2" /> Duplicate
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-slate-800" />
        
        <ContextMenuItem className="text-xs text-red-400 focus:text-red-400 focus:bg-red-900/20">
          <Trash2 className="w-3 h-3 mr-2" /> Remove from View
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default WellContextMenu;