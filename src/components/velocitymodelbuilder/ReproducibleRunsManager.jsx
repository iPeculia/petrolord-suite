import React from 'react';
import { PlayCircle, FileJson, RotateCcw, Save, ClipboardCheck, GitCommit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ReproducibleRunsManager = () => {
  const runs = [
    { id: 'run_004', date: '2024-03-15 14:30', hash: 'a1b2c3d', config: 'Config_v2.json', layers: 5, status: 'success', duration: '45s' },
    { id: 'run_003', date: '2024-03-15 11:15', hash: 'e5f6g7h', config: 'Config_v1_mod.json', layers: 4, status: 'success', duration: '32s' },
    { id: 'run_002', date: '2024-03-14 16:20', hash: 'i8j9k0l', config: 'Config_v1.json', layers: 4, status: 'failed', duration: '12s' },
    { id: 'run_001', date: '2024-03-14 09:00', hash: 'm1n2o3p', config: 'Initial_Params.json', layers: 3, status: 'success', duration: '28s' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-400"/> Reproducible Run History
        </CardTitle>
        <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700">
            <Save className="w-3 h-3 mr-2" /> Save Run Snapshot
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
        <Table>
            <TableHeader className="bg-slate-950 sticky top-0">
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs h-8 w-24">Run ID</TableHead>
                    <TableHead className="text-xs h-8">Snapshot Hash</TableHead>
                    <TableHead className="text-xs h-8">Configuration</TableHead>
                    <TableHead className="text-xs h-8">Status</TableHead>
                    <TableHead className="text-xs h-8 text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {runs.map(run => (
                    <TableRow key={run.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="py-2 font-mono text-xs text-slate-300">{run.id}</TableCell>
                        <TableCell className="py-2">
                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                                <GitCommit className="w-3 h-3"/> {run.hash}
                            </div>
                        </TableCell>
                        <TableCell className="py-2">
                            <div className="flex items-center gap-1 text-xs text-blue-400 hover:underline cursor-pointer">
                                <FileJson className="w-3 h-3"/> {run.config}
                            </div>
                        </TableCell>
                        <TableCell className="py-2">
                            <Badge variant="outline" className={`text-[10px] h-5 ${run.status === 'success' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' : 'text-red-400 border-red-900 bg-red-900/20'}`}>
                                {run.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" title="View Report">
                                    <ClipboardCheck className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 text-xs hover:text-emerald-400" title="Re-run exactly">
                                    <PlayCircle className="w-3 h-3 mr-1" /> Re-run
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReproducibleRunsManager;