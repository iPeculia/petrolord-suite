import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, MessageSquare, Database, Settings, Users, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useCollaboration } from '../../contexts/CollaborationContext';

const ActivityFeed = () => {
    const { activityLog, isLoading, error, retryFetch } = useCollaboration();

    const getIcon = (action) => {
        if (action.includes('COMMENT')) return <MessageSquare className="w-3 h-3 text-blue-400" />;
        if (action.includes('UPDATE') || action.includes('EDIT')) return <Settings className="w-3 h-3 text-orange-400" />;
        if (action.includes('DATA')) return <Database className="w-3 h-3 text-emerald-400" />;
        if (action.includes('MEMBER')) return <Users className="w-3 h-3 text-purple-400" />;
        return <Activity className="w-3 h-3 text-slate-400" />;
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800 shrink-0 flex flex-row items-center justify-between bg-slate-950/30">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Project Activity
                </CardTitle>
                {error && <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500" onClick={retryFetch}><RefreshCw className="w-3 h-3"/></Button>}
            </CardHeader>
            <CardContent className="p-0 flex-grow min-h-0 relative">
                <ScrollArea className="h-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500"/>
                            <span className="text-xs">Loading activity...</span>
                        </div>
                    ) : error ? (
                         <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2 p-4 text-center">
                            <AlertCircle className="w-6 h-6 text-red-400 mb-1"/>
                            <span className="text-xs text-slate-400">Unable to load recent activity.</span>
                        </div>
                    ) : activityLog.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 p-6 text-center">
                            <Activity className="w-8 h-8 mb-2 opacity-20"/>
                            <p className="text-xs">No recent activity recorded for this project.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {activityLog.map((log, i) => (
                                <div key={log.id || i} className="p-3 hover:bg-slate-800/50 transition-colors relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            {getIcon(log.action)}
                                            <span className="text-xs font-medium text-slate-200">{log.action.replace(/_/g, ' ')}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-500">{formatTime(log.created_at)}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 pl-5 line-clamp-2">
                                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details).slice(0, 100)}
                                    </p>
                                    <div className="text-[9px] text-slate-600 pl-5 mt-1">
                                        User: {log.user_id ? log.user_id.slice(0,6) : 'System'}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;