import React from 'react';
import { Bot } from 'lucide-react';

const WorkflowAutomationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Bot className="w-6 h-6 text-emerald-400"/> Workflow Automation
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p className="mb-4">
            Eliminate repetitive clicks. Our "Macro Recorder" allows you to script velocity modeling steps.
        </p>
        <h4 className="text-white font-bold mb-2">Common Automated Tasks:</h4>
        <ul className="list-disc pl-5 space-y-1">
            <li>Batch import of 500+ LAS files.</li>
            <li>Auto-generation of Residual Maps for every horizon.</li>
            <li>Nightly re-gridding of the regional model as new tops are added.</li>
            <li>Exporting depth surfaces to Kingdom/Petrel shared folders.</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkflowAutomationGuide;