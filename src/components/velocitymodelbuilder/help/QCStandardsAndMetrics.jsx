import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const QCStandardsAndMetrics = () => {
  const metrics = [
    { name: "Mistie Mean", target: "0 m", desc: "Average difference between well marker and depth surface" },
    { name: "Mistie Std Dev", target: "< 1% of depth", desc: "Spread of errors; lower implies better local fit" },
    { name: "Null Cells", target: "0%", desc: "Percentage of grid cells with undefined velocity" },
    { name: "Bullseyes", target: "0", desc: "Count of artificial high-gradient anomalies around wells" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white">QC Standards & Metrics</h2>
      <div className="rounded-md border border-slate-800 bg-slate-900">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-300">Metric</TableHead>
              <TableHead className="text-slate-300">Target Value</TableHead>
              <TableHead className="text-slate-300">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m, i) => (
              <TableRow key={i} className="border-slate-800">
                <TableCell className="font-medium text-slate-200">{m.name}</TableCell>
                <TableCell className="text-emerald-400">{m.target}</TableCell>
                <TableCell className="text-slate-400 text-sm">{m.desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QCStandardsAndMetrics;