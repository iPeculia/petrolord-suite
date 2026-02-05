import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreVertical, FileText, Ruler, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const WellListItem = ({ well, isSelected, onToggle, onDelete, onView }) => {
  return (
    <div 
      className={`
        flex items-center p-3 border-b border-slate-800/50 hover:bg-slate-800 transition-colors group
        ${isSelected ? 'bg-blue-900/10' : ''}
      `}
    >
      <Checkbox 
        checked={isSelected} 
        onCheckedChange={() => onToggle(well.id)}
        className="mr-3 border-slate-600 data-[state=checked]:bg-blue-600"
      />
      
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-slate-200 truncate" title={well.name}>{well.name}</span>
          {well.status === 'loading' && <Badge variant="outline" className="text-[9px] border-amber-600 text-amber-500">Loading</Badge>}
        </div>
        
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Ruler className="w-3 h-3" />
            <span>{well.depthInfo.start}-{well.depthInfo.stop} {well.depthInfo.unit}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{well.curves?.length || 0} curves</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
          <DropdownMenuItem onClick={onView} className="text-slate-300">View Details</DropdownMenuItem>
          <DropdownMenuItem className="text-slate-300">Export LAS</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(well.id)} className="text-red-400 focus:text-red-400 focus:bg-red-900/20">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WellListItem;