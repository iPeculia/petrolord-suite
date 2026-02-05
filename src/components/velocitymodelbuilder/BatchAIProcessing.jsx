import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Play, CheckSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const BatchAIProcessing = () => {
  const jobs = [
    { id: 1, well: 'Well-01', task: 'Outlier Removal', status: 'Completed' },
    { id: 2, well: 'Well-02', task: 'Layer Picking', status: 'Processing' },
    { id: 3, well: 'Well-03', task: 'Uncertainty Calc', status: 'Queued' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" /> Batch AI Processor
        </CardTitle>
        <Button size="sm" className="h-7 text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700">
            <Play className="w-3 h-3 mr-2" /> Run Batch
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
            <TableHeader className="bg-slate-950">
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs h-8 text-slate-400 w-8"><CheckSquare className="w-3 h-3" /></TableHead>
                    <TableHead className="text-xs h-8 text-slate-400">Well</TableHead>
                    <TableHead className="text-xs h-8 text-slate-400">Task</TableHead>
                    <TableHead className="text-xs h-8 text-slate-400">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {jobs.map(job => (
                    <TableRow key={job.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="py-2"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" defaultChecked/></TableCell>
                        <TableCell className="py-2 text-xs font-medium text-slate-300">{job.well}</TableCell>
                        <TableCell className="py-2 text-xs text-slate-400">{job.task}</TableCell>
                        <TableCell className="py-2">
                            <Badge variant="outline" className={`text-[9px] border-0 ${
                                job.status === 'Completed' ? 'bg-emerald-900/20 text-emerald-400' :
                                job.status === 'Processing' ? 'bg-blue-900/20 text-blue-400 animate-pulse' :
                                'bg-slate-800 text-slate-500'
                            }`}>
                                {job.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BatchAIProcessing;