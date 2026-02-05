import React from 'react';
import { Server, CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const BackgroundJobQueue = () => {
  const jobs = [
    { id: 1, name: 'Batch Horizon Conversion (8 Grids)', status: 'running', progress: 65, time: '2m remaining' },
    { id: 2, name: 'Seismic Volume Velocity Insert', status: 'queued', progress: 0, time: 'Pending' },
    { id: 3, name: 'Well Top QC Report', status: 'completed', progress: 100, time: 'Finished 10m ago' },
    { id: 4, name: 'P10/P50/P90 Simulation', status: 'failed', progress: 45, time: 'Error: Memory Limit' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-400"/> Job Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 overflow-y-auto">
        {jobs.map(job => (
            <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{job.name}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {job.time}
                        </span>
                    </div>
                    <div className="flex items-center">
                        {job.status === 'running' && <Badge className="bg-blue-900/50 text-blue-400 border-blue-800 hover:bg-blue-900"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Running</Badge>}
                        {job.status === 'queued' && <Badge variant="outline" className="text-slate-400 border-slate-700">Queued</Badge>}
                        {job.status === 'completed' && <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-800 hover:bg-emerald-900"><CheckCircle2 className="w-3 h-3 mr-1"/> Done</Badge>}
                        {job.status === 'failed' && <Badge className="bg-red-900/50 text-red-400 border-red-800 hover:bg-red-900"><XCircle className="w-3 h-3 mr-1"/> Failed</Badge>}
                    </div>
                </div>
                {job.status === 'running' && (
                    <Progress value={job.progress} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
                )}
                {job.status === 'failed' && (
                    <Progress value={job.progress} className="h-1.5 bg-slate-800" indicatorClassName="bg-red-500" />
                )}
            </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BackgroundJobQueue;