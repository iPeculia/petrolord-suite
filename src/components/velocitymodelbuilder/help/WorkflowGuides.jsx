import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileText } from 'lucide-react';

const WorkflowGuides = () => {
  const workflows = [
    { title: "Create Your First Velocity Model", time: "5 min", level: "Beginner" },
    { title: "Import & QC Well Checkshots", time: "3 min", level: "Beginner" },
    { title: "Perform Time-Depth Conversion", time: "4 min", level: "Intermediate" },
    { title: "Calibrate V0/k Parameters to Tops", time: "8 min", level: "Advanced" },
    { title: "Export Model to Petrel/Kingdom", time: "2 min", level: "Intermediate" },
    { title: "Run Monte Carlo Uncertainty Analysis", time: "10 min", level: "Advanced" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">Step-by-Step Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((wf, i) => (
                <Card key={i} className="bg-slate-900 border-slate-800 group cursor-pointer hover:border-blue-500/50 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-950 rounded-md border border-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white">{wf.title}</h4>
                                <div className="flex gap-2 mt-1 text-[10px] text-slate-500">
                                    <span>{wf.time} read</span>
                                    <span>•</span>
                                    <span className={wf.level === 'Advanced' ? 'text-orange-400' : wf.level === 'Intermediate' ? 'text-blue-400' : 'text-emerald-400'}>{wf.level}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-600 group-hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default WorkflowGuides;