import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FolderOpen, Save, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const ProjectManager = ({ onLoad, onSave, projects, isLoading, onDelete, currentProjectName }) => {
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    if (currentProjectName) setSaveName(currentProjectName);
  }, [currentProjectName]);

  const handleSave = () => {
    onSave(saveName);
    setIsSaveOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isLoadOpen} onOpenChange={setIsLoadOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1"><FolderOpen className="w-4 h-4 mr-2" /> Load Project</Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Load Project</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : projects.length === 0 ? (
              <div className="text-center text-slate-500 p-4">No saved projects found.</div>
            ) : (
              <div className="space-y-2">
                {projects.map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group">
                    <div 
                      className="flex-1 cursor-pointer" 
                      onClick={() => { onLoad(project); setIsLoadOpen(false); }}
                    >
                      <div className="font-medium text-slate-200">{project.project_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {format(new Date(project.updated_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1"><Save className="w-4 h-4 mr-2" /> Save Project</Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              value={saveName} 
              onChange={(e) => setSaveName(e.target.value)} 
              className="mt-2 bg-slate-800 border-slate-600"
              placeholder="e.g. Well A-12 Resistivity Log"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!saveName.trim() || isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManager;