import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Upload, Trash2, Clock } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const WellCorrelationDatabase = ({ projectId, onLoadSession }) => {
    const { toast } = useToast();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSessions = async () => {
        if (!projectId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('ss_assets')
            .select('*')
            .eq('project_id', projectId)
            .eq('type', 'correlation-session')
            .order('created_at', { ascending: false });
        
        if (error) {
            toast({ variant: 'destructive', title: 'Error fetching sessions', description: error.message });
        } else {
            setSessions(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSessions();
    }, [projectId]);

    const handleDelete = async (id) => {
        const { error } = await supabase.from('ss_assets').delete().eq('id', id);
        if (error) {
            toast({ variant: 'destructive', title: 'Delete failed', description: error.message });
        } else {
            toast({ title: 'Session deleted' });
            setSessions(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-700 flex flex-col h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Database className="w-4 h-4 mr-2 text-blue-400" /> Saved Sessions
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                    {sessions.length === 0 && !loading && (
                        <div className="text-center text-xs text-slate-500 py-8">No saved sessions found.</div>
                    )}
                    <div className="space-y-2">
                        {sessions.map(session => (
                            <div key={session.id} className="bg-slate-800 p-2 rounded border border-slate-700 flex justify-between items-center group hover:border-blue-500 transition-colors">
                                <div className="overflow-hidden">
                                    <div className="font-medium text-xs text-slate-200 truncate">{session.name}</div>
                                    <div className="text-[10px] text-slate-500 flex items-center mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {format(new Date(session.created_at), 'MMM d, yyyy HH:mm')}
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-green-400" onClick={() => onLoadSession(session)}>
                                        <Upload className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => handleDelete(session.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default WellCorrelationDatabase;