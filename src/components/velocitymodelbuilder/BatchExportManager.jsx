import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Clock, CheckCircle2, Loader2 } from 'lucide-react';

const BatchExportManager = () => {
  const jobs = [
    { id: 1, name: 'Field-Wide Grid Export', formats: ['ZMap', 'Rescue'], status: 'Running', progress: 45 },
    { id: 2, name: 'Petrel Velocity Sync', formats: ['ASCII'], status: 'Completed', progress: 100 },
    { id: 3, name: 'Simulation Deck Gen', formats: ['Eclipse'], status: 'Pending', progress: 0 },
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Batch Queue
            </h3>
            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">
                <Play className="w-3 h-3 mr-2" /> Run All
            </Button>
        </div>

        <Card className="bg-slate-900 border-slate-800 flex-1">
            <CardContent className="p-0 h-full">
                <ScrollArea className="h-full max-h-[300px]">
                    <div className="divide-y divide-slate-800">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-3 hover:bg-slate-800/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-200">{job.name}</h4>
                                        <div className="flex gap-1 mt-1">
                                            {job.formats.map(f => (
                                                <Badge key={f} variant="secondary" className="text-[9px] h-4 px-1 bg-slate-800 text-slate-400">{f}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] border-0 ${
                                        job.status === 'Running' ? 'bg-blue-900/20 text-blue-400' :
                                        job.status === 'Completed' ? 'bg-emerald-900/20 text-emerald-400' :
                                        'bg-slate-800 text-slate-500'
                                    }`}>
                                        {job.status === 'Running' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                        {job.status === 'Completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                        {job.status}
                                    </Badge>
                                </div>
                                {job.status === 'Running' && (
                                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${job.progress}%` }}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
};

export default BatchExportManager;