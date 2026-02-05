import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const DCAFitDiagnostics = () => {
  const { selectedStream, streamState } = useDeclineCurve();
  const results = streamState[selectedStream].fitResults;

  if (!results) return (
    <div className="flex items-center justify-center h-full text-slate-500 text-sm p-8 text-center">
      Run a fit to see diagnostics
    </div>
  );

  const { qi, Di, b, R2, RMSE, quality, modelType } = results;

  const getQualityBadge = (q) => {
    if (q === 'Good') return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Good Fit</Badge>;
    if (q === 'Fair') return <Badge className="bg-yellow-600"><AlertTriangle className="w-3 h-3 mr-1" /> Fair Fit</Badge>;
    return <Badge className="bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Poor Fit</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-200">Fit Results</h3>
        {getQualityBadge(quality)}
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="text-xs text-slate-400 uppercase mb-2">Model Parameters</div>
        <Table>
          <TableBody>
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableCell className="py-2 text-slate-300">Model</TableCell>
              <TableCell className="py-2 font-mono text-right text-blue-400">{modelType}</TableCell>
            </TableRow>
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableCell className="py-2 text-slate-300">qi (rate)</TableCell>
              <TableCell className="py-2 font-mono text-right">{qi.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableCell className="py-2 text-slate-300">Di (annual %)</TableCell>
              <TableCell className="py-2 font-mono text-right">{(Di * 365 * 100).toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableCell className="py-2 text-slate-300">b-factor</TableCell>
              <TableCell className="py-2 font-mono text-right">{b?.toFixed(2) ?? 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="text-xs text-slate-400 uppercase mb-2">Statistics</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500">R² Value</div>
            <div className="text-lg font-mono text-green-400">{R2.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">RMSE</div>
            <div className="text-lg font-mono text-orange-400">{RMSE.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DCAFitDiagnostics;