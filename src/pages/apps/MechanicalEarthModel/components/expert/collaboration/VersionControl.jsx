import React from 'react';
import { useCollaboration } from '../../../contexts/CollaborationContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

const VersionControl = () => {
    const { showNotImplementedToast } = useCollaboration();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><GitBranch className="w-6 h-6 mr-2" /> Version Control</CardTitle>
                <CardDescription className="text-slate-400">Track project history, compare versions, and roll back to previous states.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <GitBranch className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Project Versioning System Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Never lose your work. This system will automatically save project versions, allowing you to view history, compare changes, and restore previous states.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default VersionControl;