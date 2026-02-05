import React from 'react';
import { useCollaboration } from '../../../contexts/CollaborationContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

const ProjectSharing = () => {
    const { showNotImplementedToast } = useCollaboration();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Share2 className="w-6 h-6 mr-2" /> Project Sharing</CardTitle>
                <CardDescription className="text-slate-400">Share your projects via link or email with specific access levels.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Secure Project Sharing Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Securely share your projects with colleagues and stakeholders. Control access levels, set expiration dates, and revoke access at any time.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default ProjectSharing;