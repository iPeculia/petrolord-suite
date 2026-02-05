import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Download, RefreshCw, Clock, Archive } from 'lucide-react';

const BackupAndRecoveryPanel = () => {
    const backups = [
        { id: 'bk_20231125_01', date: 'Nov 25, 2023 02:00 AM', size: '1.2 GB', type: 'Automated', status: 'Completed' },
        { id: 'bk_20231124_01', date: 'Nov 24, 2023 02:00 AM', size: '1.1 GB', type: 'Automated', status: 'Completed' },
        { id: 'bk_20231123_man', date: 'Nov 23, 2023 04:15 PM', size: '1.1 GB', type: 'Manual', status: 'Completed' },
        { id: 'bk_20231123_01', date: 'Nov 23, 2023 02:00 AM', size: '1.0 GB', type: 'Automated', status: 'Completed' },
    ];

    return (
        <div className="h-full p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Archive className="w-6 h-6 mr-2 text-purple-400" /> Backup & Recovery
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage database snapshots and disaster recovery.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        <Clock className="w-4 h-4 mr-2" /> Schedule
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Database className="w-4 h-4 mr-2" /> Create Backup
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase font-bold">Last Successful Backup</div>
                        <div className="text-lg font-bold text-white mt-1">2 hours ago</div>
                        <div className="text-xs text-green-400 mt-1 flex items-center"><RefreshCw className="w-3 h-3 mr-1" /> Synced to S3</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase font-bold">Total Backup Size</div>
                        <div className="text-lg font-bold text-white mt-1">45.2 GB</div>
                        <div className="text-xs text-slate-400 mt-1">Retention: 30 days</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase font-bold">Recovery Time Objective</div>
                        <div className="text-lg font-bold text-white mt-1">~15 mins</div>
                        <div className="text-xs text-slate-400 mt-1">Estimated restore time</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-300">Backup History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Backup ID</TableHead>
                                <TableHead className="text-slate-400">Date & Time</TableHead>
                                <TableHead className="text-slate-400">Size</TableHead>
                                <TableHead className="text-slate-400">Type</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {backups.map((backup) => (
                                <TableRow key={backup.id} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-mono text-xs text-slate-300">{backup.id}</TableCell>
                                    <TableCell className="text-slate-300">{backup.date}</TableCell>
                                    <TableCell className="text-slate-300">{backup.size}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            backup.type === 'Automated' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
                                        }`}>
                                            {backup.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-green-400 text-xs flex items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                            {backup.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default BackupAndRecoveryPanel;