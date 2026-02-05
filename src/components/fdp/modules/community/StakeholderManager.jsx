import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StakeholderManager = ({ stakeholders, onUpdate }) => {
    const [newStakeholder, setNewStakeholder] = useState({
        name: '',
        influence: 'Medium',
        interest: 'Neutral',
        status: 'Neutral'
    });

    const handleAdd = () => {
        if (!newStakeholder.name) return;
        const updated = [...stakeholders, { ...newStakeholder, id: Date.now() }];
        onUpdate(updated);
        setNewStakeholder({ name: '', influence: 'Medium', interest: 'Neutral', status: 'Neutral' });
    };

    const handleDelete = (id) => {
        const updated = stakeholders.filter(s => s.id !== id);
        onUpdate(updated);
    };

    return (
        <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs text-slate-400">Name / Group</label>
                        <Input 
                            value={newStakeholder.name}
                            onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})}
                            placeholder="e.g. Local Fishermen Assoc."
                            className="bg-slate-800 border-slate-700 h-9"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400">Influence</label>
                        <Select value={newStakeholder.influence} onValueChange={(v) => setNewStakeholder({...newStakeholder, influence: v})}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400">Status</label>
                        <Select value={newStakeholder.status} onValueChange={(v) => setNewStakeholder({...newStakeholder, status: v})}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Supportive">Supportive</SelectItem>
                                <SelectItem value="Neutral">Neutral</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAdd} className="h-9 bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800/50">
                        <TableRow className="border-slate-800">
                            <TableHead className="text-slate-300">Stakeholder</TableHead>
                            <TableHead className="text-slate-300">Influence</TableHead>
                            <TableHead className="text-slate-300">Interest</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stakeholders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-slate-500 py-4">No stakeholders added.</TableCell>
                            </TableRow>
                        ) : (
                            stakeholders.map((s) => (
                                <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/30">
                                    <TableCell className="font-medium text-white">{s.name}</TableCell>
                                    <TableCell className="text-slate-400">{s.influence}</TableCell>
                                    <TableCell className="text-slate-400">{s.interest}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            s.status === 'Supportive' ? 'bg-green-900 text-green-300' : 
                                            s.status === 'Critical' ? 'bg-red-900 text-red-300' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                            {s.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-slate-500 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default StakeholderManager;