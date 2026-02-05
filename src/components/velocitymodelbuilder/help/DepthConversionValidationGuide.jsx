import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DepthConversionValidationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <CheckSquare className="w-6 h-6 text-emerald-400"/> Depth Conversion Validation
      </h2>
      
      <p className="text-slate-400 text-sm">
        Before finalizing a model, validate it against hard data using blind well tests.
      </p>

      <div className="rounded-md border border-slate-800 bg-slate-900">
        <Table>
            <TableHeader className="bg-slate-950">
                <TableRow>
                    <TableHead className="text-slate-300">Validation Metric</TableHead>
                    <TableHead className="text-slate-300">Acceptable Range</TableHead>
                    <TableHead className="text-slate-300">Action if Failed</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Well Mistie Mean</TableCell>
                    <TableCell className="text-slate-400 text-xs">+/- 0.5% of depth</TableCell>
                    <TableCell className="text-red-400 text-xs">Check datum, review outliers</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Blind Well Prediction</TableCell>
                    <TableCell className="text-slate-400 text-xs">+/- 1-2% of depth</TableCell>
                    <TableCell className="text-red-400 text-xs">Adjust regional trend (k)</TableCell>
                </TableRow>
                <TableRow className="border-slate-800">
                    <TableCell className="font-medium text-white">Bullseyes</TableCell>
                    <TableCell className="text-slate-400 text-xs">Zero visual anomalies</TableCell>
                    <TableCell className="text-red-400 text-xs">Increase smoothing radius</TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepthConversionValidationGuide;