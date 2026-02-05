import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const QCSummary = ({ qcSummary, statistics, onRowClick }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">QC Summary</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-b-white/20 hover:bg-white/10">
              <TableHead className="text-lime-300">Curve</TableHead>
              <TableHead className="text-lime-300">Spikes</TableHead>
              <TableHead className="text-lime-300">Flat Lines</TableHead>
              <TableHead className="text-lime-300">Missing (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qcSummary.map((row) => (
              <TableRow key={row.curve} onClick={() => onRowClick(row.curve)} className="cursor-pointer border-b-white/10 hover:bg-white/10">
                <TableCell>{row.curve}</TableCell>
                <TableCell>{row.spikes}</TableCell>
                <TableCell>{row.flatLines}</TableCell>
                <TableCell>{row.missing.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Data Statistics</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-b-white/20 hover:bg-white/10">
              <TableHead className="text-lime-300">Curve</TableHead>
              <TableHead className="text-lime-300">Min</TableHead>
              <TableHead className="text-lime-300">Max</TableHead>
              <TableHead className="text-lime-300">Mean</TableHead>
              <TableHead className="text-lime-300">Std Dev</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.map((row) => (
              <TableRow key={row.curve} className="border-b-white/10 hover:bg-white/10">
                <TableCell>{row.curve}</TableCell>
                <TableCell>{row.min.toFixed(2)}</TableCell>
                <TableCell>{row.max.toFixed(2)}</TableCell>
                <TableCell>{row.mean.toFixed(2)}</TableCell>
                <TableCell>{row.std.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QCSummary;