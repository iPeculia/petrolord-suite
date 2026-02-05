import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Layers, CheckCircle } from 'lucide-react';

const LoadContourProjectModal = ({ isOpen, onClose, onProjectSelect }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contour_projects')
        .select('id, project_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching contour projects',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, fetchProjects]);

  const handleConfirm = () => {
    if (selectedProjectId) {
      const selectedProject = projects.find(p => p.id === selectedProjectId);
      onProjectSelect(selectedProject);
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'No Project Selected',
        description: 'Please select a project to load.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-lime-300">Load Grid from Contour Project</DialogTitle>
          <DialogDescription className="text-slate-400">
            Select a saved Contour Digitizer project to use its generated grid as the top surface.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No Contour Digitizer projects found.</p>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProjectId(project.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selectedProjectId === project.id
                    ? 'bg-lime-500/20 border-lime-400'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                } border`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-white">{project.project_name}</p>
                    <p className="text-xs text-slate-400">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {selectedProjectId === project.id && (
                  <CheckCircle className="w-6 h-6 text-lime-400" />
                )}
              </motion.div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedProjectId || loading} className="bg-lime-600 hover:bg-lime-700 text-white">
            Confirm & Load
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoadContourProjectModal;