import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
const ErrorHandling = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Error Boundary Logs</h3>
            <p className="text-sm text-slate-500 mt-2">0 Critical Errors in last 24h.</p>
        </CardContent>
    </Card>
);
export default ErrorHandling;