import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';

const ProjectManager = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FolderOpen className="w-4 h-4 mr-2" /> Projects
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle>Project Management</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-slate-400 text-sm">Project list functionality coming soon.</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectManager;