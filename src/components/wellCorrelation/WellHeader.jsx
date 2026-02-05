import React from 'react';
import { GripHorizontal, MoreHorizontal, Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import WellContextMenu from './WellContextMenu';
import WellDetailsPanel from './WellDetailsPanel';

const WellHeader = ({ 
  well, 
  dragHandleProps, 
  isSelected, 
  isHidden,
  onSelect, 
  onVisibilityToggle,
  onMove 
}) => {
  return (
    <WellContextMenu 
      well={{ ...well, isHidden }} 
      onMove={onMove} 
      onVisibilityToggle={onVisibilityToggle} 
      onSelect={onSelect}
    >
      <div 
        className={`
          relative flex flex-col border-b border-r border-slate-800 box-border group transition-colors select-none
          ${isSelected ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900'}
          ${isHidden ? 'opacity-60 grayscale' : ''}
        `}
        style={{ height: '100px' }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(well.id, e.ctrlKey || e.metaKey);
        }}
      >
        {/* Top Bar with Drag Handle and Actions */}
        <div className="flex items-center justify-between p-1 h-8">
          <div 
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-slate-400"
          >
            <GripHorizontal className="w-3 h-3" />
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 text-slate-500 hover:text-white hover:bg-slate-800"
              onClick={(e) => {
                e.stopPropagation();
                onVisibilityToggle(well.id);
              }}
            >
              {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-slate-500 hover:text-white hover:bg-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border-slate-800 bg-slate-950" align="start">
                <WellDetailsPanel well={well} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Well Info */}
        <div className="px-2 pb-2 flex-1 overflow-hidden">
          <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-blue-400' : 'text-slate-200'}`} title={well.name}>
            {well.name}
          </h4>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">
            {well.field || 'Unknown Field'}
          </div>
          <div className="mt-1 flex items-center gap-1">
             <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-slate-700 text-slate-400">
               TD: {well.totalDepth}m
             </Badge>
          </div>
        </div>

        {/* Reference Indicator */}
        <div className="h-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-center">
          <span className="text-[9px] text-slate-600 font-mono">
            KB: {well.depthInfo?.reference || '0'}m
          </span>
        </div>
        
        {/* Active Selection Indicator Border */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded-sm z-10" />
        )}
      </div>
    </WellContextMenu>
  );
};

export default WellHeader;