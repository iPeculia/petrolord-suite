import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, User } from 'lucide-react';
import { useCollaboration } from '../../contexts/CollaborationContext';

const CommentThread = () => {
    const { comments, addComment, currentUser } = useCollaboration();
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if(scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [comments]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        await addComment(newMessage, 'general');
        setNewMessage('');
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800 shrink-0">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Discussion
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow min-h-0 flex flex-col">
                <ScrollArea className="flex-grow p-3" ref={scrollRef}>
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <div className="text-center text-xs text-slate-600 py-8 italic">
                                No comments yet. Start the conversation!
                            </div>
                        ) : (
                            comments.map((comment, i) => {
                                const isMe = comment.user_id === currentUser?.id;
                                return (
                                    <div key={comment.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] rounded-lg p-2 text-xs ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                                            {comment.message}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-[9px] text-slate-500 font-bold">
                                                {isMe ? 'You' : `User ${comment.user_id.slice(0,4)}`}
                                            </span>
                                            <span className="text-[9px] text-slate-600">• {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
                <div className="p-2 border-t border-slate-800 flex gap-2 bg-slate-950 shrink-0">
                    <Input 
                        className="h-8 text-xs bg-slate-900 border-slate-700 focus-visible:ring-indigo-500" 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSend}>
                        <Send className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CommentThread;