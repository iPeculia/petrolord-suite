import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TeamCommentThread = () => {
  const threads = [
    { id: 1, title: "Decision on Top Reservoir V0", count: 5, lastUpdate: "10m ago", tags: ["Decision", "High Priority"] },
    { id: 2, title: "Well-02 Data Quality Issues", count: 3, lastUpdate: "1h ago", tags: ["Data QC"] },
    { id: 3, title: "Velocity Anisotropy Parameters", count: 12, lastUpdate: "Yesterday", tags: ["Modeling"] },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" /> Active Discussions
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500">
            <Filter className="w-3 h-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <div className="divide-y divide-slate-800">
                {threads.map(thread => (
                    <div key={thread.id} className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-semibold text-slate-200">{thread.title}</h4>
                            <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-400">
                                {thread.lastUpdate}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            {thread.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-[9px] py-0 h-4 border-slate-700 text-slate-500">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <Avatar className="h-5 w-5 border-2 border-slate-900"><AvatarFallback className="text-[8px] bg-blue-800 text-white">SC</AvatarFallback></Avatar>
                                <Avatar className="h-5 w-5 border-2 border-slate-900"><AvatarFallback className="text-[8px] bg-emerald-800 text-white">MR</AvatarFallback></Avatar>
                                <div className="h-5 w-5 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] text-slate-400">+{thread.count}</div>
                            </div>
                            <span className="text-[10px] text-blue-400 hover:underline">View Thread</span>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamCommentThread;