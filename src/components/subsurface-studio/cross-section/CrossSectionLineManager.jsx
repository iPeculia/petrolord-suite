import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Trash2, Waypoints, Plus, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const CrossSectionLineManager = ({ savedLines = [], onSaveLine, onLoadLine, onDeleteLine, onDefineLine }) => {
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [newLineName, setNewLineName] = useState('');
    const { toast } = useToast();

    const handleSave = () => {
        if(!newLineName) {
            toast({ variant: 'destructive', title: 'Name required' });
            return;
        }
        onSaveLine(newLineName);
        setNewLineName('');
        setIsSaveOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-cyan-600 hover:bg-cyan-700" onClick={onDefineLine}>
                    <Plus className="w-4 h-4 mr-2"/> New Line
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsSaveOpen(true)}>
                    <Save className="w-4 h-4"/>
                </Button>
            </div>

            <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Sections</h3>
                <ScrollArea className="h-[200px] pr-2 border border-slate-700 rounded-md bg-slate-900/50">
                    <div className="p-2 space-y-1">
                        {savedLines.length === 0 && (
                            <div className="text-center text-xs text-slate-500 py-8">No saved lines found.</div>
                        )}
                        {savedLines.map(line => (
                            <div key={line.id} className="flex items-center justify-between p-2 bg-slate-800 rounded hover:bg-slate-700 group transition-colors border border-transparent hover:border-slate-600">
                                <div className="flex flex-col cursor-pointer flex-1 overflow-hidden" onClick={() => onLoadLine(line)}>
                                    <div className="flex items-center gap-2">
                                        <Waypoints className="w-3 h-3 text-purple-400 shrink-0" />
                                        <span className="text-sm font-medium text-slate-200 truncate">{line.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                                        <Clock className="w-2 h-2" />
                                        {line.created_at ? format(new Date(line.created_at), 'MMM d, yyyy') : 'Unknown'}
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDeleteLine(line.id)}>
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Save Cross Section</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm text-slate-400 mb-2 block">Name</label>
                        <Input 
                            placeholder="e.g. North-South Main Line" 
                            value={newLineName} 
                            onChange={e => setNewLineName(e.target.value)}
                            className="bg-slate-800 border-slate-600"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsSaveOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">Save Line</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CrossSectionLineManager;