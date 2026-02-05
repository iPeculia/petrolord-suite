import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Layers, ArrowLeft, PlusCircle, Trash2, Eye } from 'lucide-react';

const MyContourProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('contour_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching projects', description: error.message });
    } else {
      setProjects(data);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLoadProject = (project) => {
    navigate('/dashboard/geoscience/contour-map-digitizer', { state: { loadedProject: project } });
  };

  const handleDeleteProject = async (projectId) => {
    const { error } = await supabase.from('contour_projects').delete().eq('id', projectId);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting project', description: error.message });
    } else {
      toast({ title: 'Project Deleted' });
      fetchProjects();
    }
  };

  return (
    <>
      <Helmet>
        <title>My Contour Projects - Petrolord Suite</title>
        <meta name="description" content="Manage your saved contour map digitization projects." />
      </Helmet>
      <div className="p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard/geoscience">
              <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Geoscience
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-xl">
                    <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">My Contour Projects</h1>
                    <p className="text-lime-200">Load, view, or delete your saved projects.</p>
                </div>
            </div>
            <Link to="/dashboard/geoscience/contour-map-digitizer">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-white py-10">Loading projects...</div>
        ) : projects.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-white/5 rounded-lg">
            <h3 className="text-xl font-semibold text-white">No projects found.</h3>
            <p className="text-slate-400 mt-2 mb-4">Get started by creating your first contour map project.</p>
            <Link to="/dashboard/geoscience/contour-map-digitizer">
              <Button>Create New Project</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <motion.div key={project.id} whileHover={{ y: -5 }} className="bg-slate-800/50 border border-white/10 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white truncate">{project.project_name}</h3>
                  <p className="text-sm text-slate-400 mb-1">Map: {project.map_name || 'N/A'}</p>
                  <p className="text-xs text-slate-500">Saved on: {new Date(project.created_at).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleLoadProject(project)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Load Project
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MyContourProjects;