import React from 'react';
import { Play, CheckCircle2, AlertTriangle, Clock, RotateCcw, MoreHorizontal, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const jobs = [
    { id: 'JOB-1023', well: 'Well-X01', status: 'completed', accuracy: '94%', time: '2m 14s', model: 'XGBoost v2' },
    { id: 'JOB-1024', well: 'Well-X02', status: 'processing', accuracy: '-', time: '45s', model: 'XGBoost v2' },
    { id: 'JOB-1025', well: 'Well-X03', status: 'queued', accuracy: '-', time: '-', model: 'XGBoost v2' },
];

const BatchClassificationEngine = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 py-4">
                <CardTitle className="flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-400" />
                    Batch Processing Queue
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                        <RotateCcw className="w-4 h-4 mr-2"/> Rerun Failed
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 text-white">
                        <Play className="w-4 h-4 mr-2"/> Run Queue
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-950">
                        <TableRow className="border-slate-800">
                            <TableHead className="w-[100px]">Job ID</TableHead>
                            <TableHead>Well Name</TableHead>
                            <TableHead>Model Config</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map(job => (
                            <TableRow key={job.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-mono text-xs text-slate-500">{job.id}</TableCell>
                                <TableCell className="font-medium text-slate-200">{job.well}</TableCell>
                                <TableCell className="text-xs text-slate-400">{job.model}</TableCell>
                                <TableCell>
                                    {job.status === 'completed' && <Badge variant="outline" className="text-green-400 border-green-900 bg-green-900/10"><CheckCircle2 className="w-3 h-3 mr-1"/> Completed</Badge>}
                                    {job.status === 'processing' && <Badge variant="outline" className="text-blue-400 border-blue-900 bg-blue-900/10"><RotateCcw className="w-3 h-3 mr-1 animate-spin"/> Processing</Badge>}
                                    {job.status === 'queued' && <Badge variant="outline" className="text-slate-400 border-slate-700"><Clock className="w-3 h-3 mr-1"/> Queued</Badge>}
                                </TableCell>
                                <TableCell className="text-slate-400 font-mono text-xs">{job.time}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default BatchClassificationEngine;