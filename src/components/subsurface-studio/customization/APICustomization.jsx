import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Webhook, Key, RefreshCw } from 'lucide-react';

const APICustomization = () => {
    const endpoints = [
        { path: '/api/v1/custom/well-headers', method: 'GET', status: 'Active', calls: '1.2k/day' },
        { path: '/api/v1/custom/production-summary', method: 'POST', status: 'Active', calls: '540/day' },
        { path: '/api/v1/hooks/seismic-upload', method: 'WEBHOOK', status: 'Inactive', calls: '0/day' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Webhook className="w-5 h-5 mr-2 text-yellow-400" /> API Manager
                </h3>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-xs text-white">
                    <Key className="w-4 h-4 mr-2" /> Generate Key
                </Button>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Custom Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-xs">Method</TableHead>
                                <TableHead className="text-xs">Endpoint Path</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                                <TableHead className="text-xs text-right">Usage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {endpoints.map((ep, i) => (
                                <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell>
                                        <Badge variant="secondary" className="text-[10px] font-mono">{ep.method}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-slate-300">{ep.path}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs ${ep.status === 'Active' ? 'text-green-400' : 'text-slate-500'}`}>
                                            {ep.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-slate-500">{ep.calls}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default APICustomization;