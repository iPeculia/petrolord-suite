import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const AnalyticsDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> BI & Analytics Guide
        </h1>
        <p className="mb-4">
            The Business Intelligence module aggregates telemetry from all subsystems to provide actionable insights for platform administrators.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Key Metrics</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>DAU/MAU:</strong> Daily/Monthly Active Users ratio indicating stickiness.</li>
            <li><strong>Feature Depth:</strong> How many distinct features a user engages with per session.</li>
            <li><strong>Time to Value:</strong> Duration from signup to first successful project creation.</li>
        </ul>
    </ScrollArea>
);

export default AnalyticsDocumentation;