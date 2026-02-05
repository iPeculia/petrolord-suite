import React from 'react';
import { MoreHorizontal, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const WellTrackHeader = ({ well, width, onRemove }) => {
  return (
    <div 
      className="flex flex-col bg-slate-900 border-b border-r border-slate-800 box-border relative group"
      style={{ width, height: '100px' }}
    >
      <div className="p-2 flex items-start justify-between">
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-slate-200 truncate" title={well.name}>{well.name}</h4>
          <div className="text-[10px] text-slate-500 mt-1 truncate">
            {well.metadata?.field || 'Unknown Field'}
          </div>
          <div className="text-[10px] text-slate-600 font-mono mt-0.5">
            {well.location?.x}, {well.location?.y}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-950 border-slate-800">
            <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
            <DropdownMenuItem 
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() => onRemove(well.id)}
            >
              Remove from Panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Bottom indicator for KB/Datum */}
      <div className="absolute bottom-0 w-full border-t border-slate-800 flex justify-center">
        <div className="bg-slate-800 px-2 py-0.5 text-[9px] text-slate-400 rounded-t-sm">
          KB: {well.depthInfo?.reference || '0'}m
        </div>
      </div>
    </div>
  );
};

export default WellTrackHeader;