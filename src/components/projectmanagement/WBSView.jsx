import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Trash2, Save, Flag, ArrowUp, ArrowDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ExportControls from './ExportControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const WBSView = ({ tasks, onDataChange, projectName }) => {
  const { toast } = useToast();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const getStatusColor = (task) => {
    if (task.type === 'milestone') return 'text-purple-400';
    if (task.percent_complete === 100) return 'text-green-400';
    if (new Date(task.planned_end_date) < new Date() && task.percent_complete < 100) return 'text-red-400';
    return 'text-blue-400';
  };

  const getStatusText = (task) => {
    if (task.type === 'milestone') return 'Milestone';
    if (task.percent_complete === 100) return 'Completed';
    if (new Date(task.planned_end_date) < new Date() && task.percent_complete < 100) return 'Delayed';
    return 'In Progress';
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) {
        toast({ variant: 'destructive', title: 'Failed to delete item', description: error.message });
      } else {
        toast({ title: 'Item Deleted' });
        onDataChange();
      }
    }
  };

  const handleValueChange = (taskId, field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
    setEditingTaskId(taskId);
  };

  const handleSaveTask = async (taskId) => {
    const updates = editedValues[taskId];
    if (!updates) return;

    const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);
    if (error) {
      toast({ variant: 'destructive', title: 'Failed to update', description: error.message });
    } else {
      toast({ title: 'Updated Successfully!' });
      setEditingTaskId(null);
      setEditedValues(prev => {
        const newVals = { ...prev };
        delete newVals[taskId];
        return newVals;
      });
      onDataChange();
    }
  };

  const handleReorder = async (task, direction) => {
    const currentIndex = tasks.findIndex(t => t.id === task.id);
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === tasks.length - 1)) {
      return;
    }

    const otherIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const otherTask = tasks[otherIndex];

    const updates = [
      { id: task.id, display_order: otherTask.display_order },
      { id: otherTask.id, display_order: task.display_order }
    ];

    const { error } = await supabase.from('tasks').upsert(updates);

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to reorder tasks', description: error.message });
    } else {
      onDataChange();
    }
  };

  const openMilestoneDetails = (task) => {
      setSelectedMilestone(task);
      setMilestoneDialogOpen(true);
  };

  const exportColumns = [
      { header: "Name", accessor: "name" },
      { header: "Workstream", accessor: "workstream" },
      { header: "Category", accessor: "task_category" },
      { header: "Owner", accessor: "owner" },
      { header: "Start Date", accessor: "planned_start_date" },
      { header: "End Date", accessor: "planned_end_date" },
      { header: "Status", accessor: "status" }
  ];
  
  const exportData = tasks.map(t => ({
      name: t.name,
      workstream: t.workstream || '-',
      task_category: t.task_category || '-',
      owner: t.owner || 'N/A',
      planned_start_date: new Date(t.planned_start_date).toLocaleDateString(),
      planned_end_date: new Date(t.planned_end_date).toLocaleDateString(),
      status: getStatusText(t)
  }));
  
  return (
    <div>
        <ExportControls columns={exportColumns} data={exportData} fileName={`${projectName}_WBS`} title={`${projectName} - WBS`} />
        <div className="max-h-[600px] overflow-y-auto">
            <Table id="tasks-table">
                <TableHeader>
                    <TableRow className="border-b-white/20 hover:bg-white/10">
                        <TableHead className="text-white w-[60px]">Order</TableHead>
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Stream</TableHead>
                        <TableHead className="text-white">Owner</TableHead>
                        <TableHead className="text-white">Dates</TableHead>
                        <TableHead className="text-white">Progress</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks && tasks.length > 0 ? tasks.map((task, index) => (
                        <TableRow key={task.id} className={`border-b-white/10 hover:bg-white/5 ${task.type === 'milestone' ? 'bg-purple-500/5' : ''}`}>
                            <TableCell className="flex flex-col items-center justify-center gap-1">
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500 hover:text-white" onClick={() => handleReorder(task, 'up')} disabled={index === 0}>
                                    <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500 hover:text-white" onClick={() => handleReorder(task, 'down')} disabled={index === tasks.length - 1}>
                                    <ArrowDown className="w-3 h-3" />
                                </Button>
                            </TableCell>
                            <TableCell className="font-medium text-white">
                                <div className="flex items-center gap-2">
                                    {task.type === 'milestone' ? <Flag className="w-4 h-4 text-purple-400" /> : <div className="w-4 h-4 rounded-full border border-slate-500" />}
                                    {editingTaskId === task.id ? (
                                        <Input className="h-7 w-48" defaultValue={task.name} onChange={e => handleValueChange(task.id, 'name', e.target.value)} />
                                    ) : (
                                        <span>{task.name}</span>
                                    )}
                                </div>
                                {task.task_category && <span className="text-[10px] text-slate-400 ml-6">{task.task_category}</span>}
                            </TableCell>
                            <TableCell>
                                {task.workstream && <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-300">{task.workstream}</Badge>}
                            </TableCell>
                            <TableCell className="text-slate-300 text-xs">{task.owner || '-'}</TableCell>
                            <TableCell className="text-xs">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between w-32">
                                        <span className="text-slate-500 w-8">Plan:</span>
                                        <Input 
                                            type="date" 
                                            defaultValue={task.planned_end_date}
                                            onChange={(e) => handleValueChange(task.id, 'planned_end_date', e.target.value)}
                                            className="h-6 bg-transparent border-0 p-0 text-xs w-24 text-right text-slate-300 focus:ring-0"
                                        />
                                    </div>
                                     <div className="flex items-center justify-between w-32">
                                        <span className="text-slate-500 w-8">Act:</span>
                                        <Input 
                                            type="date" 
                                            defaultValue={task.actual_end_date}
                                            onChange={(e) => handleValueChange(task.id, 'actual_end_date', e.target.value)}
                                            className="h-6 bg-transparent border-0 p-0 text-xs w-24 text-right text-emerald-300 focus:ring-0 placeholder:text-slate-700"
                                            placeholder="Set Date"
                                        />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {task.type === 'task' ? (
                                    <div className="flex items-center gap-2 w-24">
                                        <Progress value={task.percent_complete || 0} className="h-2 flex-1" />
                                        <span className="text-xs text-slate-300 w-6 text-right">{task.percent_complete}%</span>
                                    </div>
                                ) : (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-purple-300 hover:text-purple-200" onClick={() => openMilestoneDetails(task)}>
                                        Details
                                    </Button>
                                )}
                            </TableCell>
                            <TableCell className={`text-xs font-medium ${getStatusColor(task)}`}>
                                {getStatusText(task)}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    {editingTaskId === task.id && (
                                        <Button variant="ghost" size="icon" onClick={() => handleSaveTask(task.id)} className="h-8 w-8 text-lime-400 hover:bg-lime-500/10">
                                            <Save className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)} className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-900/20">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow><TableCell colSpan="8" className="text-center text-slate-400 py-8">No tasks or milestones created yet.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Milestone Details: {selectedMilestone?.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Gate Readiness</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 border-2 border-green-500 text-green-500 font-bold text-xl">
                                {selectedMilestone?.milestone_details?.readiness_score || '0'}%
                            </div>
                            <div className="text-xs text-slate-400 flex-1">
                                Score based on completed deliverables and sign-offs.
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Entry Criteria</Label>
                        <div className="text-sm text-slate-400 italic p-2 bg-slate-950 rounded">No criteria defined.</div>
                    </div>
                     <div className="space-y-2">
                        <Label>Approvers</Label>
                        <div className="text-sm text-slate-400 italic p-2 bg-slate-950 rounded">No approvers assigned.</div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setMilestoneDialogOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default WBSView;