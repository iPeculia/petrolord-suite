import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Filter, Microscope } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AutomatedOutlierDetectionCorrection = () => {
  const outliers = [
    { id: 1, well: 'Well-04', depth: 1450, value: 3200, expected: 2800, deviation: '+14%', status: 'flagged' },
    { id: 2, well: 'Well-07', depth: 2100, value: 1800, expected: 3100, deviation: '-42%', status: 'flagged' },
    { id: 3, well: 'Well-02', depth: 950, value: 1500, expected: 1950, deviation: '-23%', status: 'corrected' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Microscope className="w-4 h-4 text-orange-400" /> Smart Outlier Detection
        </CardTitle>
        <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">
            <Filter className="w-3 h-3 mr-2" /> Scan All
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="bg-slate-950 rounded-lg border border-slate-800 h-32 flex items-center justify-center relative overflow-hidden">
            {/* Mock Chart Visualization */}
            <div className="absolute inset-0 flex items-end px-4 pb-4 gap-1">
                {Array.from({length: 20}).map((_, i) => {
                    const isOutlier = i === 5 || i === 14;
                    const height = isOutlier ? '80%' : `${30 + Math.random() * 40}%`;
                    return (
                        <div 
                            key={i} 
                            className={`w-full rounded-t ${isOutlier ? 'bg-red-500/80' : 'bg-blue-500/30'}`}
                            style={{ height }}
                        ></div>
                    )
                })}
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2 text-[10px] bg-slate-900/80 p-1 rounded border border-slate-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-slate-400">Detected Outliers (Z-Score &gt; 2.5)</span>
            </div>
        </div>

        <Table>
            <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs h-7 text-slate-400">Well</TableHead>
                    <TableHead className="text-xs h-7 text-slate-400">Depth</TableHead>
                    <TableHead className="text-xs h-7 text-slate-400 text-right">Value</TableHead>
                    <TableHead className="text-xs h-7 text-slate-400 text-right">Dev</TableHead>
                    <TableHead className="text-xs h-7 text-slate-400 text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {outliers.map(item => (
                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="py-2 text-xs font-medium text-slate-300">{item.well}</TableCell>
                        <TableCell className="py-2 text-xs text-slate-500">{item.depth}m</TableCell>
                        <TableCell className="py-2 text-xs text-slate-300 font-mono text-right">{item.value}</TableCell>
                        <TableCell className={`py-2 text-xs font-mono text-right ${item.status === 'corrected' ? 'text-emerald-500' : 'text-red-400'}`}>{item.deviation}</TableCell>
                        <TableCell className="py-2 text-right">
                            {item.status === 'corrected' ? (
                                <span className="text-[10px] text-emerald-500 flex items-center justify-end"><CheckCircle2 className="w-3 h-3 mr-1"/> Fixed</span>
                            ) : (
                                <Button size="sm" variant="ghost" className="h-6 text-[10px] text-orange-400 hover:text-orange-300 hover:bg-orange-900/20">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Review
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AutomatedOutlierDetectionCorrection;