import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck } from 'lucide-react';

const RoleBasedAccessControl = () => {
    const roles = [
        { name: 'Super Admin', users: 2, perms: ['all'] },
        { name: 'Project Manager', users: 5, perms: ['read', 'write', 'delete', 'invite'] },
        { name: 'Geoscientist', users: 12, perms: ['read', 'write', 'interpret'] },
        { name: 'Viewer', users: 8, perms: ['read'] },
    ];

    const permissions = ['read', 'write', 'delete', 'interpret', 'export', 'admin'];

    return (
        <div className="space-y-4 h-full overflow-y-auto p-1">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-purple-400" /> Access Control Matrix
                </h3>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Create Role</Button>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-300">Role</TableHead>
                            {permissions.map(p => (
                                <TableHead key={p} className="text-center text-xs uppercase text-slate-500">{p}</TableHead>
                            ))}
                            <TableHead className="text-right text-slate-300">Users</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.name} className="border-slate-800 hover:bg-slate-900/50">
                                <TableCell className="font-medium text-slate-200">
                                    {role.name}
                                    {role.name === 'Super Admin' && <span className="ml-2 text-[10px] text-yellow-500">(System)</span>}
                                </TableCell>
                                {permissions.map(p => (
                                    <TableCell key={p} className="text-center">
                                        <Checkbox 
                                            checked={role.perms.includes('all') || role.perms.includes(p)} 
                                            disabled={role.name === 'Super Admin'}
                                            className="border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                        />
                                    </TableCell>
                                ))}
                                <TableCell className="text-right text-slate-400 flex justify-end items-center gap-2">
                                    <Users className="w-3 h-3" /> {role.users}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default RoleBasedAccessControl;