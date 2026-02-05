import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, Bell, CheckCircle2 } from 'lucide-react';
import { useFDP } from '@/contexts/FDPContext';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
        </CardContent>
    </Card>
);

const CollaborationOverview = ({ onNavigate }) => {
    const { state } = useFDP();
    const { team, comments, notifications } = state.collaboration;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Active Members" 
                    value={team.length} 
                    subtitle="Currently online: 2" 
                    icon={Users} 
                    color="blue" 
                />
                <StatCard 
                    title="Unresolved Comments" 
                    value={comments.filter(c => !c.resolved).length} 
                    subtitle="Across all modules" 
                    icon={MessageSquare} 
                    color="yellow" 
                />
                <StatCard 
                    title="Notifications" 
                    value={notifications.filter(n => !n.read).length} 
                    subtitle="Unread alerts" 
                    icon={Bell} 
                    color="red" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {comments.slice(0, 3).map((comment, idx) => (
                                <div key={idx} className="flex gap-3 p-3 bg-slate-800/50 rounded border border-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                        {comment.authorName?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">{comment.authorName}</span>
                                            <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && <p className="text-sm text-slate-500 italic">No recent activity.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Team Status</h3>
                        <div className="space-y-2">
                            {team.slice(0, 5).map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}`} />
                                        <span className="text-sm text-slate-200">{member.name}</span>
                                    </div>
                                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{member.role}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                             <button onClick={() => onNavigate('team')} className="text-sm text-blue-400 hover:text-blue-300">View All Members</button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CollaborationOverview;