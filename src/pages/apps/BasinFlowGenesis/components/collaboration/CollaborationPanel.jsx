import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Loader2, Circle } from 'lucide-react';
import { useCollaboration } from '../../contexts/CollaborationContext';

const CollaborationPanel = () => {
    const { activeUsers, isLoading, error } = useCollaboration();

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800 bg-slate-950/30">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-3 h-3" /> Team Presence
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 relative">
                <ScrollArea className="h-full p-2">
                    {isLoading ? (
                         <div className="flex items-center justify-center h-20 gap-2 text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin"/> <span className="text-xs">Connecting...</span>
                        </div>
                    ) : activeUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-slate-500 gap-1">
                            <div className="relative">
                                <Users className="w-8 h-8 opacity-20"/>
                                <Circle className="w-3 h-3 text-slate-600 absolute bottom-0 right-0 fill-slate-900" />
                            </div>
                            <span className="text-xs mt-2">You are the only one here.</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {activeUsers.map((user, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 border border-slate-700">
                                            <AvatarFallback className="bg-indigo-900 text-xs text-indigo-200 font-bold">
                                                {user.userId ? user.userId.slice(0, 2).toUpperCase() : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-slate-200">User {user.userId ? user.userId.slice(0, 6) : '...'}</div>
                                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                                            Active Now
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default CollaborationPanel;