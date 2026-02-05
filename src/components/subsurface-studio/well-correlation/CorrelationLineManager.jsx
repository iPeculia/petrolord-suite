import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Link as LinkIcon, Save, Edit2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const CorrelationLineManager = ({ lines, onDeleteLine, onSaveLines, onRenameLine }) => {
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState('');

    const startEdit = (line) => {
        setEditingId(line.id);
        setNewName(line.type || 'Correlation');
    };

    const saveEdit = () => {
        if (editingId) {
            onRenameLine(editingId, newName);
            setEditingId(null);
        }
    };

    return (
        <div className="p-4 space-y-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-2">
                <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4"/>
                    <h3>Correlations</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onSaveLines} className="h-6 w-6" title="Save to Database">
                    <Save className="w-3 h-3 text-blue-400" />
                </Button>
            </div>
            
            <ScrollArea className="h-48 rounded-lg border border-slate-800 bg-slate-900/30">
                {lines.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4 text-center">
                        <LinkIcon className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-[10px]">Select "Correlation Line" tool and click between two wells to connect.</p>
                    </div>
                )}
                <div className="p-1 space-y-1">
                    {lines.map((line, idx) => (
                        <div key={line.id} className="group flex items-center justify-between p-2 hover:bg-slate-800 rounded border border-transparent hover:border-slate-700 transition-colors">
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-medium text-slate-200 truncate">
                                    {line.type || `Correlation ${idx+1}`}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    {Math.round(line.depth1)}m <span className="text-slate-600">→</span> {Math.round(line.depth2)}m
                                </span>
                            </div>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32 bg-slate-800 border-slate-700 text-white">
                                    <DropdownMenuItem onClick={() => startEdit(line)}>
                                        <Edit2 className="w-3 h-3 mr-2" /> Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-900/20" onClick={() => onDeleteLine(line.id)}>
                                        <Trash2 className="w-3 h-3 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <Dialog open={!!editingId} onOpenChange={(o) => !o && setEditingId(null)}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader><DialogTitle>Rename Correlation</DialogTitle></DialogHeader>
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-slate-800" />
                    <DialogFooter>
                        <Button size="sm" onClick={saveEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CorrelationLineManager;