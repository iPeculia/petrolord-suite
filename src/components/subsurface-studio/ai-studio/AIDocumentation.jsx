import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const AIDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> AI/ML Guide
        </h1>
        <p className="mb-4">
            Documentation for developing, training, and deploying machine learning models within EarthModel Studio.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">MLOps Workflow</h3>
        <ol className="list-decimal pl-5 space-y-1 text-slate-400">
            <li><strong>Data Prep:</strong> Use the Data Pipeline tool.</li>
            <li><strong>Training:</strong> Configure jobs in AutoML or Notebooks.</li>
            <li><strong>Registry:</strong> Version control your models.</li>
            <li><strong>Deployment:</strong> Push to production endpoints.</li>
        </ol>
    </ScrollArea>
);

export default AIDocumentation;