import React from 'react';
import { useCollaboration } from '../../../contexts/CollaborationContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

const AuditLog = () => {
    const { showNotImplementedToast } = useCollaboration();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><ShieldCheck className="w-6 h-6 mr-2" /> Audit Log</CardTitle>
                <CardDescription className="text-slate-400">Track all user actions, data changes, and access events for compliance.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Comprehensive Audit Trail Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">A detailed, immutable log of all activities within your project. Filter, search, and export audit trails for security and compliance purposes.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default AuditLog;