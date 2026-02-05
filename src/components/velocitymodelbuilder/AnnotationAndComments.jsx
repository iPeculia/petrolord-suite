import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, MoreVertical, Pin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const AnnotationAndComments = () => {
  const [comments, setComments] = useState([
    { id: 1, user: 'Sarah Chen', role: 'Geophysicist', text: 'The velocity inversion at 2500m in Well-04 matches the overpressure zone observed in drilling.', time: '10:30 AM', type: 'well', target: 'Well-04' },
    { id: 2, user: 'Mike Ross', role: 'Drilling Eng', text: 'Can we adjust the gradient below the salt? It seems too aggressive compared to offset wells.', time: '11:15 AM', type: 'layer', target: 'Post-Salt' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    if(!newComment.trim()) return;
    setComments([...comments, {
        id: Date.now(),
        user: 'You',
        role: 'User',
        text: newComment,
        time: 'Just now',
        type: 'general',
        target: 'General'
    }]);
    setNewComment('');
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400"/> Team Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8 border border-slate-700">
                            <AvatarFallback className="bg-slate-800 text-xs text-slate-300">{comment.user.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-200">{comment.user}</span>
                                <span className="text-[10px] text-slate-500">{comment.time}</span>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 rounded-tl-none">
                                <p className="text-xs text-slate-300">{comment.text}</p>
                                {comment.type !== 'general' && (
                                    <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded w-fit">
                                        <Pin className="w-3 h-3" /> Attached to {comment.target}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
            <div className="flex gap-2">
                <Input 
                    placeholder="Add a comment..." 
                    className="bg-slate-900 border-slate-700 text-xs h-9"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" className="h-9 w-9 bg-blue-600 hover:bg-blue-500" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationAndComments;