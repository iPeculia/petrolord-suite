import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, FileText, Check, Database, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const WellManager = ({ petroState, onCreateProject, onAddWell, onDeleteWell, onSelectWell }) => {
  const { wells, activeWellId, projectId, projectName } = petroState;
  const [newProjectName, setNewProjectName] = useState("");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files?.length > 0) {
          files.forEach(file => onAddWell(file, projectId));
      }
    },
    accept: { 'text/plain': ['.las', '.txt'] },
    multiple: true
  });

  const handleCreateProject = async () => {
      if(!newProjectName.trim()) return;
      await onCreateProject(newProjectName, "Created via Petrophysics Estimator");
      setIsProjectDialogOpen(false);
      setNewProjectName("");
  };

  return (
    <div className="h-full flex flex-col space-y-4">
        {/* Project Header */}
        <Card className="bg-slate-900 border-slate-800 shrink-0">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-md font-bold text-white">{projectName}</CardTitle>
                        <p className="text-xs text-slate-400">{wells.length} Wells • {projectId ? 'Cloud Sync On' : 'Local Session'}</p>
                    </div>
                    {!projectId && (
                        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                    <Database className="w-3 h-3 mr-2" /> Save Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-800">
                                <DialogHeader>
                                    <DialogTitle>Create New Project</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Project Name</Label>
                                        <Input 
                                            value={newProjectName} 
                                            onChange={e => setNewProjectName(e.target.value)}
                                            placeholder="e.g. Permian Basin Study 2025"
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                    <Button onClick={handleCreateProject} disabled={!newProjectName} className="w-full">
                                        Create & Save
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardHeader>
        </Card>

        {/* Well List */}
        <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-2 border-b border-slate-800/50">
                <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Wells
                </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {wells.map(well => (
                        <div 
                            key={well.id} 
                            onClick={() => onSelectWell(well.id)}
                            className={`
                                group p-3 rounded-lg border transition-all cursor-pointer relative
                                ${activeWellId === well.id 
                                    ? 'bg-blue-600/10 border-blue-500/50 shadow-md' 
                                    : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                    <h4 className={`text-sm font-medium truncate ${activeWellId === well.id ? 'text-blue-400' : 'text-slate-200'}`}>
                                        {well.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                        <span className="bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                                            {well.depthRange.min.toFixed(0)}-{well.depthRange.max.toFixed(0)}ft
                                        </span>
                                        {well.api && <span>API: {well.api}</span>}
                                    </div>
                                </div>
                                {activeWellId === well.id && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                            </div>
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-2 bottom-2 h-6 w-6 text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); onDeleteWell(well.id); }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}

                    <div 
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
                            ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-blue-400 hover:bg-slate-800/50'}
                        `}
                    >
                        <input {...getInputProps()} />
                        <Plus className="w-6 h-6 mx-auto text-slate-500 mb-1" />
                        <span className="text-xs text-slate-400">Add Well (.las)</span>
                    </div>
                </div>
            </ScrollArea>
        </Card>
    </div>
  );
};

export default WellManager;