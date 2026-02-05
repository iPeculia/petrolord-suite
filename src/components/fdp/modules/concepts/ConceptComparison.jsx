import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateConceptCost } from '@/utils/fdp/conceptCalculations';

const ConceptComparison = ({ concepts }) => {
    if (concepts.length < 2) {
        return (
            <div className="text-center p-8 text-slate-500">
                Add at least two concepts to view comparison.
            </div>
        );
    }

    const comparisonData = concepts.map(c => ({
        ...c,
        costs: calculateConceptCost(c)
    }));

    return (
        <div className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 bg-slate-800/50">
                                <TableHead className="text-slate-300 w-[200px]">Metric</TableHead>
                                {comparisonData.map(c => (
                                    <TableHead key={c.id} className="text-white font-bold text-center">{c.name}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-slate-800">
                                <TableCell className="font-medium text-slate-400">Facility Type</TableCell>
                                {comparisonData.map(c => (
                                    <TableCell key={c.id} className="text-center text-white">{c.facilityType}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow className="border-slate-800">
                                <TableCell className="font-medium text-slate-400">Drive Mechanism</TableCell>
                                {comparisonData.map(c => (
                                    <TableCell key={c.id} className="text-center text-white">{c.driveMechanism}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow className="border-slate-800">
                                <TableCell className="font-medium text-slate-400">Well Count</TableCell>
                                {comparisonData.map(c => (
                                    <TableCell key={c.id} className="text-center text-white">{c.wellCount}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow className="border-slate-800">
                                <TableCell className="font-medium text-slate-400">Peak Production</TableCell>
                                {comparisonData.map(c => (
                                    <TableCell key={c.id} className="text-center text-blue-400">{c.peakProduction} kbpd</TableCell>
                                ))}
                            </TableRow>
                            <TableRow className="border-slate-800 bg-slate-800/30">
                                <TableCell className="font-medium text-slate-400">Total CAPEX ($MM)</TableCell>
                                {comparisonData.map(c => (
                                    <TableCell key={c.id} className="text-center font-mono text-red-400">{c.costs.totalCapex}</TableCell>
                                ))}
                            </TableRow>
                            <TableRow className="border-slate-800">
                                <TableCell className="font-medium text-slate-400">Annual OPEX ($MM)</TableCell>
                                {comparisonData.map(c => (
                                    <TableCell key={c.id} className="text-center font-mono text-orange-400">{c.opex}</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConceptComparison;