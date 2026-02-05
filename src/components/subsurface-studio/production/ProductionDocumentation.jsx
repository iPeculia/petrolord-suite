import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const ProductionDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Operations Runbook
        </h1>
        <p className="mb-4">
            This guide outlines standard operating procedures (SOPs) for the EarthModel Studio production environment.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Incident Response Levels</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>SEV-1 (Critical):</strong> Total outage. 15m response time.</li>
            <li><strong>SEV-2 (Major):</strong> Feature degraded. 1h response time.</li>
            <li><strong>SEV-3 (Minor):</strong> Cosmetic/Minor bug. 24h response time.</li>
        </ul>
    </ScrollArea>
);
export default ProductionDocumentation;