import React from 'react';
import { useCollaboration } from '../../../contexts/CollaborationContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Zap } from 'lucide-react';

const RealTimeCollaboration = () => {
    const { showNotImplementedToast } = useCollaboration();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Zap className="w-6 h-6 mr-2" /> Real-Time Collaboration</CardTitle>
                <CardDescription className="text-slate-400">See team members' cursors, selections, and changes as they happen.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Live Collaboration Engine Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Experience true teamwork with live cursors, simultaneous editing, and conflict resolution. See who's online and what they're working on.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default RealTimeCollaboration;