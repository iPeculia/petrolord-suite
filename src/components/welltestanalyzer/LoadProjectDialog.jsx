import React, { useState, useEffect, useCallback } from 'react';
    import {
      Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Loader2, Trash2 } from 'lucide-react';

    const LoadProjectDialog = ({ isOpen, setIsOpen, onLoadProject }) => {
      const [projects, setProjects] = useState([]);
      const [loading, setLoading] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');
      const { user } = useAuth();
      const { toast } = useToast();

      const fetchProjects = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('pta_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setProjects(data);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Failed to fetch projects', description: error.message });
        } finally {
          setLoading(false);
        }
      }, [user, toast]);

      useEffect(() => {
        if (isOpen) {
          fetchProjects();
        }
      }, [isOpen, fetchProjects]);

      const handleLoad = (project) => {
        onLoadProject(project);
        setIsOpen(false);
      };

      const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        
        try {
          const { error } = await supabase.from('pta_projects').delete().eq('id', projectId);
          if (error) throw error;
          toast({ title: "Project Deleted", description: "The project has been permanently removed." });
          fetchProjects(); // Refresh the list
        } catch (error) {
          toast({ variant: 'destructive', title: 'Failed to delete project', description: error.message });
        }
      };
      
      const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Load Well Test Analysis Project</DialogTitle>
              <DialogDescription>Select a previously saved project to continue your work.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-600 mb-4"
              />
              <ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-lime-400" /></div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center text-slate-400 py-10">No projects found.</div>
                ) : (
                  <div className="space-y-2">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md border border-slate-700">
                        <div>
                          <p className="font-semibold text-white">{project.name}</p>
                          <p className="text-xs text-slate-400">Well: {project.well_name} | Last updated: {new Date(project.updated_at).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-red-400 hover:bg-red-900/50 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleLoad(project)}>Load</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      );
    };

    export default LoadProjectDialog;