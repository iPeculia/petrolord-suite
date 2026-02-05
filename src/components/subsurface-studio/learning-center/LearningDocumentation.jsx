import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const LearningDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Learning Center Guide
        </h1>
        <p className="mb-4">
            The Learning Center enables continuous education for platform users. It supports varied content types including text articles, video courses, and interactive walkthroughs.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Structure</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Knowledge Base:</strong> Unstructured, searchable documentation.</li>
            <li><strong>Learning Paths:</strong> Structured sequences of courses.</li>
            <li><strong>Certifications:</strong> Formal validation of skills.</li>
        </ul>
    </ScrollArea>
);
export default LearningDocumentation;