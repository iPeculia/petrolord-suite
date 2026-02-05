import React from 'react';
import { Bell, Check, Loader2, Inbox } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCollaboration } from '../../contexts/CollaborationContext';

const NotificationCenter = () => {
    const { notifications, isLoading } = useCollaboration();
    
    const unreadCount = notifications.length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-400 hover:text-white">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900 animate-pulse"></span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-800 shadow-xl z-50" align="end">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-md">
                    <div className="flex items-center gap-2">
                        <Bell className="w-3 h-3 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Notifications</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] text-slate-500 hover:text-indigo-300 p-0">Mark all read</Button>
                </div>
                <ScrollArea className="h-72">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-500">
                            <Loader2 className="w-5 h-5 animate-spin"/>
                            <span className="text-xs">Syncing...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-xs gap-2">
                            <div className="p-3 bg-slate-800/50 rounded-full">
                                <Inbox className="w-5 h-5 opacity-50"/>
                            </div>
                            <span>No new notifications</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 hover:bg-slate-800/50 transition-colors cursor-pointer group relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs text-slate-300 font-medium">{n.action.replace(/_/g, ' ')}</p>
                                        <span className="text-[9px] text-slate-500 whitespace-nowrap ml-2">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 group-hover:text-slate-300 transition-colors">
                                        {typeof n.details === 'string' ? n.details : JSON.stringify(n.details)}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span className="text-[9px] text-slate-600">User: {n.user_id ? n.user_id.slice(0,4) : 'Sys'}...</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationCenter;