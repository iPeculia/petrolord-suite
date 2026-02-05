import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, SortAsc, SortDesc, MoreHorizontal, Eye, Trash2, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useWellManager } from '@/hooks/useWellCorrelation';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';
import WellImportDialog from './WellImportDialog';

const WellSelectionPanel = ({ onWellSelect }) => {
  const { wells, addWell, removeWell } = useWellManager();
  const { importWells: contextImportWells } = useTrackConfigurationContext(); 
  const [search, setSearch] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredWells = useMemo(() => {
    let result = [...wells];
    if (search) {
      result = result.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterStatus !== 'all') {
      result = result.filter(w => (w.status || 'Active') === filterStatus);
    }
    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [wells, search, sortConfig, filterStatus]);

  const handleImport = (importedData) => {
    // importedData is array of well objects from parser
    importedData.forEach(well => {
      addWell(well);
    });
    // Sync with context if needed
    if(contextImportWells) {
        contextImportWells(importedData);
    }
  };

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredWells.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWells.map(w => w.id));
    }
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach(id => removeWell(id));
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-200">Project Wells</h3>
          <Button size="sm" onClick={() => setImportOpen(true)} className="bg-blue-600 hover:bg-blue-500 h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Import Well
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
            <Input 
              placeholder="Search wells..." 
              className="pl-7 h-7 text-xs bg-slate-950 border-slate-700 focus:border-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 border border-slate-700 text-slate-400 hover:text-white">
                <Filter className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
              <DropdownMenuItem onClick={() => setFilterStatus('all')} className="text-xs">All Wells</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Active')} className="text-xs">Active Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Inactive')} className="text-xs">Inactive Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 border border-slate-700 text-slate-400 hover:text-white"
            onClick={() => setSortConfig({ key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
          >
            {sortConfig.direction === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2 bg-blue-900/20 border-b border-blue-900/30 flex items-center justify-between">
          <span className="text-[10px] text-blue-300">{selectedIds.length} selected</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-300 hover:bg-blue-900/40">
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-300 hover:bg-blue-900/40" onClick={handleDeleteSelected}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <ScrollArea className="flex-1">
        {filteredWells.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-xs p-4 text-center">
            <p>No wells found.</p>
            <p className="mt-1 opacity-50">Import a CSV, Excel, or JSON file.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filteredWells.map(well => (
              <div 
                key={well.id} 
                className={`group flex items-start gap-3 p-3 hover:bg-slate-800/50 transition-colors ${selectedIds.includes(well.id) ? 'bg-blue-900/10' : ''}`}
              >
                <Checkbox 
                  checked={selectedIds.includes(well.id)}
                  onCheckedChange={() => toggleSelection(well.id)}
                  className="mt-1 border-slate-600 data-[state=checked]:bg-blue-600"
                />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onWellSelect && onWellSelect(well)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-200 truncate" title={well.name}>{well.name}</span>
                    {well.status === 'loading' && <Badge variant="outline" className="text-[9px] h-4 px-1 border-amber-600 text-amber-500">Parsing</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-500">
                    <div title="UWI">{well.uwi || 'No UWI'}</div>
                    <div className="text-right">{well.curves?.length || 0} curves</div>
                    <div>{well.depthInfo?.stop ? `${well.depthInfo.stop} ${well.depthInfo.unit}` : '-'}</div>
                    <div className="text-right truncate">{well.field || 'Unknown Field'}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                    <DropdownMenuItem onClick={() => onWellSelect && onWellSelect(well)} className="text-xs">
                      <Eye className="w-3 h-3 mr-2" /> View Log
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">
                      <Edit2 className="w-3 h-3 mr-2" /> Edit Metadata
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem onClick={() => removeWell(well.id)} className="text-xs text-red-400 focus:text-red-400 focus:bg-red-900/20">
                      <Trash2 className="w-3 h-3 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-2 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 flex justify-between px-4 items-center">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={filteredWells.length > 0 && selectedIds.length === filteredWells.length}
            onCheckedChange={toggleSelectAll}
            className="h-3 w-3 border-slate-700"
          />
          <span>Select All</span>
        </div>
        <span>{filteredWells.length} Wells</span>
      </div>

      <WellImportDialog 
        open={importOpen} 
        onOpenChange={setImportOpen} 
        onImport={handleImport}
      />
    </div>
  );
};

export default WellSelectionPanel;