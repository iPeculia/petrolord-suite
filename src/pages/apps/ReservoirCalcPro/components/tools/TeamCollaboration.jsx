import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, MessageSquare, Share2, Clock, FileCheck, Search } from 'lucide-react';

const TeamCollaboration = () => {
    const teamMembers = [
        { id: 1, name: 'Sarah Chen', role: 'Senior Reservoir Engineer', status: 'online', initials: 'SC' },
        { id: 2, name: 'Mike Ross', role: 'Geologist', status: 'offline', initials: 'MR' },
        { id: 3, name: 'David Kim', role: 'Petrophysicist', status: 'busy', initials: 'DK' },
    ];

    const activities = [
        { id: 1, user: 'Sarah Chen', action: 'updated', target: 'Alpha-1 Sands Model', time: '10 mins ago' },
        { id: 2, user: 'Mike Ross', action: 'commented on', target: 'Porosity Distribution', time: '1 hour ago' },
        { id: 3, user: 'You', action: 'created', target: 'New Project: Beta Field', time: '2 hours ago' },
    ];

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Team Collaboration</h2>
                    <p className="text-slate-400">Manage your team, share projects, and track activity.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <UserPlus className="w-4 h-4" /> Invite Member
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Team Members List */}
                <Card className="bg-slate-900 border-slate-800 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white text-base">Team Members</CardTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-500" />
                            <Input placeholder="Search team..." className="pl-8 bg-slate-950 border-slate-700" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 transition-colors cursor-pointer">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-900 text-blue-200">{member.initials}</AvatarFallback>
                                        </Avatar>
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                                            member.status === 'online' ? 'bg-green-500' : 
                                            member.status === 'busy' ? 'bg-red-500' : 'bg-slate-500'
                                        }`}></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-white truncate">{member.name}</h4>
                                        <p className="text-xs text-slate-400 truncate">{member.role}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card className="bg-slate-900 border-slate-800 flex-1">
                        <Tabs defaultValue="activity" className="h-full flex flex-col">
                            <div className="px-6 pt-6">
                                <TabsList className="bg-slate-950 border border-slate-800">
                                    <TabsTrigger value="activity">Activity Feed</TabsTrigger>
                                    <TabsTrigger value="projects">Shared Projects</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <div className="flex-1 p-6 overflow-y-auto">
                                <TabsContent value="activity" className="mt-0 space-y-6">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-4">
                                            <div className="mt-1 bg-slate-800 p-2 rounded-full h-fit">
                                                {activity.action === 'updated' ? <FileCheck className="w-4 h-4 text-blue-400"/> : 
                                                 activity.action === 'commented on' ? <MessageSquare className="w-4 h-4 text-green-400"/> :
                                                 <Share2 className="w-4 h-4 text-purple-400"/>}
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-300">
                                                    <span className="font-bold text-white">{activity.user}</span> {activity.action} <span className="text-blue-400">{activity.target}</span>
                                                </p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" /> {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>
                                
                                <TabsContent value="projects" className="mt-0">
                                    <div className="text-center text-slate-500 py-12">
                                        <Share2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <h3 className="text-lg font-medium text-slate-400">No Shared Projects Yet</h3>
                                        <p className="text-sm mt-2">Share your first project to start collaborating.</p>
                                        <Button variant="outline" className="mt-4 border-slate-700">Share Project</Button>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamCollaboration;