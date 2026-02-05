import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { Pencil, Maximize2, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfilePlot from '../charts/ProfilePlot';

const WellEnvironmentTab = () => {
    const { wellTrajectory, ppfgProfile, tempProfile, selectedWell } = useCasingTubingDesign();

    if (!selectedWell) return <div className="p-8 text-slate-400 text-center border-2 border-dashed border-slate-800 rounded-xl m-4">Please select a well to view environment data.</div>;

    return (
        <div className="grid grid-cols-12 gap-4 h-full p-1 overflow-hidden">
            
            {/* Left Column: Trajectory & Stats (4 cols) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4 h-full overflow-y-auto pr-2 custom-scrollbar">
                {/* Trajectory Card */}
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between bg-slate-950/30">
                        <CardTitle className="text-sm font-semibold text-slate-200">Well Trajectory</CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="w-3 h-3 text-slate-400" /></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 grid grid-cols-2 gap-3 mb-2">
                            <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Max Depth</span>
                                <div className="text-lg font-mono text-white leading-none mt-1">
                                    {wellTrajectory.length > 0 ? Math.max(...wellTrajectory.map(p => p.md)).toFixed(0) : 0} <span className="text-xs text-slate-600">ft</span>
                                </div>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Max Inc</span>
                                <div className="text-lg font-mono text-white leading-none mt-1">
                                    {wellTrajectory.length > 0 ? Math.max(...wellTrajectory.map(p => p.inc)).toFixed(1) : 0}<span className="text-xs text-slate-600">°</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-48 border-t border-slate-800">
                            <ScrollArea className="h-full w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800 hover:bg-transparent h-8">
                                            <TableHead className="text-[10px] h-8 text-slate-500">MD (ft)</TableHead>
                                            <TableHead className="text-[10px] h-8 text-slate-500">TVD (ft)</TableHead>
                                            <TableHead className="text-[10px] h-8 text-slate-500">Inc (°)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {wellTrajectory.map((pt, i) => (
                                            <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50 h-7">
                                                <TableCell className="text-[10px] font-mono py-1">{pt.md}</TableCell>
                                                <TableCell className="text-[10px] font-mono py-1">{pt.tvd}</TableCell>
                                                <TableCell className="text-[10px] font-mono py-1">{pt.inc}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>

                {/* Temperature Card */}
                <Card className="bg-slate-900 border-slate-800 shadow-sm flex-1">
                    <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between bg-slate-950/30">
                        <CardTitle className="text-sm font-semibold text-slate-200">Temperature Profile</CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Maximize2 className="w-3 h-3 text-slate-400" /></Button>
                    </CardHeader>
                    <CardContent className="p-4 h-64">
                        <ProfilePlot 
                            data={tempProfile}
                            lines={[{ dataKey: 'temp', name: 'Static Temp', color: '#f97316' }]}
                            xLabel="Temperature (°F)"
                            yLabel="Depth (ft)"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: PPFG & Plots (8 cols) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
                <Card className="bg-slate-900 border-slate-800 shadow-sm flex-1 flex flex-col">
                    <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between bg-slate-950/30 shrink-0">
                        <div className="flex items-center space-x-4">
                            <CardTitle className="text-sm font-semibold text-slate-200">Pore Pressure & Fracture Gradient</CardTitle>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Source: PPFG App</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-lime-400 hover:text-lime-300 hover:bg-slate-800">
                                <RefreshCw className="w-3 h-3 mr-1" /> Sync
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs bg-slate-800 border-slate-700 hover:text-white">Edit Data</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 min-h-0 flex flex-col">
                        <div className="flex-1 w-full bg-slate-950/50 rounded-lg border border-slate-800 p-2">
                            <ProfilePlot 
                                data={ppfgProfile}
                                lines={[
                                    { dataKey: 'pp', name: 'Pore Pressure', color: '#fbbf24' },
                                    { dataKey: 'fg', name: 'Frac Gradient', color: '#ef4444' }
                                ]}
                                xLabel="Pressure Gradient (ppg)"
                                yLabel="TVD (ft)"
                            />
                        </div>
                        <div className="h-32 mt-4 border-t border-slate-800 pt-4">
                            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Key Data Points</h4>
                            <ScrollArea className="h-full w-full border border-slate-800 rounded bg-slate-950/30">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800 hover:bg-transparent h-7 bg-slate-900">
                                            <TableHead className="text-[10px] h-7 text-slate-500 pl-4">TVD (ft)</TableHead>
                                            <TableHead className="text-[10px] h-7 text-slate-500">Pore Pressure (ppg)</TableHead>
                                            <TableHead className="text-[10px] h-7 text-slate-500">Frac Gradient (ppg)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ppfgProfile.map((pt, i) => (
                                            <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50 h-7">
                                                <TableCell className="text-[10px] font-mono py-1 pl-4">{pt.tvd}</TableCell>
                                                <TableCell className="text-[10px] font-mono py-1 text-amber-400">{pt.pp}</TableCell>
                                                <TableCell className="text-[10px] font-mono py-1 text-red-400">{pt.fg}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WellEnvironmentTab;