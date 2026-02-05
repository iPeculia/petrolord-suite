import React from 'react';
import { FileOutput } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ExportFormatDetailsGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <FileOutput className="w-6 h-6 text-orange-400"/> Export Format Specifications
      </h2>
      <div className="rounded-md border border-slate-800 bg-slate-900">
        <Table>
            <TableHeader className="bg-slate-950">
                <TableRow>
                    <TableHead className="text-slate-300">Format</TableHead>
                    <TableHead className="text-slate-300">Extension</TableHead>
                    <TableHead className="text-slate-300">Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">ZMap+</TableCell>
                    <TableCell className="text-slate-400 text-xs">.dat, .grid</TableCell>
                    <TableCell className="text-slate-400 text-xs">Standard fixed-width ASCII grid. Most compatible.</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Petrel Binary</TableCell>
                    <TableCell className="text-slate-400 text-xs">.in</TableCell>
                    <TableCell className="text-slate-400 text-xs">Proprietary binary. Fast loading for large cubes.</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">SEGY</TableCell>
                    <TableCell className="text-slate-400 text-xs">.sgy, .segy</TableCell>
                    <TableCell className="text-slate-400 text-xs">Standard seismic format. Used for velocity cubes.</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Eclipse/CMG</TableCell>
                    <TableCell className="text-slate-400 text-xs">.grdecl</TableCell>
                    <TableCell className="text-slate-400 text-xs">Corner-point geometry for reservoir simulation.</TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExportFormatDetailsGuide;