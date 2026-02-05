import React from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const TaskColumn = ({ title, tasks, color }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex-1 min-w-[250px]">
        <div className={`flex items-center justify-between mb-4 pb-2 border-b border-${color}-500/30`}>
            <h3 className="font-bold text-slate-300 text-sm">{title}</h3>
            <Badge variant="secondary" className="bg-slate-800 text-slate-400">{tasks.length}</Badge>
        </div>
        <div className="space-y-3">
            {tasks.map(task => (
                <Card key={task.id} className="bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
                    <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                task.priority === 'Critical' ? 'bg-red-900 text-red-300' : 
                                task.priority === 'High' ? 'bg-orange-900 text-orange-300' : 'bg-slate-900 text-slate-400'
                            }`}>
                                {task.priority}
                            </span>
                            <span className="text-[10px] text-slate-500">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-medium text-white mb-2">{task.title}</h4>
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>{task.assigneeName}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

const TaskManagement = () => {
    const { state } = useFDP();
    const { tasks } = state.workflow;

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4 mr-2" /> New Task
                </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
                <TaskColumn title="To Do" tasks={tasks.filter(t => t.status === 'To Do')} color="slate" />
                <TaskColumn title="In Progress" tasks={tasks.filter(t => t.status === 'In Progress')} color="blue" />
                <TaskColumn title="Done" tasks={tasks.filter(t => t.status === 'Done')} color="green" />
            </div>
        </div>
    );
};

export default TaskManagement;