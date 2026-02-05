import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Info, GitPullRequest, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChangeNotificationSystem = () => {
  const notifications = [
    { id: 1, type: 'merge', title: 'Branch Merged', desc: "Sarah merged 'fix/checkshots' into 'main'", time: '5m ago', icon: GitPullRequest, color: 'text-purple-400' },
    { id: 2, type: 'mention', title: 'New Mention', desc: "Mike mentioned you in 'Well-04 Analysis'", time: '20m ago', icon: MessageCircle, color: 'text-blue-400' },
    { id: 3, type: 'system', title: 'Build Completed', desc: "Velocity Model build v2.1 finished successfully", time: '1h ago', icon: Info, color: 'text-emerald-400' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Bell className="w-4 h-4 text-yellow-400" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <div className="divide-y divide-slate-800">
                {notifications.map(notif => (
                    <div key={notif.id} className="p-4 flex gap-3 hover:bg-slate-800/50">
                        <div className={`mt-1 ${notif.color}`}>
                            <notif.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-200">{notif.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{notif.desc}</p>
                            <span className="text-[10px] text-slate-600 mt-1 block">{notif.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChangeNotificationSystem;