import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, Clock } from 'lucide-react';

const LoadProjectDialog = ({ isOpen, onClose, onProjectLoad }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to load projects.' });
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('geomechanics_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            toast({ variant: 'destructive', title: 'Fetch Error', description: error.message });
        } else {
            setProjects(data);
        }
        setLoading(false);
    };

    const handleLoad = (project) => {
        onProjectLoad(project);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Load Geomechanics Project</DialogTitle>
                    <DialogDescription>Select a previously saved simulation to load its data.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    {loading ? (
                        <p>Loading projects...</p>
                    ) : projects.length > 0 ? (
                        projects.map(project => (
                            <div key={project.id}
                                className="flex items-center justify-between p-2 mb-2 rounded-md hover:bg-slate-800 cursor-pointer"
                                onClick={() => handleLoad(project)}>
                                <div className="flex items-center gap-3">
                                    <Folder className="h-5 w-5 text-purple-400" />
                                    <div>
                                        <p className="font-semibold">{project.project_name}</p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Updated: {new Date(project.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Load</Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-400">No saved projects found.</p>
                    )}
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LoadProjectDialog;