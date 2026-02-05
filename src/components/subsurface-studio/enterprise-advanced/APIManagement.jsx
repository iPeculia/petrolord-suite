import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Webhook } from 'lucide-react';

const APIManagement = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Webhook className="w-12 h-12 mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">API Gateway</h3>
            <p className="text-sm text-slate-500 mt-2">Rate limiting and key management.</p>
            <div className="mt-4 text-xs text-slate-400">2.4M requests / month</div>
        </CardContent>
    </Card>
);

export default APIManagement;