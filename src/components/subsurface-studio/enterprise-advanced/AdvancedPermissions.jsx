import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdvancedPermissions = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-400" /> ABAC / RBAC Matrix
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-400">Role</TableHead>
                            <TableHead className="text-center text-slate-400">View Data</TableHead>
                            <TableHead className="text-center text-slate-400">Edit Data</TableHead>
                            <TableHead className="text-center text-slate-400">Delete Data</TableHead>
                            <TableHead className="text-center text-slate-400">Manage Users</TableHead>
                            <TableHead className="text-center text-slate-400">Admin Config</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { role: 'Super Admin', perms: [true, true, true, true, true] },
                            { role: 'Tenant Admin', perms: [true, true, true, true, false] },
                            { role: 'Data Manager', perms: [true, true, true, false, false] },
                            { role: 'Geoscientist', perms: [true, true, false, false, false] },
                            { role: 'Viewer', perms: [true, false, false, false, false] },
                        ].map((r, i) => (
                            <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                <TableCell className="font-medium text-slate-200">{r.role}</TableCell>
                                {r.perms.map((p, j) => (
                                    <TableCell key={j} className="text-center">
                                        {p ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-700 mx-auto" />}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);

export default AdvancedPermissions;