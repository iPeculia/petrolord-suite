import React from 'react';
import { Users, Briefcase, Shield, MoreVertical, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ProjectWorkspaces = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Briefcase className="w-4 h-4 text-purple-400" /> Project Workspace
                </CardTitle>
                <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700"><Plus className="w-3 h-3 mr-2"/> Invite</Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="p-4 space-y-6">
                    <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Active Members</h4>
                        <div className="space-y-3">
                            {[
                                { name: 'Alex Chen', role: 'Admin', email: 'alex@petrolord.com' },
                                { name: 'Sarah Miller', role: 'Interpreter', email: 'sarah@petrolord.com' },
                                { name: 'Mike Ross', role: 'Viewer', email: 'mike@client-noc.com' },
                            ].map((member, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border border-slate-700">
                                            <AvatarFallback className="bg-slate-800 text-xs text-slate-300">{member.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-white">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="bg-slate-950 text-slate-400">{member.role}</Badge>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Permissions</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">Public Link Access</p>
                                        <p className="text-xs text-slate-500">Anyone with link can view results</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="h-7 text-xs">Configure</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectWorkspaces;