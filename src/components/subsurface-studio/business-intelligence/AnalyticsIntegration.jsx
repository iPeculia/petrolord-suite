import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'lucide-react';

const AnalyticsIntegration = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Link className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Third-Party Integrations</h3>
            <div className="flex justify-center gap-4 mt-4">
                <span className="text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400">Google Analytics 4</span>
                <span className="text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400">Mixpanel</span>
                <span className="text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400">Segment</span>
            </div>
        </CardContent>
    </Card>
);
export default AnalyticsIntegration;