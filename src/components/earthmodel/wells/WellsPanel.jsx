import React, { useEffect, useState } from 'react';
import { useWells } from '@/hooks/useWells';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WellCreationForm from './WellCreationForm';
import WellErrorHandler from './WellErrorHandler';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const WellsPanel = () => {
  // Hardcoded project ID for demo - in real app this comes from context/route
  const projectId = 'project-alpha-id'; 
  const { wells, isLoading, error, fetchWells, addWell } = useWells(projectId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWells();
  }, [fetchWells]);

  const handleCreate = async (data) => {
    const result = await addWell(data);
    if (result) {
      setIsCreateOpen(false);
    }
  };

  const filteredWells = wells.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 w-80">
      <div className="p-4 border-b border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-200">Wells</h3>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 h-8">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 p-0 max-w-md">
              <WellCreationForm 
                onSubmit={handleCreate} 
                onCancel={() => setIsCreateOpen(false)}
                isLoading={isLoading}
                error={error}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search wells..." 
            className="pl-8 bg-slate-950 border-slate-800 h-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        <WellErrorHandler error={error} onRetry={fetchWells} />
        
        {isLoading && wells.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">Loading wells...</div>
        )}

        <div className="space-y-1">
          {filteredWells.map((well) => (
            <div 
              key={well.id} 
              className="p-3 rounded-lg bg-slate-950/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">{well.name}</span>
                <span className="text-[10px] text-slate-600 font-mono">
                  {well.x ? `${well.x}, ${well.y}` : 'No coords'}
                </span>
              </div>
            </div>
          ))}
          
          {!isLoading && filteredWells.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No wells found. Create one to get started.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WellsPanel;