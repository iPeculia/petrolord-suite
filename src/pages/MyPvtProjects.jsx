import React, { useState, useEffect, useCallback } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Link, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { ArrowLeft, Beaker, PlusCircle, Trash2, Eye } from 'lucide-react';

    const MyPvtProjects = () => {
      const [projects, setProjects] = useState([]);
      const [loading, setLoading] = useState(true);
      const { user } = useAuth();
      const { toast } = useToast();
      const navigate = useNavigate();

      const fetchProjects = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
          .from('saved_pvt_projects')
          .select('*, reservoirs(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          toast({
            variant: "destructive",
            title: "Error fetching projects",
            description: error.message,
          });
        } else {
          setProjects(data);
        }
        setLoading(false);
      }, [user, toast]);

      useEffect(() => {
        fetchProjects();
      }, [fetchProjects]);

      const deleteProject = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }
        const { error } = await supabase
          .from('saved_pvt_projects')
          .delete()
          .eq('id', projectId);

        if (error) {
          toast({
            variant: "destructive",
            title: "Error deleting project",
            description: error.message,
          });
        } else {
          setProjects(projects.filter(p => p.id !== projectId));
          toast({
            title: "Project Deleted",
            description: "The project has been successfully removed.",
          });
        }
      };

      const loadProject = (project) => {
        navigate('/dashboard/reservoir/pvt-quicklook', { state: { loadedProject: project } });
      };

      return (
        <>
          <Helmet>
            <title>My PVT Projects - Petrolord Suite</title>
            <meta name="description" content="View and manage your saved PVT analysis projects." />
          </Helmet>
          <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Link to="/dashboard/reservoir/pvt-quicklook">
                  <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to PVT QuickLook
                  </Button>
                </Link>
                <Link to="/dashboard/reservoir/pvt-quicklook">
                  <Button size="sm" className="bg-lime-600 hover:bg-lime-700 text-white">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-white">My Saved PVT Projects</h1>
                  <p className="text-lime-200 text-md md:text-lg">Load, view, and manage your past analyses.</p>
                </div>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                <h3 className="text-xl font-semibold text-white">No Projects Found</h3>
                <p className="text-slate-400 mt-2">You haven't saved any PVT projects yet.</p>
                <Link to="/dashboard/reservoir/pvt-quicklook" className="mt-4 inline-block">
                  <Button className="bg-lime-600 hover:bg-lime-700 text-white">Create Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col justify-between hover:border-lime-400 transition-colors"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white truncate">{project.project_name}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                        Reservoir: <span className="text-lime-300">{project.reservoirs?.name || 'N/A'}</span>
                      </p>
                      <p className="text-sm text-slate-400">
                        Saved on: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => loadProject(project)} className="bg-lime-600 hover:bg-lime-700 text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        Load Project
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    };

    export default MyPvtProjects;