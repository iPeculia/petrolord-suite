import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocumentationUpdatesLog = () => {
  const updates = [
    { date: "2023-11-15", ver: "v2.4", desc: "Added Anisotropy (VTI) guide." },
    { date: "2023-10-01", ver: "v2.3", desc: "Updated Python API examples." },
    { date: "2023-09-20", ver: "v2.2", desc: "New Troubleshooting section for grid exports." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white">Doc Updates</h2>
      <ScrollArea className="h-48 rounded border border-slate-800 bg-slate-900 p-4">
        <div className="space-y-4">
            {updates.map((u, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-2 last:border-0">
                    <div>
                        <span className="text-xs font-mono text-blue-400 mr-2">{u.date}</span>
                        <span className="text-sm text-slate-300">{u.desc}</span>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded">{u.ver}</span>
                </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentationUpdatesLog;