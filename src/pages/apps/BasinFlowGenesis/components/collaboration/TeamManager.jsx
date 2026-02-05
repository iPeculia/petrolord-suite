import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useCollaboration } from '../../contexts/CollaborationContext';
import { useToast } from '@/components/ui/use-toast';

const TeamManager = () => {
    const { teamMembers, inviteMember, currentUser, isLoading, error, retryFetch } = useCollaboration();
    const { toast } = useToast();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail) return;
        if (!inviteEmail.includes('@')) {
            toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
            return;
        }
        
        setInviting(true);
        try {
            await inviteMember(inviteEmail, 'editor');
            toast({ title: "Invitation Sent", description: `Invite sent to ${inviteEmail}` });
            setIsInviteOpen(false);
            setInviteEmail('');
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "Failed to send invite." });
        } finally {
            setInviting(false);
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between shrink-0 bg-slate-950/30">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" /> Team Members
                    {!isLoading && <Badge variant="secondary" className="ml-1 text-xs bg-slate-800">{teamMembers.length}</Badge>}
                </CardTitle>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                            <UserPlus className="w-3 h-3 mr-2" /> Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800">
                        <DialogHeader><DialogTitle className="text-white">Invite Team Member</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Email Address</label>
                                <Input 
                                    value={inviteEmail} 
                                    onChange={(e) => setInviteEmail(e.target.value)} 
                                    placeholder="colleague@company.com"
                                    className="bg-slate-950 border-slate-700 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Role</label>
                                <select className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded p-2">
                                    <option value="editor">Editor (Can edit data)</option>
                                    <option value="viewer">Viewer (Read only)</option>
                                    <option value="admin">Admin (Full access)</option>
                                </select>
                            </div>
                            <Button onClick={handleInvite} disabled={inviting} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                {inviting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                                {inviting ? 'Sending...' : 'Send Invitation'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0 flex-grow min-h-0 relative">
                <ScrollArea className="h-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500"/>
                            <span className="text-xs">Loading team roster...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-40 text-red-400 gap-2 p-4 text-center">
                            <AlertCircle className="w-6 h-6"/>
                            <span className="text-xs">{error}</span>
                            <Button variant="ghost" size="sm" onClick={retryFetch} className="text-indigo-400 hover:text-indigo-300 h-6 mt-2">Retry</Button>
                        </div>
                    ) : teamMembers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 p-6 text-center">
                            <Users className="w-8 h-8 mb-2 opacity-20"/>
                            <p className="text-sm font-medium text-slate-400">No team members yet</p>
                            <p className="text-xs mt-1">Invite colleagues to collaborate on this project.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {teamMembers.map((member, i) => {
                                const name = member.user_id === currentUser?.id ? 'You' : (member.user?.email?.split('@')[0] || `User ${member.user_id.slice(0,4)}`);
                                const email = member.user?.email || '...';
                                
                                return (
                                    <div key={member.id || i} className="p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-900/50 border border-indigo-800 flex items-center justify-center text-indigo-200 text-xs font-bold">
                                                {name.substring(0,2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-slate-200 flex items-center gap-2">
                                                    {name}
                                                    {member.user_id === currentUser?.id && <Badge variant="secondary" className="text-[9px] h-4 bg-slate-800 text-slate-400">Me</Badge>}
                                                </div>
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {email}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`text-[10px] h-5 uppercase ${member.role === 'owner' ? 'border-amber-500/50 text-amber-500' : 'border-slate-700 text-slate-400'}`}>
                                            {member.role || 'viewer'}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default TeamManager;