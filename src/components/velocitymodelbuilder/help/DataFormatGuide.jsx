import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DataFormatGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white">Supported Data Formats</h2>
        
        <div className="rounded-md border border-slate-800 bg-slate-900 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-300">Data Type</TableHead>
                        <TableHead className="text-slate-300">Formats</TableHead>
                        <TableHead className="text-slate-300">Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-200">Well Logs</TableCell>
                        <TableCell className="text-slate-400">LAS 2.0, LAS 3.0, DLIS, ASCII</TableCell>
                        <TableCell className="text-slate-500">Requires Depth index.</TableCell>
                    </TableRow>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-200">Checkshots / VSP</TableCell>
                        <TableCell className="text-slate-400">CSV, TXT, ASCII</TableCell>
                        <TableCell className="text-slate-500">Columns: MD/TVD, TWT.</TableCell>
                    </TableRow>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-200">Seismic Velocities</TableCell>
                        <TableCell className="text-slate-400">SEG-Y, ZMap Grid, Voxet</TableCell>
                        <TableCell className="text-slate-500">Regular grids only.</TableCell>
                    </TableRow>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-200">Horizons</TableCell>
                        <TableCell className="text-slate-400">ZMap+, CPS-3, Irap, GeoTIFF</TableCell>
                        <TableCell className="text-slate-500">CRS must be defined.</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
  );
};

export default DataFormatGuide;