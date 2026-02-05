import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Users, Send } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CollaborationPanel = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, user: 'Sarah J.', text: 'Updated the fault interpretation in block B.', time: '10:30 AM' },
        { id: 2, user: 'Mike R.', text: 'Checking the velocity model now.', time: '10:32 AM' }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if(!inputText.trim()) return;
        const newMsg = {
            id: Date.now(),
            user: user?.email?.split('@')[0] || 'Me',
            text: inputText,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        setMessages([...messages, newMsg]);
        setInputText('');
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between text-slate-200">
                    <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-emerald-400" /> Team Sync</div>
                    <div className="flex -space-x-2">
                        <Avatar className="w-6 h-6 border-2 border-slate-900"><AvatarFallback className="bg-blue-600 text-[8px]">SJ</AvatarFallback></Avatar>
                        <Avatar className="w-6 h-6 border-2 border-slate-900"><AvatarFallback className="bg-purple-600 text-[8px]">MR</AvatarFallback></Avatar>
                        <Avatar className="w-6 h-6 border-2 border-slate-900"><AvatarFallback className="bg-green-600 text-[8px]">You</AvatarFallback></Avatar>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-3 pt-0">
                <ScrollArea className="flex-grow mb-2 pr-2 h-40">
                    <div className="space-y-3">
                        {messages.map(msg => (
                            <div key={msg.id} className="flex flex-col gap-1">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[10px] font-bold text-slate-300">{msg.user}</span>
                                    <span className="text-[8px] text-slate-500">{msg.time}</span>
                                </div>
                                <div className="bg-slate-800 p-2 rounded text-xs text-slate-200">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="flex gap-2">
                    <Input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type message..." 
                        className="h-8 bg-slate-950 border-slate-800 text-xs"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" className="h-8 w-8" onClick={handleSend}>
                        <Send className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CollaborationPanel;