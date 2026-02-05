import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const WellSelector = ({ wells, selectedIds, onToggle }) => {
    const handleSelectAll = () => {
        wells.forEach(w => {
            if (!selectedIds.includes(w.id)) onToggle(w.id);
        });
    };

    const handleDeselectAll = () => {
        wells.forEach(w => {
            if (selectedIds.includes(w.id)) onToggle(w.id);
        });
    };

    return (
        <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
            <div className="p-4 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 mb-3">Well Selection</h3>
                <div className="relative mb-3">
                    <Search className="absolute left-2 top-2.5 h-3 w-3 text-slate-500" />
                    <Input 
                        placeholder="Search wells..." 
                        className="pl-8 h-8 text-xs bg-slate-900 border-slate-800 focus-visible:ring-slate-700" 
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex-1 h-6 text-[10px] border-slate-700 text-slate-400 hover:text-white">All</Button>
                    <Button variant="outline" size="sm" onClick={handleDeselectAll} className="flex-1 h-6 text-[10px] border-slate-700 text-slate-400 hover:text-white">None</Button>
                </div>
            </div>
            
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {wells.map(well => (
                        <div 
                            key={well.id} 
                            className={`flex items-center space-x-2 p-2 rounded hover:bg-slate-900 transition-colors ${selectedIds.includes(well.id) ? 'bg-slate-900/50' : ''}`}
                        >
                            <Checkbox 
                                id={`well-${well.id}`} 
                                checked={selectedIds.includes(well.id)}
                                onCheckedChange={() => onToggle(well.id)}
                                className="border-slate-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <label
                                htmlFor={`well-${well.id}`}
                                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 cursor-pointer flex-1 truncate"
                            >
                                {well.name}
                            </label>
                            {well.status === 'warning' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" title="Warnings Detected" />
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default WellSelector;