import React from 'react';
import { Button } from '@/components/ui/button';
import { Workflow, Clock } from 'lucide-react';
import { WORKFLOW_TEMPLATES, scheduleJob } from '@/utils/workflowAutomation';
import { useToast } from '@/components/ui/use-toast';

const WorkflowAutomationPanel = () => {
    const { toast } = useToast();
    
    const handleSchedule = async (template) => {
        await scheduleJob(template);
        toast({ title: "Workflow Scheduled", description: `${template.name} added to job queue.` });
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Workflow className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200">Automated Workflows</h3>
            </div>

            <div className="space-y-2">
                {WORKFLOW_TEMPLATES.map(tpl => (
                    <div key={tpl.id} className="p-3 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition-colors flex justify-between items-center">
                        <div>
                            <div className="text-sm font-medium text-slate-300">{tpl.name}</div>
                            <div className="text-[10px] text-slate-500">{tpl.steps.length} steps: {tpl.steps.slice(0,3).join(', ')}...</div>
                        </div>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            onClick={() => handleSchedule(tpl)}
                        >
                            <Clock className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkflowAutomationPanel;