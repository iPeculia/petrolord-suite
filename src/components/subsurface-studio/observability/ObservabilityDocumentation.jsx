import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const ObservabilityDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Observability Guide
        </h1>
        <p className="mb-4">
            The Observability stack provides deep visibility into the application's internal state through the three pillars: Logs, Metrics, and Traces.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Alerting Philosophy</h3>
        <p>Alerts are configured on symptoms (e.g., high latency), not causes (e.g., high CPU), to reduce noise.</p>
    </ScrollArea>
);
export default ObservabilityDocumentation;