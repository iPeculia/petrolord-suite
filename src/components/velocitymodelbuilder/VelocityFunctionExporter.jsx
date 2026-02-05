import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Copy } from 'lucide-react';

const VelocityFunctionExporter = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex-shrink-0">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" /> Velocity Functions (ASCII)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
         <div className="p-4 flex-shrink-0 border-b border-slate-800 bg-slate-950/50">
             <div className="flex gap-2">
                 <Button size="sm" className="h-7 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600">Copy to Clipboard</Button>
                 <Button size="sm" className="h-7 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600">Download .CSV</Button>
             </div>
         </div>
         <div className="flex-1 overflow-auto">
             <Table>
                <TableHeader className="bg-slate-900 sticky top-0 z-10">
                    <TableRow className="border-slate-800 text-xs hover:bg-transparent">
                        <TableHead className="h-8 font-medium text-slate-400">Well Name</TableHead>
                        <TableHead className="h-8 font-medium text-slate-400">Layer</TableHead>
                        <TableHead className="h-8 font-medium text-slate-400 text-right">V0 (m/s)</TableHead>
                        <TableHead className="h-8 font-medium text-slate-400 text-right">k (1/s)</TableHead>
                        <TableHead className="h-8 font-medium text-slate-400 text-right">Top (m)</TableHead>
                        <TableHead className="h-8 font-medium text-slate-400 text-right">Base (m)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({length: 8}).map((_, i) => (
                        <TableRow key={i} className="border-slate-800 text-xs hover:bg-slate-800/50">
                            <TableCell className="font-medium text-slate-300">Well-{String(i+1).padStart(2,'0')}</TableCell>
                            <TableCell className="text-slate-400">Overburden</TableCell>
                            <TableCell className="text-right font-mono text-slate-300">16{50 + i*10}</TableCell>
                            <TableCell className="text-right font-mono text-slate-300">0.4{5 + i%3}</TableCell>
                            <TableCell className="text-right font-mono text-slate-500">0.0</TableCell>
                            <TableCell className="text-right font-mono text-slate-500">1250.0</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
         </div>
      </CardContent>
    </Card>
  );
};

export default VelocityFunctionExporter;