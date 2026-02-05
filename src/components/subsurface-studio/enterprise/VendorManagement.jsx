import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

const VendorManagement = () => {
    const vendors = [
        { name: 'AWS', service: 'Cloud Infrastructure', risk: 'Low', status: 'Active' },
        { name: 'Schlumberger', service: 'Data Integration', risk: 'Medium', status: 'Active' },
        { name: 'Okta', service: 'Identity Provider', risk: 'Low', status: 'Active' },
    ];

    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><Briefcase className="w-4 h-4 mr-2 text-slate-400"/> Third-Party Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-xs">Vendor</TableHead>
                                <TableHead className="text-xs">Service</TableHead>
                                <TableHead className="text-xs">Risk Level</TableHead>
                                <TableHead className="text-xs">Contract Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendors.map((v) => (
                                <TableRow key={v.name} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-medium text-slate-200 text-xs">{v.name}</TableCell>
                                    <TableCell className="text-slate-400 text-xs">{v.service}</TableCell>
                                    <TableCell className="text-xs">
                                        <Badge variant="outline" className={v.risk === 'Low' ? 'text-green-400 border-green-900' : 'text-yellow-400 border-yellow-900'}>
                                            {v.risk}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-xs">{v.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorManagement;