import React, { useState } from 'react';
import { useCasingTubingDesign } from '../contexts/CasingTubingDesignContext';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
    PlusCircle, 
    Copy, 
    Save, 
    Download, 
    Settings, 
    ChevronLeft,
    ChevronRight,
    Search,
    Database,
    FileText,
    FolderOpen
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

const LeftPanel = () => {
    const { 
        wells, 
        selectedWell, 
        setSelectedWell, 
        designCases, 
        selectedDesignCase, 
        setSelectedDesignCase,
        createDesignCase
    } = useCasingTubingDesign();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [newCaseName, setNewCaseName] = useState('');
    const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);

    const handleCreateCase = () => {
        if (newCaseName) {
            createDesignCase(newCaseName);
            setNewCaseName('');
            setIsNewCaseDialogOpen(false);
        }
    };

    if (isCollapsed) {
        return (
            <div className="w-14 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 space-y-6 shrink-0 transition-all duration-300 z-10">
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="text-slate-400 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                </Button>
                <div className="h-px w-8 bg-slate-800" />
                <Button variant="ghost" size="icon" title="Wells">
                    <Database className="w-5 h-5 text-slate-400 hover:text-lime-400 transition-colors" />
                </Button>
                <Button variant="ghost" size="icon" title="Designs">
                    <FileText className="w-5 h-5 text-slate-400 hover:text-lime-400 transition-colors" />
                </Button>
            </div>
        );
    }

    return (
        <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 z-10">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                <span className="text-sm font-semibold text-slate-200 flex items-center">
                    <FolderOpen className="w-4 h-4 mr-2 text-lime-500" />
                    Project Explorer
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCollapsed(true)}>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Well Selection */}
                    <div className="space-y-3">
                        <Label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Select Well</Label>
                        <Select 
                            value={selectedWell?.id} 
                            onValueChange={(val) => setSelectedWell(wells.find(w => w.id === val))}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 h-9">
                                <SelectValue placeholder="Choose a well..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <div className="p-2 sticky top-0 bg-slate-900 border-b border-slate-700 z-10">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                                        <Input placeholder="Filter..." className="h-7 pl-7 bg-slate-950 border-slate-700 text-xs" />
                                    </div>
                                </div>
                                {wells.map(well => (
                                    <SelectItem key={well.id} value={well.id} className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                                        {well.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Design Case Selection */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Design Case</Label>
                            <Dialog open={isNewCaseDialogOpen} onOpenChange={setIsNewCaseDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-lime-400 hover:text-lime-300 hover:bg-slate-800" disabled={!selectedWell}>
                                        <PlusCircle className="w-3 h-3 mr-1" /> NEW
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                                    <DialogHeader>
                                        <DialogTitle>New Design Case</DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            Create a new casing design scenario for {selectedWell?.name}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label>Case Name</Label>
                                        <Input 
                                            value={newCaseName}
                                            onChange={(e) => setNewCaseName(e.target.value)}
                                            placeholder="e.g., Production Liner Re-design"
                                            className="bg-slate-800 border-slate-700 mt-2"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateCase} className="bg-lime-600 hover:bg-lime-700 text-white">Create</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        
                        <Select 
                            value={selectedDesignCase?.id} 
                            onValueChange={(val) => setSelectedDesignCase(designCases.find(c => c.id === val))}
                            disabled={!selectedWell}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 h-9">
                                <SelectValue placeholder={selectedWell ? "Select design..." : "Select well first"} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {designCases.length === 0 ? (
                                    <div className="p-2 text-xs text-slate-500 text-center">No designs found</div>
                                ) : (
                                    designCases.map(c => (
                                        <SelectItem key={c.id} value={c.id} className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer">
                                            {c.scheme_name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-px w-full bg-slate-800" />

                    {/* Actions */}
                    <div className="space-y-2">
                        <Label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2 block">Quick Actions</Label>
                        <Button className="w-full justify-start bg-lime-600 hover:bg-lime-700 text-white shadow-lg shadow-lime-900/20" disabled={!selectedDesignCase}>
                            <Save className="w-4 h-4 mr-2" /> Save Design
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white" disabled={!selectedDesignCase}>
                            <Copy className="w-4 h-4 mr-2" /> Duplicate Case
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white" disabled={!selectedDesignCase}>
                            <Download className="w-4 h-4 mr-2" /> Export Report
                        </Button>
                    </div>
                </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 text-xs">
                    <Settings className="w-3.5 h-3.5 mr-2" /> Project Settings
                </Button>
            </div>
        </div>
    );
};

export default LeftPanel;