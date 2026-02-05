import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bug } from 'lucide-react';

const ErrorTracking = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Bug className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Error Aggregation</h3>
            <p className="text-sm text-slate-500 mt-2">Sentry/Bugsnag integration panel.</p>
            <div className="mt-4 text-xs text-slate-400">Top Issue: NullReference in SeismicViewer (340 events)</div>
        </CardContent>
    </Card>
);
export default ErrorTracking;