import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const WellComparisonMatrix = () => {
  const wells = [
    { name: 'Well-04', v0: 1650, k: 0.45, error: 4.2, status: 'ok' },
    { name: 'Well-09', v0: 1680, k: 0.42, error: 5.1, status: 'ok' },
    { name: 'Well-12', v0: 1850, k: 0.65, error: 12.4, status: 'outlier' },
    { name: 'Well-15', v0: 1665, k: 0.44, error: 3.8, status: 'ok' },
    { name: 'Well-18', v0: 1640, k: 0.46, error: 6.2, status: 'ok' },
  ];

  return (
    <div className="h-full overflow-auto bg-slate-900 rounded-md border border-slate-800">
       <Table>
          <TableHeader>
             <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 w-[100px]">Well Name</TableHead>
                <TableHead className="text-slate-400 text-right">V0 (m/s)</TableHead>
                <TableHead className="text-slate-400 text-right">k (1/s)</TableHead>
                <TableHead className="text-slate-400 text-right">RMS Err (m)</TableHead>
                <TableHead className="text-slate-400 text-center">QC Status</TableHead>
             </TableRow>
          </TableHeader>
          <TableBody>
             {wells.map(well => (
                <TableRow key={well.name} className="border-slate-800 hover:bg-slate-800/50 group">
                   <TableCell className="font-medium text-slate-200">{well.name}</TableCell>
                   <TableCell className="text-right text-slate-300 group-hover:text-white">{well.v0}</TableCell>
                   <TableCell className="text-right text-slate-300 group-hover:text-white">{well.k}</TableCell>
                   <TableCell className={`text-right font-mono ${well.error > 10 ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                      {well.error}
                   </TableCell>
                   <TableCell className="text-center">
                      {well.status === 'outlier' ? (
                        <Badge variant="destructive" className="h-5 text-[10px] flex items-center justify-center w-fit mx-auto gap-1">
                           <AlertTriangle className="w-3 h-3" /> Outlier
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="h-5 text-[10px] bg-emerald-900/20 text-emerald-500 border-emerald-900 w-fit mx-auto">
                           Valid
                        </Badge>
                      )}
                   </TableCell>
                </TableRow>
             ))}
          </TableBody>
       </Table>
    </div>
  );
};

export default WellComparisonMatrix;