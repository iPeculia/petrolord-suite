import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Button } from '@/components/ui/button';
import { ClipboardList, CheckSquare, GitPullRequest } from 'lucide-react';
import WorkflowOverview from './workflow/WorkflowOverview';
import TaskManagement from './workflow/TaskManagement';
import ApprovalWorkflow from './workflow/ApprovalWorkflow';

const WorkflowManagementModule = () => {
    const { state } = useFDP();
    const [activeTool, setActiveTool] = useState('overview');

    const renderTool = () => {
        switch(activeTool) {
            case 'tasks': return <TaskManagement />;
            case 'approvals': return <ApprovalWorkflow />;
            default: return <WorkflowOverview onNavigate={setActiveTool} />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Workflow & Tasks</h2>
                    <p className="text-slate-400">Track progress, manage assignments, and handle approvals.</p>
                </div>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <Button 
                        variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('overview')}
                        className="text-xs"
                    >
                        <ClipboardList className="w-4 h-4 mr-2" /> Overview
                    </Button>
                    <Button 
                        variant={activeTool === 'tasks' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('tasks')}
                        className="text-xs"
                    >
                        <CheckSquare className="w-4 h-4 mr-2" /> Tasks
                    </Button>
                    <Button 
                        variant={activeTool === 'approvals' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('approvals')}
                        className="text-xs"
                    >
                        <GitPullRequest className="w-4 h-4 mr-2" /> Approvals
                    </Button>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default WorkflowManagementModule;