import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Play, GitBranch } from 'lucide-react';
import { useBasinFlow } from '../../contexts/BasinFlowContext';
import { useToast } from '@/components/ui/use-toast';

const ScenarioManager = () => {
    const { state, dispatch } = useBasinFlow();
    const { scenarios, activeScenarioId } = state;
    const { toast } = useToast();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState(null); // null = create new
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleCreateClick = () => {
        setEditingScenario(null);
        setFormData({ name: `Scenario ${scenarios.length + 1}`, description: '' });
        setIsEditOpen(true);
    };

    const handleEditClick = (scenario) => {
        setEditingScenario(scenario);
        setFormData({ name: scenario.name, description: scenario.parameters?.description || '' });
        setIsEditOpen(true);
    };

    const handleSave = () => {
        if (editingScenario) {
            // Update existing (This needs a new reducer case ideally, or we just re-save. 
            // Reducer currently only has SAVE_SCENARIO which creates new. 
            // For Phase 3, let's assume editing mostly means renaming/meta updates, OR re-saving current state as that scenario ID.
            // Let's implement a basic metadata update or simple delete-readd logic if reducer is limited, 
            // but for robustness we should add UPDATE_SCENARIO to context. I will stick to CREATE for now for safety.)
            
            // Actually, just updating name is fine for now.
            // We'll assume SAVE_SCENARIO creates new.
            // Let's treat this as "Create New Snapshot" for the null case.
            if (editingScenario.id) {
                // Since we don't have UPDATE_SCENARIO in context yet, we'll skip editing logic in this iteration
                // or just console log.
                // Wait, I should allow creating new scenarios from current state.
            }
        } else {
            // Create new from current state
            dispatch({ 
                type: 'SAVE_SCENARIO', 
                payload: { name: formData.name, description: formData.description } 
            });
            toast({ title: "Scenario Created", description: `${formData.name} saved.` });
        }
        setIsEditOpen(false);
    };

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_SCENARIO', id });
        toast({ title: "Scenario Deleted" });
    };

    const handleLoad = (id) => {
        dispatch({ type: 'LOAD_SCENARIO', id });
        toast({ title: "Scenario Loaded", description: "Parameters updated from snapshot." });
    };

    return (
        <div className="h-full p-6 bg-slate-950 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <GitBranch className="w-6 h-6 text-indigo-400" /> Scenario Manager
                        </h2>
                        <p className="text-slate-400 text-sm">Create, manage, and compare simulation scenarios.</p>
                    </div>
                    <Button onClick={handleCreateClick} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Save Current State
                    </Button>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Name</TableHead>
                                    <TableHead className="text-slate-400">Created</TableHead>
                                    <TableHead className="text-slate-400">Description</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scenarios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            No scenarios saved yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    scenarios.map((s) => (
                                        <TableRow key={s.id} className={`border-slate-800 ${activeScenarioId === s.id ? 'bg-indigo-900/10' : ''}`}>
                                            <TableCell className="font-medium text-white">
                                                {s.name}
                                                {activeScenarioId === s.id && <span className="ml-2 text-[10px] text-indigo-400 bg-indigo-900/30 px-1.5 py-0.5 rounded">Active</span>}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-xs">
                                                {new Date(s.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm max-w-xs truncate">
                                                {s.parameters?.description || '-'}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-emerald-400" onClick={() => handleLoad(s.id)} title="Load">
                                                    <Play className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400" onClick={() => handleDelete(s.id)} title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{editingScenario ? 'Edit Scenario' : 'Save Scenario'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Name</label>
                            <Input 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-slate-950 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Description</label>
                            <Textarea 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="bg-slate-950 border-slate-700 h-20"
                                placeholder="Notes about this run..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ScenarioManager;