import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const EnterpriseDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Enterprise Guide
        </h1>
        <p className="mb-4">
            Comprehensive documentation for managing the EarthModel Studio enterprise environment.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Quick Links</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Identity Provider Configuration</li>
            <li>Audit Log Schema</li>
            <li>API Rate Limits & Quotas</li>
            <li>Disaster Recovery Procedures</li>
        </ul>
    </ScrollArea>
);

export default EnterpriseDocumentation;