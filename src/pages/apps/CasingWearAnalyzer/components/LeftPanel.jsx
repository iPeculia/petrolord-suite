import React, { useState } from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2, FileText, Database, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LeftPanel = () => {
  const {
    wells, selectedWell, setSelectedWell,
    casingStrings, selectedCasingString, setSelectedCasingString,
    projects, activeProject, setActiveProject,
    versions, activeVersionId, loadVersion, createNewVersion, deleteCase, duplicateCase,
    isLeftPanelOpen, toggleLeftPanel
  } = useCasingWearAnalyzer();

  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');

  const handleCreateVersion = () => {
    if (newVersionName) {
      createNewVersion(newVersionName, '');
      setNewVersionName('');
      setIsNewVersionDialogOpen(false);
    }
  };

  if (!isLeftPanelOpen) {
    return (
      <div className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 shrink-0 transition-all duration-300">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleLeftPanel} className="h-8 w-8 text-slate-400 hover:text-white mb-4">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Expand Project Panel</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="h-px w-6 bg-slate-800 mb-4"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <Database className="w-5 h-5" />
                <FileText className="w-5 h-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right"><p>Project & Versions</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Explorer</span>
        <Button variant="ghost" size="icon" onClick={toggleLeftPanel} className="h-6 w-6 text-slate-500 hover:text-white">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Section A: Data Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <Database className="w-3 h-3 mr-2" /> Project Context
            </h3>
            
            <div className="space-y-3">
              {/* Project Selector */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Current Project</label>
                <Select value={activeProject?.id} onValueChange={(val) => setActiveProject(projects.find(p => p.id === val))}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-xs h-8">
                    <SelectValue placeholder="Select Project..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id} className="text-xs focus:bg-slate-800">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-slate-800 my-2" />

              {/* Well Selector */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Well</label>
                <Select value={selectedWell?.id} onValueChange={(val) => setSelectedWell(wells.find(w => w.id === val))}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-xs h-8">
                    <SelectValue placeholder="Select Well..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {wells.map(w => (
                      <SelectItem key={w.id} value={w.id} className="text-xs focus:bg-slate-800">{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Casing Selector */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Target Casing</label>
                <Select value={selectedCasingString?.id} onValueChange={(val) => setSelectedCasingString(casingStrings.find(cs => cs.id === val))}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-xs h-8">
                    <SelectValue placeholder="Select Casing..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {casingStrings.map(cs => (
                      <SelectItem key={cs.id} value={cs.id} className="text-xs focus:bg-slate-800">{cs.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCasingString && (
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800 text-[10px] text-slate-400 grid grid-cols-2 gap-y-1 mt-1">
                    <span>OD: <span className="text-slate-200">{selectedCasingString.od}"</span></span>
                    <span>Wt: <span className="text-slate-200">{selectedCasingString.weight} #</span></span>
                    <span>Grade: <span className="text-slate-200">{selectedCasingString.grade}</span></span>
                    <span>Top: <span className="text-slate-200">{selectedCasingString.top}m</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Section B: Version Management */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
              <span className="flex items-center"><FileText className="w-3 h-3 mr-2" /> Versions</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{versions.length}</span>
            </h3>
            
            <Button size="sm" onClick={() => setIsNewVersionDialogOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8">
              <Plus className="w-3 h-3 mr-1" /> New Version
            </Button>

            <div className="space-y-2 mt-2">
              {versions.length === 0 ? (
                <div className="text-center py-8 text-slate-600 text-xs italic">
                  No versions created yet.
                </div>
              ) : (
                versions.map(v => (
                  <Card 
                    key={v.id} 
                    className={`bg-slate-900 border transition-colors cursor-pointer group ${
                      activeVersionId === v.id ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => loadVersion(v)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium truncate ${activeVersionId === v.id ? 'text-amber-400' : 'text-slate-300'}`}>
                            {v.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>{new Date(v.modified).toLocaleDateString()}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                              v.status === 'Saved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'
                            }`}>
                              {v.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateCase(); }}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-600 hover:text-red-400" title="Delete" onClick={(e) => { e.stopPropagation(); deleteCase(v.id); }}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* New Version Dialog */}
      <Dialog open={isNewVersionDialogOpen} onOpenChange={setIsNewVersionDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Version Name</Label>
              <Input 
                value={newVersionName} 
                onChange={(e) => setNewVersionName(e.target.value)} 
                placeholder="e.g. Option B - Reduced RPM"
                className="bg-slate-950 border-slate-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewVersionDialogOpen(false)} className="text-slate-400">Cancel</Button>
            <Button onClick={handleCreateVersion} disabled={!newVersionName} className="bg-emerald-600 hover:bg-emerald-500">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftPanel;