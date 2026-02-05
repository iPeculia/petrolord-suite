import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserCog, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const RoleBasedAccessControl = () => {
  const users = [
    { id: 1, name: 'Sarah Chen', role: 'Admin', initial: 'SC' },
    { id: 2, name: 'Mike Ross', role: 'Editor', initial: 'MR' },
    { id: 3, name: 'Alex V.', role: 'Viewer', initial: 'AV' },
    { id: 4, name: 'Jessica L.', role: 'Validator', initial: 'JL' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-400" /> Team Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <div className="divide-y divide-slate-800">
                {users.map(user => (
                    <div key={user.id} className="p-3 flex items-center justify-between hover:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-slate-700">
                                <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">{user.initial}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-xs font-bold text-slate-200">{user.name}</div>
                                <div className="text-[10px] text-slate-500">Last active: 10m ago</div>
                            </div>
                        </div>
                        <Select defaultValue={user.role.toLowerCase()}>
                            <SelectTrigger className="h-7 w-24 text-[10px] bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="validator">Validator</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RoleBasedAccessControl;