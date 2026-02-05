import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, PlusCircle } from 'lucide-react';

const ProjectManagementIntegration = () => {
  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-800">
                    <ClipboardList className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Project Tasks</div>
                    <div className="text-xs text-slate-500">Create QC/Review tasks automatically</div>
                </div>
            </div>
            <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20">
                <PlusCircle className="w-3 h-3 mr-2" /> Create Task
            </Button>
        </CardContent>
    </Card>
  );
};

export default ProjectManagementIntegration;