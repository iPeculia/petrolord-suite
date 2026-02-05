import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, EyeOff, Eye } from 'lucide-react';

const DataPreviewPanel = ({ data, curves }) => {
  const [visibleCurves, setVisibleCurves] = useState(curves.slice(0, 8)); // Default first 8

  const downloadCSV = () => {
      // Simple export implementation
      const headers = visibleCurves.join(',');
      const rows = data.map(row => visibleCurves.map(c => row[c]).join(',')).join('\n');
      const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export_preview.csv';
      a.click();
  };

  return (
    <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-100">Data Preview</h3>
            <Button variant="outline" size="sm" onClick={downloadCSV} className="border-slate-700 text-slate-300">
                <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
        </div>

        <div className="flex-1 border border-slate-800 rounded-lg overflow-hidden bg-slate-900 relative">
            <div className="absolute inset-0 overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-slate-950 z-10">
                        <TableRow className="border-slate-800">
                            <TableHead className="w-[80px] text-emerald-500 font-bold border-r border-slate-800 bg-slate-950">Idx</TableHead>
                            {visibleCurves.map(curve => (
                                <TableHead key={curve} className="min-w-[100px] text-slate-300 border-r border-slate-800 font-mono bg-slate-950">
                                    {curve}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.slice(0, 500).map((row, i) => (
                            <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-mono text-xs text-slate-500 border-r border-slate-800 bg-slate-900/50">{i+1}</TableCell>
                                {visibleCurves.map(curve => (
                                    <TableCell key={curve} className="font-mono text-xs text-slate-200 border-r border-slate-800">
                                        {row[curve] !== undefined && row[curve] !== null ? 
                                            (typeof row[curve] === 'number' ? row[curve].toFixed(4) : row[curve]) 
                                            : '-'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 text-right">
            Showing first 500 rows of {data.length}
        </div>
    </div>
  );
};

export default DataPreviewPanel;