import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Folder, Trash2, Edit, Loader2, Check, ChevronsUpDown, Search } from 'lucide-react';
import { format } from 'date-fns';
import { crsList } from '@/data/crs';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const CrsSelectorDialog = ({ isOpen, onOpenChange, onSelect, selectedValue }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrsList = crsList.filter(crs => 
    crs.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Coordinate Reference System</DialogTitle>
          <DialogDescription>Search for and select a CRS for your project.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search CRS by name or EPSG code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800"
            />
          </div>
          <ScrollArea className="h-72 w-full rounded-md border border-slate-700">
            <div className="p-2">
              {filteredCrsList.length > 0 ? (
                filteredCrsList.map((crs) => (
                  <div
                    key={crs.value}
                    onClick={() => {
                      onSelect(crs.value);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-800",
                      selectedValue === crs.value && "bg-blue-600/20"
                    )}
                  >
                    <span className="text-sm">{crs.label}</span>
                    {selectedValue === crs.value && <Check className="h-4 w-4 text-cyan-400" />}
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-slate-400">No results found.</div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const MyProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCrsDialogOpen, setIsCrsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectEpsg, setNewProjectEpsg] = useState('');

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ss_projects')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Error fetching projects',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast({ title: 'Project name is required', variant: 'destructive' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ss_projects')
        .insert([{ 
          name: newProjectName, 
          crs_epsg: newProjectEpsg ? parseInt(newProjectEpsg, 10) : null,
          created_by: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      toast({ title: 'Project created successfully!' });
      setIsCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectEpsg('');
      navigate(`/dashboard/apps/geoscience/earth-model-studio/${data.id}`);

    } catch (error) {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>My EarthModel Studio Projects</title>
        <meta name="description" content="Manage your EarthModel Studio projects." />
      </Helmet>
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-bold text-white">My Projects</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-slate-800/50 p-12 rounded-xl border border-slate-700">
            <Folder className="mx-auto h-24 w-24 text-slate-500" />
            <h2 className="mt-6 text-2xl font-semibold text-white">No Projects Yet</h2>
            <p className="mt-2 text-slate-400">Get started by creating your first project.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-6">Create New Project</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Card className="bg-slate-800 border-slate-700 text-white h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-slate-400">Created: {format(new Date(project.created_at), 'PPP')}</p>
                     <p className="text-sm text-slate-400">CRS: {project.crs_epsg || 'Not set'}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm" disabled>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    <Link to={`/dashboard/apps/geoscience/earth-model-studio/${project.id}`}>
                      <Button>Open Studio</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New EarthModel Project</DialogTitle>
              <DialogDescription>Give your new project a name and optional coordinate system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-name" className="text-right">Name</Label>
                <Input id="project-name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="col-span-3 bg-slate-800" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-epsg" className="text-right">CRS</Label>
                <Button
                    variant="outline"
                    onClick={() => setIsCrsDialogOpen(true)}
                    className="col-span-3 justify-between bg-slate-800 hover:bg-slate-700"
                >
                    {newProjectEpsg
                        ? crsList.find((crs) => crs.value === newProjectEpsg)?.label
                        : "Select CRS..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <CrsSelectorDialog 
          isOpen={isCrsDialogOpen}
          onOpenChange={setIsCrsDialogOpen}
          onSelect={setNewProjectEpsg}
          selectedValue={newProjectEpsg}
        />

      </div>
    </>
  );
};

export default MyProjects;