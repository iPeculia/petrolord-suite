import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/customSupabaseClient';
import { Database, Upload, Download, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useStudio } from '@/contexts/StudioContext';

const SeismicInterpretationDatabase = ({ onLoadSession }) => {
    const [sessions, setSessions] = useState([]);
    const { activeProject } = useStudio();
    const { toast } = useToast();

    const fetchSessions = async () => {
        if (!activeProject) return;
        const { data, error } = await supabase
            .from('ss_assets')
            .select('*')
            .eq('project_id', activeProject.id)
            .eq('type', 'seismic-session')
            .order('created_at', { ascending: false });
        
        if (error) console.error(error);
        else setSessions(data || []);
    };

    useEffect(() => {
        fetchSessions();
    }, [activeProject]);

    const handleLoad = (session) => {
        if (onLoadSession) {
            onLoadSession(session.meta);
            toast({ title: "Session Loaded", description: `Loaded '${session.name}'` });
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('ss_assets').delete().eq('id', id);
        if (!error) {
            setSessions(prev => prev.filter(s => s.id !== id));
            toast({ title: "Deleted", description: "Session removed from database." });
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none h-full flex flex-col">
            <CardHeader className="pb-2 p-3 shrink-0">
                <CardTitle className="text-xs font-bold flex items-center text-indigo-400 uppercase">
                    <Database className="w-3 h-3 mr-2" /> Saved Sessions
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea className="h-full p-3">
                    {sessions.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No saved sessions found.</p>}
                    <div className="space-y-2">
                        {sessions.map(session => (
                            <div key={session.id} className="bg-slate-950 border border-slate-800 p-2 rounded hover:border-indigo-500/50 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-medium text-white mb-1">{session.name}</div>
                                        <div className="flex items-center text-[10px] text-slate-500">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(session.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleLoad(session)}>
                                            <Upload className="w-3 h-3 text-green-400" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(session.id)}>
                                            <Trash2 className="w-3 h-3 text-red-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default SeismicInterpretationDatabase;