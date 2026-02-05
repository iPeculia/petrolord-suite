import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Map, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SurveyDashboard = ({ stats }) => {
  const wells = [
    { name: '15/9-F-12', status: 'Tied', quality: 'Good', corr: 0.85, shift: '-4ms', phase: '0°' },
    { name: '15/9-F-14', status: 'Tied', quality: 'Fair', corr: 0.62, shift: '+12ms', phase: '-10°' },
    { name: '15/9-F-1', status: 'Review', quality: 'Poor', corr: 0.35, shift: '-22ms', phase: '90°' },
    { name: '15/9-F-15', status: 'Pending', quality: '-', corr: '-', shift: '-', phase: '-' },
    { name: '15/9-A-11', status: 'Tied', quality: 'Good', corr: 0.81, shift: '+2ms', phase: '5°' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white">Survey Overview: North Sea Volve</h2>
         <Button variant="outline" className="border-slate-700 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Export Report
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" /> Tie Quality Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 flex items-end justify-around gap-2 px-4 pb-4">
                    <div className="w-full bg-emerald-500/20 border-t-4 border-emerald-500 h-[70%] relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold text-xl">14</div>
                        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-slate-400">Good</span>
                    </div>
                    <div className="w-full bg-amber-500/20 border-t-4 border-amber-500 h-[20%] relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-amber-400 font-bold text-xl">5</div>
                        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-slate-400">Fair</span>
                    </div>
                    <div className="w-full bg-red-500/20 border-t-4 border-red-500 h-[10%] relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-red-400 font-bold text-xl">2</div>
                        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-slate-400">Poor</span>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-purple-400" /> Residual Map Preview
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                 <div className="w-full h-64 bg-slate-950 rounded border border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
                    {/* Simulated wells on map */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 </div>
            </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
            <CardTitle className="text-white">Well Status List</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400">Well Name</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Quality</TableHead>
                        <TableHead className="text-slate-400 text-right">Correlation</TableHead>
                        <TableHead className="text-slate-400 text-right">Bulk Shift</TableHead>
                        <TableHead className="text-slate-400 text-right">Phase</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {wells.map((well) => (
                        <TableRow key={well.name} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="font-medium text-white">{well.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`
                                    ${well.status === 'Tied' ? 'border-emerald-500/50 text-emerald-400' : ''}
                                    ${well.status === 'Review' ? 'border-amber-500/50 text-amber-400' : ''}
                                    ${well.status === 'Pending' ? 'border-slate-600 text-slate-500' : ''}
                                `}>{well.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <span className={`
                                    ${well.quality === 'Good' ? 'text-emerald-400' : ''}
                                    ${well.quality === 'Fair' ? 'text-amber-400' : ''}
                                    ${well.quality === 'Poor' ? 'text-red-400' : 'text-slate-500'}
                                `}>{well.quality}</span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-slate-300">{well.corr}</TableCell>
                            <TableCell className="text-right font-mono text-slate-300">{well.shift}</TableCell>
                            <TableCell className="text-right font-mono text-slate-300">{well.phase}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDashboard;