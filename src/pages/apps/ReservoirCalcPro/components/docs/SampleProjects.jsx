import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SampleProjects = () => (
    <div className="space-y-6">
        <h1>Sample Projects</h1>
        <div className="space-y-3">
            {['North Sea Oil Field (Simple)', 'Gulf Coast Gas (Surfaces)', 'Permian Hybrid Model'].map(name => (
                <div key={name} className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-800">
                    <div className="flex items-center gap-3">
                        <FileText className="text-blue-400" />
                        <span className="text-slate-200">{name}</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Load
                    </Button>
                </div>
            ))}
        </div>
    </div>
);

export default SampleProjects;