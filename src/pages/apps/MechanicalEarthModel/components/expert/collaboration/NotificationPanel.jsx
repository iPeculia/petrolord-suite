import React from 'react';
import { useCollaboration } from '../../../contexts/CollaborationContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificationPanel = () => {
    const { showNotImplementedToast } = useCollaboration();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Bell className="w-6 h-6 mr-2" /> Notifications</CardTitle>
                <CardDescription className="text-slate-400">Stay updated with notifications for mentions, comments, and project invites.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Notification Center Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Get timely alerts for important project activities. Customize your notification preferences to stay in the loop without the noise.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default NotificationPanel;