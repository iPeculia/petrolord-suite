import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Minus } from 'lucide-react';

const CrossPlatformTesting = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Cross-Platform Matrix</h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-400">OS / Browser</TableHead>
                            <TableHead className="text-center text-slate-400">Chrome</TableHead>
                            <TableHead className="text-center text-slate-400">Safari</TableHead>
                            <TableHead className="text-center text-slate-400">Firefox</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                            <TableCell className="font-medium text-slate-200">Windows 11</TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                            <TableCell className="text-center"><Minus className="w-4 h-4 text-slate-700 mx-auto"/></TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                        </TableRow>
                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                            <TableCell className="font-medium text-slate-200">macOS 14</TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                        </TableRow>
                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                            <TableCell className="font-medium text-slate-200">iOS 17</TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                            <TableCell className="text-center"><Minus className="w-4 h-4 text-slate-700 mx-auto"/></TableCell>
                        </TableRow>
                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                            <TableCell className="font-medium text-slate-200">Android 14</TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                            <TableCell className="text-center"><Minus className="w-4 h-4 text-slate-700 mx-auto"/></TableCell>
                            <TableCell className="text-center"><CheckCircle2 className="w-4 h-4 text-green-500 mx-auto"/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);

export default CrossPlatformTesting;