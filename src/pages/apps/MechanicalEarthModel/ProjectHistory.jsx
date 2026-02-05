import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FolderOpen, AlertTriangle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ProjectHistory = ({ onSelectProject }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('mem_projects')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false })
                    .limit(5);

                if (error) {
                    setError(error.message);
                } else {
                    setProjects(data);
                }
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    <span className="ml-2 text-slate-400">Loading projects...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center p-8 text-red-400">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    <span>Error loading projects: {error}</span>
                </div>
            );
        }

        if (projects.length === 0) {
            return <p className="text-center text-slate-500 p-8">No recent projects found.</p>;
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow className="border-b-slate-700">
                        <TableHead className="text-white">Project Name</TableHead>
                        <TableHead className="text-white">Last Updated</TableHead>
                        <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.id} className="border-b-slate-700 hover:bg-slate-800/50">
                            <TableCell className="font-medium text-slate-200">{project.project_name}</TableCell>
                            <TableCell className="text-slate-400">{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => onSelectProject(project.id)}>
                                    <FolderOpen className="w-4 h-4 mr-2" />
                                    Open
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Quickly access your recent 1D MEM projects.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default ProjectHistory;