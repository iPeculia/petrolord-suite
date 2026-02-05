import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { useWebSocket } from './WebSocketManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ChatPanel = () => {
    const { channel, status } = useWebSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        if (!channel) return;

        const messageHandler = (payload) => {
            // Avoid adding duplicate optimistic messages
            setMessages(prev => {
                if (prev.find(m => m.id === payload.payload.id)) return prev;
                return [...prev, payload.payload];
            });
        };

        channel.on('broadcast', { event: 'chat-message' }, messageHandler);

        return () => {
            if (channel) {
               channel.off('broadcast', { event: 'chat-message' }, messageHandler);
            }
        };
    }, [channel]);

    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        if (scrollArea) {
            const viewport = scrollArea.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || !channel || status !== 'SUBSCRIBED') return;

        const msg = {
            id: crypto.randomUUID(), // Use a more robust unique ID
            userId: user.id,
            userEmail: user.email,
            text: inputValue,
            timestamp: new Date().toISOString()
        };

        // Optimistic update
        setMessages(prev => [...prev, msg]);

        // Send to others
        channel.send({
            type: 'broadcast',
            event: 'chat-message',
            payload: msg
        });

        setInputValue('');
    };

    return (
        <Card className="h-full flex flex-col bg-slate-950 border-l-0 border-t-0 border-b-0 border-r-0 border-slate-800 rounded-none w-full">
            <CardHeader className="p-3 border-b border-slate-800">
                <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Team Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
                <ScrollArea className="flex-grow p-3 space-y-3" ref={scrollAreaRef}>
                    {status !== 'SUBSCRIBED' && (
                        <div className="text-center text-xs text-slate-500 mt-10 flex items-center justify-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                        </div>
                    )}
                    {status === 'SUBSCRIBED' && messages.length === 0 && (
                        <div className="text-center text-xs text-slate-500 mt-10">No messages yet. Say hello!</div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col mb-3 ${msg.userId === user.id ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-2 text-xs ${msg.userId === user.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                                {msg.text}
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1 px-1">
                                {msg.userId !== user.id && <span className="font-bold mr-1">{msg.userEmail?.split('@')[0]}</span>}
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <div className="p-3 border-t border-slate-800 flex gap-2">
                    <Input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..." 
                        className="h-8 text-xs bg-slate-900 border-slate-700"
                        disabled={status !== 'SUBSCRIBED'}
                    />
                    <Button size="icon" className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700" onClick={handleSend} disabled={status !== 'SUBSCRIBED'}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChatPanel;