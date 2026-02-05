import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, MapPin, AtSign, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AnnotationAndCommentsSystem = () => {
  const comments = [
    { id: 1, user: 'Mike Ross', initial: 'MR', msg: 'Checkshot data for Well-04 seems noisy in the shallow section. Please verify.', target: 'Well-04', type: 'issue', resolved: false, time: '2h ago' },
    { id: 2, user: 'Sarah Chen', initial: 'SC', msg: '@MikeRoss I applied a smoothing filter. Is it better now?', target: 'Well-04', type: 'reply', resolved: false, time: '1h ago' },
    { id: 3, user: 'Alex V.', initial: 'AV', msg: 'Velocity gradient in Layer 2 is too steep compared to offset wells.', target: 'Layer 2', type: 'issue', resolved: true, time: '1d ago' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Contextual Comments
            </CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700">
                <MapPin className="w-3 h-3 mr-1" /> Add Pin
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 bg-slate-950/30">
        <ScrollArea className="h-full p-4">
            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className={`flex gap-3 group ${comment.resolved ? 'opacity-60' : ''}`}>
                        <Avatar className="h-8 w-8 border border-slate-700">
                            <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">{comment.initial}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-200">{comment.user}</span>
                                    <span className="text-[10px] text-slate-500">{comment.time}</span>
                                    {comment.resolved && <span className="text-[9px] text-emerald-500 flex items-center"><CheckCircle2 className="w-2 h-2 mr-0.5"/> Resolved</span>}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    {!comment.resolved && (
                                        <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500 hover:text-emerald-400" title="Resolve">
                                            <CheckCircle2 className="w-3 h-3" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500 hover:text-white" title="Reply">
                                        <AtSign className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-slate-300 shadow-sm">
                                <div className="flex items-center gap-1 mb-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                                    <MapPin className="w-2.5 h-2.5" /> {comment.target}
                                </div>
                                {comment.msg}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="p-3 border-t border-slate-800 bg-slate-900">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Write a comment... Use @ to mention" 
                    className="w-full bg-slate-950 border-slate-800 rounded h-8 pl-3 pr-8 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
                <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-8 w-8 text-slate-500 hover:text-white">
                    <MessageSquare className="w-3 h-3" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationAndCommentsSystem;