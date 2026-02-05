import React from 'react';
import { Edit3, Undo2, Save, History, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const ManualEditingLayer = () => {
    return (
        <div className="space-y-4 h-full flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-400"/> Interpreter Overrides
                </h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8"><History className="w-3 h-3 mr-2"/> History</Button>
                    <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-500 h-8"><Save className="w-3 h-3 mr-2"/> Apply & Retrain</Button>
                </div>
            </div>
            
            <ScrollArea className="flex-1">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="w-[100px]">Top</TableHead>
                            <TableHead className="w-[100px]">Base</TableHead>
                            <TableHead>Original</TableHead>
                            <TableHead>Override</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-800">
                            <TableCell className="font-mono text-xs">1250.0</TableCell>
                            <TableCell className="font-mono text-xs">1255.0</TableCell>
                            <TableCell><span className="text-xs text-slate-400">Shale (88%)</span></TableCell>
                            <TableCell>
                                <Select defaultValue="sand">
                                    <SelectTrigger className="h-7 w-32 bg-slate-950 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sand">Sandstone</SelectItem>
                                        <SelectItem value="lime">Limestone</SelectItem>
                                        <SelectItem value="dolo">Dolomite</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-white"><RotateCcw className="w-3 h-3" /></Button>
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-800">
                            <TableCell className="font-mono text-xs">1420.0</TableCell>
                            <TableCell className="font-mono text-xs">1422.5</TableCell>
                            <TableCell><span className="text-xs text-slate-400">Coal (65%)</span></TableCell>
                            <TableCell>
                                <Select defaultValue="shale">
                                    <SelectTrigger className="h-7 w-32 bg-slate-950 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sand">Sandstone</SelectItem>
                                        <SelectItem value="shale">Shale</SelectItem>
                                        <SelectItem value="bad">Bad Hole</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-white"><RotateCcw className="w-3 h-3" /></Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="p-8 text-center border-t border-dashed border-slate-800">
                    <p className="text-sm text-slate-500 italic">
                        Select an interval on the log track to add a new override.
                    </p>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ManualEditingLayer;