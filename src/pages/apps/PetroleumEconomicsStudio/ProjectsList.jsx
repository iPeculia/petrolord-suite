import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Plus, FolderOpen, Calendar, MapPin, MoreVertical, Trash2, Archive, Loader2, Play } from 'lucide-react';
import { PetroleumEconomicsProvider } from './contexts/PetroleumEconomicsContext';
import CreateProjectModal from '@/components/PetroleumEconomicsStudio/CreateProjectModal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const ProjectsListContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingProjectId, setOpeningProjectId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('econ_projects')
            .select('*, models:econ_models_v2(count)')
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        setProjects(data || []);
    } catch (error) {
        console.error("Error fetching projects:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load projects." });
    } finally {
        setLoading(false);
    }
  };

  const handleOpenProject = async (project) => {
      if (openingProjectId) return; // Prevent double clicks
      setOpeningProjectId(project.id);
      
      try {
        const { data: models, error } = await supabase
            .from('econ_models_v2')
            .select('id')
            .eq('project_id', project.id)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (models && models.length > 0) {
            navigate(`/dashboard/apps/petroleum-economics-studio/workspace/${models[0].id}`);
        } else {
            toast({ title: "Initializing...", description: "Creating base model for this project." });
            
            const modelPayload = {
                project_id: project.id,
                name: `${project.name} - Base Model`,
                description: 'Initial base model',
                base_year: new Date().getFullYear(),
                created_by: user.id,
                updated_by: user.id,
                status: 'active',
                currency: project.currency || 'USD',
                forecast_years: 20,
                model_type: 'deterministic'
            };

            const { data: newModel, error: createError } = await supabase
                .from('econ_models_v2')
                .insert(modelPayload)
                .select()
                .single();
            
            if (createError) {
                console.error("Supabase econ_models_v2 insert error:", createError);
                throw createError;
            }
            
            await supabase.from('econ_scenarios_v2').insert({
                model_id: newModel.id,
                name: 'Base Case',
                scenario_type: 'base',
                is_base_scenario: true,
                created_by: user.id
            });

            navigate(`/dashboard/apps/petroleum-economics-studio/workspace/${newModel.id}`);
        }
      } catch (err) {
          console.error("Error opening project:", err);
          toast({ variant: "destructive", title: "Error", description: err.message || "Could not open project workspace." });
      } finally {
          setOpeningProjectId(null);
      }
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <Helmet>
        <title>Petroleum Economics Studio - Projects</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Petroleum Economics Studio</h1>
          <p className="text-slate-400 mt-1">Manage economic evaluations for upstream assets.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-500">
                <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
            <div className="p-4 bg-slate-800 rounded-full mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm text-center">Get started by creating your first economic evaluation project.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="outline">Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-white truncate pr-4">{project.name}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white -mt-1 -mr-2">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                            <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                                <Archive className="w-4 h-4 mr-2" /> Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-red-900/50 text-red-400 hover:text-red-300 cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {project.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 flex-1">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location || "Unknown Location"}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(project.updated_at), 'MMM d, yyyy')}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-blue-950/50 border border-blue-900 text-blue-400 text-xs font-medium">
                        {project.models?.[0]?.count || 0} Models
                    </div>
                    <div className={`px-2 py-1 rounded border text-xs font-medium ${
                        project.status === 'active' ? 'bg-emerald-950/50 border-emerald-900 text-emerald-400' : 
                        'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                        {project.status?.toUpperCase() || 'DRAFT'}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                    onClick={() => handleOpenProject(project)} 
                    disabled={openingProjectId === project.id}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                >
                    {openingProjectId === project.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Play className="w-4 h-4 mr-2 fill-current" />
                    )}
                    Open Workspace
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchProjects();
        }} 
      />
    </div>
  );
};

const ProjectsList = () => (
    <PetroleumEconomicsProvider>
        <ProjectsListContent />
    </PetroleumEconomicsProvider>
);

export default ProjectsList;