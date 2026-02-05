import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';

const CheckshotVSPMastery = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Checkshot & VSP Mastery</h2>
      <p className="text-slate-400">
        Checkshots and VSPs provide the critical "Time-Depth" link to calibrate seismic data to well depth.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-900">
        <Table>
            <TableHeader className="bg-slate-950">
                <TableRow>
                    <TableHead className="text-slate-300">Technique</TableHead>
                    <TableHead className="text-slate-300">Pros</TableHead>
                    <TableHead className="text-slate-300">Cons</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Standard Checkshot</TableCell>
                    <TableCell className="text-emerald-400 text-xs">Cheap, fast, covers full well depth</TableCell>
                    <TableCell className="text-red-400 text-xs">Sparse sampling, low resolution</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Zero-Offset VSP</TableCell>
                    <TableCell className="text-emerald-400 text-xs">High res, corridor stack for tie</TableCell>
                    <TableCell className="text-red-400 text-xs">More expensive, rig time</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Walkaway VSP</TableCell>
                    <TableCell className="text-emerald-400 text-xs">Measures anisotropy (VTI), AVO</TableCell>
                    <TableCell className="text-red-400 text-xs">Complex acquisition & processing</TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </div>

      <div className="bg-slate-900 p-6 rounded border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Common QC Issues</h3>
        <ul className="space-y-3">
            <li className="flex gap-2 items-start text-sm text-slate-400">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span><strong>Cycle Skipping:</strong> Receiver locking onto the wrong peak/trough, causing jagged interval velocities.</span>
            </li>
            <li className="flex gap-2 items-start text-sm text-slate-400">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span><strong>Datum Shifts:</strong> SRD mismatch between seismic processing and well logging (KB vs MSL).</span>
            </li>
            <li className="flex gap-2 items-start text-sm text-slate-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span><strong>Solution:</strong> Always display interval velocity (Vint) derived from checkshots to identify non-physical spikes.</span>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default CheckshotVSPMastery;