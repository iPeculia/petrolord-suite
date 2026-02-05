import React, { useState } from 'react';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, Edit } from 'lucide-react';
import AddCompletionComponentDialog from './AddCompletionComponentDialog';

const CompletionComponentsList = ({ stringId }) => {
    const { tubingStrings, setTubingStrings } = useCasingTubingDesign();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const activeString = tubingStrings.find(s => s.id === stringId);

    if (!activeString) return null;

    const handleDelete = (compId) => {
        setTubingStrings(prev => prev.map(str => {
            if (str.id === stringId) {
                return {
                    ...str,
                    components: str.components.filter(c => c.id !== compId)
                };
            }
            return str;
        }));
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-semibold text-slate-300">Completion Components</h3>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs border-lime-600 text-lime-400 hover:bg-lime-600 hover:text-white"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="w-3 h-3 mr-1" /> Add Component
                </Button>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-900/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400">Type</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Depth (m)</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">OD (in)</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400">Description</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Status</TableHead>
                            <TableHead className="h-8 w-16"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!activeString.components || activeString.components.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-xs text-slate-500 py-4 italic">
                                    No components added.
                                </TableCell>
                            </TableRow>
                        ) : (
                            activeString.components.map((comp) => (
                                <TableRow key={comp.id} className="border-slate-800 hover:bg-slate-800/50 h-8">
                                    <TableCell className="py-1 text-xs font-medium text-slate-200">{comp.type}</TableCell>
                                    <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{comp.depth}</TableCell>
                                    <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{comp.od}</TableCell>
                                    <TableCell className="py-1 text-xs text-slate-400 truncate max-w-[150px]">{comp.description || '-'}</TableCell>
                                    <TableCell className="py-1 text-center">
                                        <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${comp.status === 'Active' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                            {comp.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-1 text-right">
                                        <div className="flex justify-end space-x-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white"><Edit className="w-3 h-3" /></Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={() => handleDelete(comp.id)}><Trash className="w-3 h-3" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AddCompletionComponentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} stringId={stringId} />
        </div>
    );
};

export default CompletionComponentsList;