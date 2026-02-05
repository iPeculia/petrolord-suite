import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, Save, Plus, Download, MoreVertical, Trash2, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useProjectManager } from '@/hooks/useWellCorrelation';
import NewProjectDialog from './NewProjectDialog';
import OpenProjectDialog from './OpenProjectDialog';
import SaveProjectDialog from './SaveProjectDialog';
import ExportProjectDialog from './ExportProjectDialog';
import { useToast } from '@/components/ui/use-toast';

const ProjectActions = () => {
  const { currentProject, projectList, createProject, openProject } = useProjectManager();
  const [showNew, setShowNew] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Actual save logic is usually mostly context/backend, UI just triggers
    toast({
      title: "Project Saved",
      description: `Changes to "${currentProject?.name}" have been saved.`,
    });
  };

  return (
    <>
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowNew(true)} 
          className="h-8 px-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Plus className="w-3 h-3 mr-2 text-blue-400" /> New
        </Button>
        
        <div className="w-px h-4 bg-slate-800 mx-1" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowOpen(true)} 
          className="h-8 px-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <FolderOpen className="w-3 h-3 mr-2 text-amber-400" /> Open
        </Button>
        
        <div className="w-px h-4 bg-slate-800 mx-1" />

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSave(true)} 
          disabled={!currentProject}
          className="h-8 px-3 text-xs text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30"
        >
          <Save className="w-3 h-3 mr-2 text-emerald-400" /> Save
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300 w-48">
            <DropdownMenuLabel className="text-xs font-normal text-slate-500">Project Options</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setShowExport(true)} disabled={!currentProject} className="text-xs">
              <Download className="w-3 h-3 mr-2" /> Export Project
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!currentProject} className="text-xs">
              <Archive className="w-3 h-3 mr-2" /> Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem disabled={!currentProject} className="text-xs text-red-400 focus:text-red-400 focus:bg-red-900/20">
              <Trash2 className="w-3 h-3 mr-2" /> Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NewProjectDialog open={showNew} onOpenChange={setShowNew} onCreate={createProject} />
      <OpenProjectDialog open={showOpen} onOpenChange={setShowOpen} projects={projectList} onOpen={openProject} />
      <SaveProjectDialog open={showSave} onOpenChange={setShowSave} onSave={handleSave} projectName={currentProject?.name} />
      <ExportProjectDialog open={showExport} onOpenChange={setShowExport} />
    </>
  );
};

export default ProjectActions;