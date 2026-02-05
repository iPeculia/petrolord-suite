import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus, Clock, FileText, Trash2, Copy, Archive, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import MBProjectManager from './MBProjectManager';

const MBProjectsButton = () => {
  const { currentProject, projectList, loadProjectAction, createProject, deleteProject, duplicateProject, archiveProject } = useMaterialBalance();
  const [isManagerOpen, setIsManagerOpen] = React.useState(false);

  // Get recent projects (limit 5, excluding current)
  const recentProjects = projectList
    .filter(p => p.id !== currentProject?.id)
    .sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate))
    .slice(0, 5);

  const handleNew = () => {
    setIsManagerOpen(true); // Open manager to create
  };

  return (
    <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 text-xs gap-2 text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700">
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                    <span className="max-w-[150px] truncate">{currentProject ? currentProject.name : 'Select Project'}</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-slate-950 border-slate-800">
                <DropdownMenuLabel className="text-xs text-slate-500 font-normal uppercase tracking-wider">Current Project</DropdownMenuLabel>
                {currentProject ? (
                    <div className="px-2 py-1.5 text-sm font-medium text-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {currentProject.name}
                    </div>
                ) : (
                    <div className="px-2 py-1.5 text-xs text-slate-500 italic">No project loaded</div>
                )}
                
                <DropdownMenuSeparator className="bg-slate-800" />
                
                <DropdownMenuLabel className="text-xs text-slate-500 font-normal uppercase tracking-wider">Recent Projects</DropdownMenuLabel>
                {recentProjects.length > 0 ? (
                    recentProjects.map(project => (
                        <DropdownMenuItem 
                            key={project.id} 
                            onClick={() => loadProjectAction(project.id)}
                            className="text-xs cursor-pointer focus:bg-slate-900 focus:text-slate-200"
                        >
                            <Clock className="w-3.5 h-3.5 mr-2 text-slate-500" />
                            {project.name}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <div className="px-2 py-1.5 text-xs text-slate-600 italic">No recent projects</div>
                )}

                <DropdownMenuSeparator className="bg-slate-800" />
                
                <DropdownMenuItem onClick={handleNew} className="text-xs cursor-pointer focus:bg-slate-900 focus:text-blue-400">
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    New Project...
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setIsManagerOpen(true)} className="text-xs cursor-pointer focus:bg-slate-900 focus:text-slate-200">
                    <FolderOpen className="w-3.5 h-3.5 mr-2" />
                    All Projects...
                </DropdownMenuItem>

                {currentProject && (
                    <>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem onClick={() => duplicateProject(currentProject.id, `${currentProject.name} (Copy)`)} className="text-xs cursor-pointer focus:bg-slate-900 focus:text-slate-200">
                            <Copy className="w-3.5 h-3.5 mr-2" />
                            Duplicate Current
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => archiveProject(currentProject.id)} className="text-xs cursor-pointer focus:bg-slate-900 focus:text-slate-200">
                            <Archive className="w-3.5 h-3.5 mr-2" />
                            Archive Current
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

        <MBProjectManager isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
    </>
  );
};

export default MBProjectsButton;