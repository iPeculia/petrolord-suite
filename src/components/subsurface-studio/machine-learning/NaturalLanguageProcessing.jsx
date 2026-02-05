import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot } from 'lucide-react';

const NaturalLanguageProcessing = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am your subsurface AI assistant. Ask me about well logs, seismic attributes, or report summaries.' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: 'I am analyzing the project data to answer your query...' }]);
        }, 800);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-cyan-400" />
                <span className="text-sm font-bold text-white">Geo-Assistant</span>
            </div>
            <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 text-xs ${
                                msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <Input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    placeholder="Ask a question..." 
                    className="bg-slate-950 border-slate-800 text-xs"
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" onClick={handleSend} className="bg-cyan-600"><Send className="w-4 h-4" /></Button>
            </div>
        </div>
    );
};

export default NaturalLanguageProcessing;