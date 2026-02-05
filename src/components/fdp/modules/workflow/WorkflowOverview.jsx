import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, CheckSquare, GitPullRequest, Clock } from 'lucide-react';
import { useFDP } from '@/contexts/FDPContext';
import { Progress } from '@/components/ui/progress';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
        </CardContent>
    </Card>
);

const WorkflowOverview = ({ onNavigate }) => {
    const { state } = useFDP();
    const { tasks, approvals } = state.workflow;

    const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
    const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Pending Tasks" 
                    value={pendingTasks} 
                    subtitle="Assigned to team" 
                    icon={CheckSquare} 
                    color="blue" 
                />
                <StatCard 
                    title="Approvals" 
                    value={pendingApprovals} 
                    subtitle="Awaiting decision" 
                    icon={GitPullRequest} 
                    color="yellow" 
                />
                <StatCard 
                    title="On Schedule" 
                    value="92%" 
                    subtitle="Task completion rate" 
                    icon={Clock} 
                    color="green" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Project Progress</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Field Development Plan</span>
                                    <span className="text-white font-bold">65%</span>
                                </div>
                                <Progress value={65} className="h-2 bg-slate-800" indicatorClassName="bg-blue-500" />
                            </div>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Subsurface Analysis</span>
                                    <span className="text-white font-bold">80%</span>
                                </div>
                                <Progress value={80} className="h-2 bg-slate-800" indicatorClassName="bg-green-500" />
                            </div>
                             <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300">Economics & Costing</span>
                                    <span className="text-white font-bold">40%</span>
                                </div>
                                <Progress value={40} className="h-2 bg-slate-800" indicatorClassName="bg-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h3>
                        <div className="space-y-3">
                            {tasks.filter(t => t.status !== 'Done').slice(0,4).map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded border-l-2 border-blue-500">
                                    <div>
                                        <div className="text-sm font-medium text-white">{task.title}</div>
                                        <div className="text-xs text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        task.priority === 'Critical' ? 'bg-red-900 text-red-300' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WorkflowOverview;