import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Mail } from 'lucide-react';
import { CollaborationService } from '@/services/fdp/CollaborationService';
import { useToast } from '@/components/ui/use-toast';

const TeamManagement = () => {
    const { state, dispatch } = useFDP();
    const { toast } = useToast();
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Viewer');

    const handleInvite = async () => {
        if (!inviteEmail) return;
        
        try {
            // Simulate API call
            const newMember = await CollaborationService.inviteMember(state.meta.id, inviteEmail, inviteRole);
            
            // Update local state via context action (mocked here by manually dispatching update)
            // Ideally use an action: actions.addTeamMember(newMember);
            // Since we updated context below, we assume logic exists or we manually add it here if we had a direct reducer for it.
            // For now, just show success as we are in a mock environment
            
            toast({ title: "Invitation Sent", description: `Invited ${inviteEmail} as ${inviteRole}` });
            setInviteEmail('');
        } catch (e) {
            toast({ title: "Error", description: "Failed to invite member.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white text-sm">Invite New Member</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input 
                            placeholder="Email address" 
                            value={inviteEmail} 
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="bg-slate-800 border-slate-700 flex-1"
                        />
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Reviewer">Reviewer</SelectItem>
                                <SelectItem value="Owner">Owner</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleInvite} className="bg-blue-600 hover:bg-blue-700">
                            <Mail className="w-4 h-4 mr-2" /> Send Invite
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white text-sm">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {state.collaboration.team.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{member.name}</div>
                                        <div className="text-xs text-slate-500">{member.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        member.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        {member.status}
                                    </span>
                                    <Select defaultValue={member.role}>
                                        <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-900 border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Viewer">Viewer</SelectItem>
                                            <SelectItem value="Editor">Editor</SelectItem>
                                            <SelectItem value="Reviewer">Reviewer</SelectItem>
                                            <SelectItem value="Owner">Owner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamManagement;