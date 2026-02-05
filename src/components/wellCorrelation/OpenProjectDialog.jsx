import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Calendar, Folder, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const OpenProjectDialog = ({ open, onOpenChange, projects = [], onOpen }) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Safeguard against undefined projects
  const safeProjects = Array.isArray(projects) ? projects : [];

  const filteredProjects = safeProjects.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = () => {
    if (selectedId) {
      onOpen(selectedId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            Open Existing Project
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search projects by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-900 border-slate-700 text-white focus:ring-blue-900"
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border border-slate-800 bg-slate-900/50 p-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`
                  flex flex-col gap-1 rounded-md p-3 cursor-pointer transition-all mb-1
                  ${selectedId === project.id ? 'bg-blue-900/30 border border-blue-600/50 ring-1 ring-blue-600/30' : 'hover:bg-slate-800 border border-transparent'}
                `}
                onClick={() => setSelectedId(project.id)}
                onDoubleClick={() => { setSelectedId(project.id); handleOpen(); }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <FileText className="w-3 h-3 text-slate-500" />
                    {project.name}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.modified ? format(new Date(project.modified), 'MMM d, yyyy') : 'Unknown Date'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 line-clamp-1 ml-5">
                  {project.description || <span className="italic opacity-50">No description</span>}
                </span>
                <div className="flex gap-2 ml-5 mt-1">
                  {project.wells && (
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {project.wells.length} Wells
                    </span>
                  )}
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                <Folder className="w-12 h-12 mb-2" />
                <p className="text-sm">No projects found.</p>
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleOpen} disabled={!selectedId} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[100px]">
            Open Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenProjectDialog;