import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const DataQC = ({ logs }) => {
    const curves = logs?.curves || [];
    const stats = logs?.stats || {};

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Log Statistics</CardTitle>
                        <CardDescription className="text-slate-400">Overview of loaded curve data ranges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-transparent">
                                        <TableHead className="text-slate-300">Mnemonic</TableHead>
                                        <TableHead className="text-slate-300 text-right">Min</TableHead>
                                        <TableHead className="text-slate-300 text-right">Max</TableHead>
                                        <TableHead className="text-slate-300 text-right">Mean</TableHead>
                                        <TableHead className="text-slate-300 text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {curves.map((curve, i) => (
                                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell className="font-mono text-slate-200">{curve}</TableCell>
                                            <TableCell className="text-right font-mono text-slate-400">
                                                {stats[curve]?.min?.toFixed(2) ?? '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-slate-400">
                                                {stats[curve]?.max?.toFixed(2) ?? '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-slate-400">
                                                {stats[curve]?.mean?.toFixed(2) ?? '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {stats[curve]?.mean ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-yellow-500 mx-auto" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {curves.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-slate-500 py-4">
                                                No log data available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Common Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-slate-700">
                                    <AccordionTrigger className="text-slate-200 text-sm">Dealing with Noise</AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs space-y-2">
                                        <p><strong>High Noise:</strong> Apply a median filter (smoothing) if spikes are observed in sonic or density logs.</p>
                                        <p><strong>Misclassification:</strong> Check for bad hole conditions (caliper &gt; bit size) or barite mud affecting PEF.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="border-slate-700">
                                    <AccordionTrigger className="text-slate-200 text-sm">Missing Data</AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs">
                                        <p>If sections of the log are null (NaN), simple linear interpolation will be applied during calculation. For large gaps, consider merging runs.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3" className="border-slate-700">
                                    <AccordionTrigger className="text-slate-200 text-sm">Depth Matching</AccordionTrigger>
                                    <AccordionContent className="text-slate-400 text-xs">
                                        <p>Ensure density and sonic logs are on depth. Check for depth shifts if correlation features do not align.</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Spike Detection</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div>
                                 <h4 className="font-bold text-slate-200 text-sm">Spike Detection Rules</h4>
                                 <p className="text-slate-400 text-xs mt-2">
                                     Identify spikes where value &gt; threshold (e.g. 5 std dev).
                                 </p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DataQC;