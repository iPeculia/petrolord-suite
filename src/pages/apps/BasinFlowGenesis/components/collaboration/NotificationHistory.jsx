import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, Info, AlertCircle } from 'lucide-react';

const NotificationHistory = () => {
    // Mock history
    const notifications = [
        { id: 1, type: 'info', text: "Bob updated Heat Flow", time: "2m ago", read: false },
        { id: 2, type: 'success', text: "Simulation completed successfully", time: "10m ago", read: true },
        { id: 3, type: 'message', text: "New comment from Alice", time: "15m ago", read: true },
        { id: 4, type: 'warning', text: "Storage limit approaching (80%)", time: "1h ago", read: true },
        { id: 5, type: 'info', text: "Weekly backup created", time: "1d ago", read: true },
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-3 h-3" /> Notification History
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="divide-y divide-slate-800">
                        {notifications.map(n => (
                            <div key={n.id} className={`p-3 hover:bg-slate-800/50 transition-colors ${!n.read ? 'bg-slate-800/20' : ''}`}>
                                <div className="flex gap-3">
                                    <div className="mt-0.5">{getIcon(n.type)}</div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-200">{n.text}</p>
                                        <span className="text-[10px] text-slate-500">{n.time}</span>
                                    </div>
                                    {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default NotificationHistory;