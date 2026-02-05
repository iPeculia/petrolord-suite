import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, MoreHorizontal, Shield } from 'lucide-react';

const UserManagementPanel = () => {
    // Mock data for UI demonstration
    const users = [
        { id: 1, name: 'Alice Johnson', email: 'alice@petrolord.com', role: 'Admin', status: 'Active', lastActive: '2 mins ago' },
        { id: 2, name: 'Bob Smith', email: 'bob@petrolord.com', role: 'Geologist', status: 'Active', lastActive: '1 hour ago' },
        { id: 3, name: 'Charlie Davis', email: 'charlie@external.com', role: 'Viewer', status: 'Inactive', lastActive: '3 days ago' },
        { id: 4, name: 'Diana Prince', email: 'diana@petrolord.com', role: 'Engineer', status: 'Active', lastActive: '5 mins ago' },
        { id: 5, name: 'Evan Wright', email: 'evan@petrolord.com', role: 'Manager', status: 'Suspended', lastActive: '1 week ago' },
    ];

    return (
        <div className="h-full p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-blue-400" /> User Management
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage access, roles, and permissions.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" /> Invite User
                </Button>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold text-slate-300">All Users ({users.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <Input placeholder="Search users..." className="pl-8 bg-slate-900 border-slate-800 h-9 text-xs" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Name</TableHead>
                                <TableHead className="text-slate-400">Role</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Last Active</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-medium text-slate-200">
                                        <div>{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-900 text-slate-300 border-slate-700">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            user.status === 'Active' ? 'bg-green-900/30 text-green-400' :
                                            user.status === 'Inactive' ? 'bg-slate-800 text-slate-400' :
                                            'bg-red-900/30 text-red-400'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">{user.lastActive}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                            <MoreHorizontal className="w-4 h-4" />
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

export default UserManagementPanel;