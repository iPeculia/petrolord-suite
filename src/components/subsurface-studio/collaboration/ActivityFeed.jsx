import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, GitCommit, MessageSquare, MousePointerClick } from 'lucide-react';

const ActivityFeed = () => {
    const activities = [
        { id: 1, user: 'Sarah Chen', action: 'updated horizon pick', target: 'Top Cretaceous', time: '2m ago', icon: MousePointerClick },
        { id: 2, user: 'Mike Ross', action: 'added comment', target: 'Well A-12 Log QC', time: '15m ago', icon: MessageSquare },
        { id: 3, user: 'System', action: 'auto-saved project', target: 'Gulf Exploration v2', time: '1h ago', icon: GitCommit },
        { id: 4, user: 'Ayo Asaolu', action: 'created new map view', target: 'Regional Overview', time: '3h ago', icon: MousePointerClick },
    ];

    return (
        <div className="h-full flex flex-col bg-slate-900">
            <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Activity className="w-3 h-3" /> Activity Stream
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-3 space-y-4">
                    {activities.map((act) => (
                        <div key={act.id} className="flex gap-3 items-start">
                            <div className="mt-0.5">
                                <act.icon className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="flex-grow">
                                <div className="text-xs text-slate-300">
                                    <span className="font-bold text-slate-200">{act.user}</span> {act.action} <span className="text-indigo-300">{act.target}</span>
                                </div>
                                <div className="text-[10px] text-slate-500">{act.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ActivityFeed;