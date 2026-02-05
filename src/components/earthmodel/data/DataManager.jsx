import React, { useState, useEffect } from 'react';
import { earthModelService } from '@/services/earthModelService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DataManager = ({ activeProject, onProjectSelect }) => {
  const [projects, setProjects] = useState([]);
  const [wells, setWells] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (activeProject) {
      loadWells(activeProject.id);
    }
  }, [activeProject]);

  const loadProjects = async () => {
    try {
      const data = await earthModelService.getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWells = async (projectId) => {
    try {
        const data = await earthModelService.getWells(projectId);
        setWells(data || []);
    } catch (err) {
        console.error(err);
    }
  };

  const handleCreateProject = async () => {
    try {
        const name = prompt("Project Name:");
        if (!name) return;
        await earthModelService.createProject({ name, description: 'New Earth Model Project' });
        loadProjects();
        toast({ title: "Project Created" });
    } catch (err) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCreateWell = async () => {
     if (!activeProject) return;
     try {
        const name = prompt("Well Name:");
        if (!name) return;
        await earthModelService.createWell({ 
            name, 
            project_id: activeProject.id,
            x: 0, y: 0, z_surface: 0 
        });
        loadWells(activeProject.id);
        toast({ title: "Well Created" });
     } catch (err) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
     }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-slate-950 overflow-y-auto">
      
      {/* Projects Section */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={handleCreateProject}><Plus className="h-4 w-4 mr-2"/> New Project</Button>
        </CardHeader>
        <CardContent>
            {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No projects found. Create one to get started.</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>CRS</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map(p => (
                            <TableRow key={p.id} className={activeProject?.id === p.id ? "bg-slate-800" : ""}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell>{p.crs}</TableCell>
                                <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => onProjectSelect(p)}>
                                        {activeProject?.id === p.id ? 'Active' : 'Load'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>

      {/* Wells Section */}
      {activeProject && (
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Wells</CardTitle>
          <div className="space-x-2">
            <Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-2"/> Import CSV</Button>
            <Button size="sm" onClick={handleCreateWell}><Plus className="h-4 w-4 mr-2"/> Add Well</Button>
          </div>
        </CardHeader>
        <CardContent>
             {wells.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No wells in this project.</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>X</TableHead>
                            <TableHead>Y</TableHead>
                            <TableHead>KB</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wells.map(w => (
                            <TableRow key={w.id}>
                                <TableCell className="font-medium flex items-center">
                                    <FileText className="h-3 w-3 mr-2 text-blue-400"/> {w.name}
                                </TableCell>
                                <TableCell>{w.x}</TableCell>
                                <TableCell>{w.y}</TableCell>
                                <TableCell>{w.z_surface}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default DataManager;