import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PressureGradientSummary = ({ summaryData }) => {
  // summaryData: [{ interval: '0-1000', formation: 'Seabed', pp_ppg: 8.6, fg_ppg: 12.0, risk: 'Low' }]

  return (
    <Card className="h-full overflow-hidden bg-white shadow-sm border-slate-200">
        <CardHeader className="py-4 px-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-800">Pressure Gradient Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto h-[calc(100%-4rem)]">
            <Table>
                <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[150px]">Depth Interval (ft)</TableHead>
                        <TableHead>Formation</TableHead>
                        <TableHead className="text-right text-blue-600">PP (ppg)</TableHead>
                        <TableHead className="text-right text-red-600">FG (ppg)</TableHead>
                        <TableHead className="text-right">Safe MW (ppg)</TableHead>
                        <TableHead className="text-right">Casing Depth</TableHead>
                        <TableHead className="w-[100px]">Risk</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {summaryData.map((row, i) => (
                        <TableRow key={i} className="hover:bg-slate-50">
                            <TableCell className="font-medium font-mono text-xs">{row.interval}</TableCell>
                            <TableCell className="font-medium">{row.formation}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{row.pp_ppg}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{row.fg_ppg}</TableCell>
                            <TableCell className="text-right font-mono text-xs bg-emerald-50/50 text-emerald-700 font-bold">{row.safe_mw}</TableCell>
                            <TableCell className="text-right text-xs text-slate-500">{row.casing}</TableCell>
                            <TableCell>
                                <Badge variant={row.risk === 'High' ? 'destructive' : row.risk === 'Medium' ? 'secondary' : 'outline'} className={row.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}>
                                    {row.risk}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
};

export default PressureGradientSummary;