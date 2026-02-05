import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportScenarioComparison } from '@/utils/declineCurve/dcaExport';

const DCAScenarioComparison = () => {
  const { scenarios, selectedScenarios, selectedStream, currentWell } = useDeclineCurve();
  
  const relevantScenarios = scenarios.filter(s => selectedScenarios.includes(s.id) && s.stream === selectedStream);

  if (relevantScenarios.length === 0) {
    return <div className="text-center text-slate-500 text-sm py-8">Select scenarios to compare</div>;
  }

  const handleExport = () => {
    exportScenarioComparison(relevantScenarios, currentWell?.name || 'Well');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-200">Scenario Comparison</h3>
        <Button variant="ghost" size="sm" onClick={handleExport} className="h-6 text-xs gap-1">
          <Download size={12} /> Export
        </Button>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="border-slate-700 hover:bg-slate-800">
              <TableHead className="text-xs text-slate-400 h-8">Scenario</TableHead>
              <TableHead className="text-xs text-slate-400 h-8 text-right">Qi</TableHead>
              <TableHead className="text-xs text-slate-400 h-8 text-right">Di (%)</TableHead>
              <TableHead className="text-xs text-slate-400 h-8 text-right">b</TableHead>
              <TableHead className="text-xs text-slate-400 h-8 text-right">EUR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relevantScenarios.map(s => (
              <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="py-2 text-xs font-medium text-slate-200">{s.name}</TableCell>
                <TableCell className="py-2 text-xs text-right text-slate-400">{s.fitResults.qi.toFixed(1)}</TableCell>
                <TableCell className="py-2 text-xs text-right text-slate-400">{(s.fitResults.Di * 365 * 100).toFixed(1)}</TableCell>
                <TableCell className="py-2 text-xs text-right text-slate-400">{s.fitResults.b.toFixed(2)}</TableCell>
                <TableCell className="py-2 text-xs text-right font-mono text-emerald-400">{s.forecastResults.eur.toLocaleString(undefined, {maximumFractionDigits:0})}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DCAScenarioComparison;