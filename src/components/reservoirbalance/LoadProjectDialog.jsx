import React, { useState, useEffect } from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
    } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { FolderOpen } from 'lucide-react';

    const LoadProjectDialog = ({ isOpen, onOpenChange, onProjectLoaded }) => {
      const [projects, setProjects] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        const fetchProjects = async () => {
          if (isOpen) {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              toast({ title: 'Not authenticated', description: 'You need to be logged in to load projects.', variant: 'destructive' });
              setIsLoading(false);
              return;
            }

            const { data, error } = await supabase
              .from('saved_reservoir_balance_projects')
              .select('id, project_name, updated_at')
              .eq('user_id', user.id)
              .order('updated_at', { ascending: false });

            if (error) {
              toast({ title: 'Error fetching projects', description: error.message, variant: 'destructive' });
            } else {
              setProjects(data);
            }
            setIsLoading(false);
          }
        };

        fetchProjects();
      }, [isOpen, toast]);

      const handleLoad = async (projectId) => {
        const { data, error } = await supabase
          .from('saved_reservoir_balance_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) {
          toast({ title: 'Error loading project', description: error.message, variant: 'destructive' });
        } else if (data) {
          onProjectLoaded(data);
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-lime-300">Load Surveillance Project</DialogTitle>
              <DialogDescription>Select a previously saved project to continue your analysis.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-72">
              <div className="space-y-2 pr-4">
                {isLoading ? (
                  <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                    <FolderOpen className="w-12 h-12 mb-4" />
                    <p className="font-semibold">No Saved Projects Found</p>
                    <p className="text-sm">Save your current work to find it here later.</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-800">
                      <div>
                        <p className="font-semibold">{project.project_name}</p>
                        <p className="text-xs text-slate-400">Last saved: {new Date(project.updated_at).toLocaleString()}</p>
                      </div>
                      <Button size="sm" onClick={() => handleLoad(project.id)}>Load</Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      );
    };

    export default LoadProjectDialog;