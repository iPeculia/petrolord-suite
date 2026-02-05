import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Activity, Database, PenTool, Hammer as Drill } from 'lucide-react';

// Mock data for wells - normally this would come from a 'wells' table linked to the project
const MOCK_WELLS = [
    { id: 1, name: 'Appraisal-1', type: 'Vertical', status: 'Completed', depth: '3250m', rig: 'Ocean Apex', progress: 100, tests: 'DST-1, DST-2' },
    { id: 2, name: 'Appraisal-2', type: 'Deviated', status: 'Drilling', depth: '1850m', rig: 'Ocean Apex', progress: 65, tests: 'Pending' },
    { id: 3, name: 'Appraisal-3', type: 'Horizontal', status: 'Planned', depth: '0m', rig: 'Ocean Apex', progress: 0, tests: 'Pending' },
];

export const AppraisalWellManager = ({ projectData }) => {
  return (
    <div className="space-y-6">
        {/* Drilling Status */}
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-sm text-slate-300 flex items-center gap-2"><Drill className="w-4 h-4"/> Well Status & Drilling Tracking</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-800">
                            <TableHead className="text-white">Well Name</TableHead>
                            <TableHead className="text-white">Type</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Current Depth</TableHead>
                            <TableHead className="text-white">Rig</TableHead>
                            <TableHead className="text-white">Progress</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_WELLS.map(well => (
                            <TableRow key={well.id} className="border-b-slate-800">
                                <TableCell className="font-medium text-slate-200">{well.name}</TableCell>
                                <TableCell className="text-slate-400">{well.type}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        well.status === 'Completed' ? 'text-green-400 border-green-500/50' :
                                        well.status === 'Drilling' ? 'text-blue-400 border-blue-500/50 animate-pulse' :
                                        'text-slate-500 border-slate-600'
                                    }>{well.status}</Badge>
                                </TableCell>
                                <TableCell className="font-mono text-slate-300">{well.depth}</TableCell>
                                <TableCell className="text-slate-400">{well.rig}</TableCell>
                                <TableCell>
                                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${well.progress}%` }} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Well Testing & Results */}
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-sm text-slate-300 flex items-center gap-2"><Activity className="w-4 h-4"/> Well Testing & Results</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-800">
                            <TableHead className="text-white">Well</TableHead>
                            <TableHead className="text-white">Tests Planned</TableHead>
                            <TableHead className="text-white">Results Status</TableHead>
                            <TableHead className="text-white">Key Findings</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_WELLS.map(well => (
                            <TableRow key={well.id} className="border-b-slate-800">
                                <TableCell className="font-medium text-slate-200">{well.name}</TableCell>
                                <TableCell className="text-slate-400">{well.tests}</TableCell>
                                <TableCell>
                                    {well.status === 'Completed' ? <span className="text-green-400 text-xs">Analyzed</span> : <span className="text-slate-500 text-xs">Pending</span>}
                                </TableCell>
                                <TableCell className="text-xs text-slate-400 italic">
                                    {well.status === 'Completed' ? 'Permeability higher than exp. No barrier detected.' : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Reservoir Characterization Summary */}
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-sm text-slate-300 flex items-center gap-2"><Database className="w-4 h-4"/> Reservoir Characterization Status</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Static Model</div>
                        <div className="text-lg font-semibold text-white">v2.1 (Updated)</div>
                        <div className="text-xs text-green-400 mt-1">Incorporated Appr-1 logs</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Fluid Analysis</div>
                        <div className="text-lg font-semibold text-white">Ongoing</div>
                        <div className="text-xs text-amber-400 mt-1">PVT samples at lab</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                        <div className="text-xs text-slate-400 mb-1">Dynamic Model</div>
                        <div className="text-lg font-semibold text-white">Pending</div>
                        <div className="text-xs text-slate-500 mt-1">Awaiting DST-2 results</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};