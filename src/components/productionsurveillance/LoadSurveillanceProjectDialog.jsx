import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/customSupabaseClient';
import { Folder, FileText, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LoadSurveillanceProjectDialog = ({ isOpen, onOpenChange, onLoadProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('production_surveillance_projects')
      .select('id, project_name, updated_at')
      .order('updated_at', { ascending: false });

    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: error.message,
      });
    } else {
      setProjects(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center"><Folder className="mr-2"/> Load Surveillance Project</DialogTitle>
          <DialogDescription>Select a previously saved project to continue your analysis.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center p-8">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center p-8 bg-slate-800/50 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-slate-500" />
              <h3 className="mt-4 text-lg font-semibold text-white">No Projects Found</h3>
              <p className="mt-1 text-sm text-slate-400">Save a project to see it here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => onLoadProject(project)}
                    className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700/50 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-white">{project.project_name}</p>
                      <p className="text-xs text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1.5" />
                        Last updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Load</Button>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadSurveillanceProjectDialog;