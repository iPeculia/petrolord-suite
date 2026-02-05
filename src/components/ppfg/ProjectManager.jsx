import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, FolderOpen, Trash2 } from 'lucide-react';

const ProjectManager = ({ meta, updateMeta, onReset }) => {
  const { toast } = useToast();
  const [savedProjects, setSavedProjects] = useState([
      { id: 1, name: 'Niger Delta Block 1', date: '2024-03-15' },
      { id: 2, name: 'Deepwater Prospect X', date: '2024-03-10' }
  ]);

  const handleSave = () => {
      toast({ title: 'Project Saved', description: `${meta.name} has been saved successfully.` });
      // In real app, save to DB/LocalStorage
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Metadata Editor */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Project Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Project Name</Label>
                        <Input 
                            value={meta.name} 
                            onChange={(e) => updateMeta({ name: e.target.value })} 
                            className="bg-slate-950 border-slate-700" 
                        />
                    </div>
                    <div>
                        <Label>Well Name</Label>
                        <Input 
                            value={meta.wellName} 
                            onChange={(e) => updateMeta({ wellName: e.target.value })} 
                            className="bg-slate-950 border-slate-700" 
                        />
                    </div>
                    <div>
                        <Label>Operator</Label>
                        <Input 
                            value={meta.operator} 
                            onChange={(e) => updateMeta({ operator: e.target.value })} 
                            className="bg-slate-950 border-slate-700" 
                        />
                    </div>
                    <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4">
                        <Save className="w-4 h-4 mr-2" /> Save Project
                    </Button>
                </CardContent>
            </Card>

            {/* Saved Projects List */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-200">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {savedProjects.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 hover:border-slate-600 cursor-pointer group">
                                <div>
                                    <div className="font-bold text-slate-200 text-sm">{p.name}</div>
                                    <div className="text-xs text-slate-500">{p.date}</div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400">
                                        <FolderOpen className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" onClick={onReset} className="w-full mt-6 border-slate-700 text-slate-300">
                        Start New Project
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default ProjectManager;