import React from 'react';
import { MessageSquare, Plus, User, Pin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const comments = [
    { id: 1, user: 'Geo_Dave', depth: '1255.0', text: 'Check this channel margin. Core photos suggest erosional contact.', time: '2h ago', pinned: true },
    { id: 2, user: 'Sarah_P', depth: '1340.5', text: 'Agreed, looks like a flooding surface.', time: '1h ago', pinned: false },
];

const DepthIntervalComments = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg h-full flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400"/> Discussion
                </h3>
                <Button size="xs" variant="ghost" className="h-6"><Plus className="w-3 h-3"/></Button>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                            <Avatar className="h-8 w-8 border border-slate-700">
                                <AvatarFallback className="text-[10px] bg-slate-800 text-slate-300">{comment.user.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-200">{comment.user}</span>
                                        <span className="text-[10px] text-slate-500">{comment.time}</span>
                                    </div>
                                    {comment.pinned && <Pin className="w-3 h-3 text-yellow-500" />}
                                </div>
                                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-300 relative">
                                    {comment.depth && (
                                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-slate-800 text-[9px] text-slate-400 rounded border border-slate-700 font-mono">
                                            @{comment.depth}m
                                        </span>
                                    )}
                                    {comment.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-3 border-t border-slate-800 bg-slate-950">
                <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Add a comment at current depth..."
                />
            </div>
        </div>
    );
};

export default DepthIntervalComments;