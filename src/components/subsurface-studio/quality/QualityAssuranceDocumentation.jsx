import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const QualityAssuranceDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-cyan-400" /> QA Strategy
        </h1>
        <p className="mb-4">
            Testing follows the "Testing Pyramid" approach: heavy reliance on fast unit tests, supported by integration tests for critical paths, and a select few E2E smoke tests.
        </p>
        <h2 className="font-bold text-white mt-4 mb-2">1. Unit Testing</h2>
        <p>Jest + React Testing Library. Focus on pure functions and isolated component rendering.</p>
        <h2 className="font-bold text-white mt-4 mb-2">2. Integration</h2>
        <p>Tests interaction between the frontend and Supabase mock. Validates data flow hooks.</p>
        <h2 className="font-bold text-white mt-4 mb-2">3. E2E</h2>
        <p>Cypress running against a staging environment. Covers critical "Golden Path" user journeys.</p>
    </ScrollArea>
);

export default QualityAssuranceDocumentation;