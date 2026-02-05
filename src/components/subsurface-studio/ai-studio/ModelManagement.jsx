import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, GitBranch } from 'lucide-react';

const ModelManagement = () => {
    const models = [
        { name: 'SeismicNet', version: 'v2.3.1', type: 'Computer Vision', status: 'Production', updated: '2h ago' },
        { name: 'WellLogLSTM', version: 'v1.0.5', type: 'Time Series', status: 'Staging', updated: '1d ago' },
        { name: 'FaciesXGB', version: 'v0.9.2', type: 'Classification', status: 'Archived', updated: '2w ago' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <GitBranch className="w-5 h-5 mr-2 text-slate-400" /> Model Registry
            </h3>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Model Name</TableHead>
                                <TableHead className="text-slate-400">Version</TableHead>
                                <TableHead className="text-slate-400">Type</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {models.map((m, i) => (
                                <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-medium text-slate-200">{m.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-400">{m.version}</TableCell>
                                    <TableCell className="text-slate-400">{m.type}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[10px] ${
                                            m.status === 'Production' ? 'text-green-400 border-green-900 bg-green-900/10' : 
                                            m.status === 'Staging' ? 'text-blue-400 border-blue-900 bg-blue-900/10' : 
                                            'text-slate-500 border-slate-800'
                                        }`}>{m.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <MoreHorizontal className="w-4 h-4 text-slate-500 inline cursor-pointer hover:text-white" />
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

export default ModelManagement;