import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const NaturalLanguageQueryEngine = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Ask me anything about your velocity model. E.g., "What is the average V0 in the reservoir?"' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Mock AI Response
    setTimeout(() => {
      const aiMsg = { role: 'assistant', content: 'The average V0 in the Reservoir Sand layer is 2,850 m/s, with a standard deviation of ±45 m/s across 12 wells.' };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" /> Model Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col h-[300px]">
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-xs ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-300 rounded-bl-none'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <Input 
                className="h-8 text-xs bg-slate-900 border-slate-700" 
                placeholder="Ask a question..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-500 p-0" onClick={handleSend}>
                <Send className="w-3 h-3" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NaturalLanguageQueryEngine;