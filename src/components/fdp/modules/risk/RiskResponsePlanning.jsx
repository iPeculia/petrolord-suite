import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const RiskResponsePlanning = ({ risks }) => {
    // Filter for high/critical risks that need active mitigation planning
    const criticalRisks = risks
        .filter(r => (r.probability * r.impact) >= 10)
        .sort((a,b) => (b.probability * b.impact) - (a.probability * a.impact));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Response Planning for Critical Risks</h3>
                <div className="text-sm text-slate-400">
                    Showing {criticalRisks.length} high-priority items
                </div>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-800/50">
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-300 w-[20%]">Risk Scenario</TableHead>
                                <TableHead className="text-slate-300 w-[10%]">Strategy</TableHead>
                                <TableHead className="text-slate-300 w-[30%]">Mitigation Plan (Preventative)</TableHead>
                                <TableHead className="text-slate-300 w-[30%]">Contingency Plan (Reactive)</TableHead>
                                <TableHead className="text-slate-300 w-[10%]">Owner</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {criticalRisks.map((risk) => (
                                <TableRow key={risk.id} className="border-slate-800 hover:bg-slate-800/30">
                                    <TableCell className="font-medium text-white align-top">
                                        <div>{risk.name}</div>
                                        <Badge variant="outline" className="mt-1 text-[10px] border-red-900 text-red-400 bg-red-900/10">
                                            Score: {risk.probability * risk.impact}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="align-top">
                                        <Badge variant="secondary" className="bg-slate-800 text-slate-300">Mitigate</Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm align-top">
                                        {risk.mitigationStrategy || <span className="text-slate-600 italic">No preventative actions defined</span>}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm align-top">
                                        {risk.contingencyPlan || <span className="text-slate-600 italic">No contingency plan defined</span>}
                                    </TableCell>
                                    <TableCell className="text-slate-300 text-sm align-top">
                                        {risk.owner}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {criticalRisks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                                        No critical risks identified requiring detailed response planning.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RiskResponsePlanning;