import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, Loader2 } from 'lucide-react';

const LoadProjectDialog = ({ isOpen, onOpenChange, onLoadProject }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchProjects();
    }
  }, [isOpen, user]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fiscal_regime_projects')
      .select('id, project_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching projects',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleLoadClick = async (projectId) => {
    const { data, error } = await supabase
      .from('fiscal_regime_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      toast({
        title: 'Error loading project',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      onLoadProject(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-lime-300">Load Fiscal Regime Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a previously saved project to continue your work.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-lime-300" />
                    <div>
                      <p className="font-semibold text-white">{project.project_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleLoadClick(project.id)} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Load
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No saved projects found.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LoadProjectDialog;