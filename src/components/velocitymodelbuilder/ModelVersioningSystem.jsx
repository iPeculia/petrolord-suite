import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, GitCommit, Clock, RotateCcw, Copy, Eye, Tag, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ModelVersioningSystem = () => {
  const [versions, setVersions] = useState([
    { id: 'v2.1', name: 'VM_Final_Calibrated', user: 'Dr. Sarah Chen', time: '2 mins ago', message: 'Final calibration against Well-04 checkshots', tags: ['Release', 'Approved'], active: true },
    { id: 'v2.0', name: 'VM_Checkshot_Update', user: 'Mike Ross', time: '2 hours ago', message: 'Added 3 new wells to control points', tags: ['Draft'], active: false },
    { id: 'v1.5', name: 'VM_High_Case_P90', user: 'System', time: 'Yesterday', message: 'Auto-generated P90 scenario', tags: ['Scenario'], active: false },
    { id: 'v1.0', name: 'VM_Baseline', user: 'Dr. Sarah Chen', time: '2 days ago', message: 'Initial velocity model from stacking velocities', tags: ['Baseline'], active: false },
  ]);

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-purple-400"/> Version Control
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">Manage snapshots, releases, and rollback points.</CardDescription>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-500">
                    <Plus className="w-3 h-3 mr-2" /> Create Snapshot
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create New Version Snapshot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Version Name</Label>
                        <Input placeholder="e.g. VM_Phase1_Final" className="bg-slate-950 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Describe changes..." className="bg-slate-950 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input placeholder="e.g. Milestone, QA_Ready" className="bg-slate-950 border-slate-700" />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-500">Create Snapshot</Button>
                </div>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="divide-y divide-slate-800">
            {versions.map((ver) => (
              <div key={ver.id} className={`p-4 hover:bg-slate-800/50 transition-colors ${ver.active ? 'bg-purple-900/10 border-l-2 border-purple-500' : 'border-l-2 border-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] border-slate-700 text-slate-400">{ver.id}</Badge>
                    <span className="text-sm font-semibold text-slate-200">{ver.name}</span>
                    {ver.active && <Badge className="text-[10px] bg-purple-600 hover:bg-purple-500 border-0">Active</Badge>}
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3"/> {ver.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2 pl-14 relative">
                    {ver.message}
                </p>
                <div className="pl-14 flex gap-1 mb-3">
                    {ver.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[9px] h-4 px-1 bg-slate-800 text-slate-400 border border-slate-700">
                            <Tag className="w-2 h-2 mr-1"/> {tag}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-2 pl-14">
                    <span className="text-[10px] text-slate-600">by {ver.user}</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" title="Compare"><Eye className="w-3 h-3"/></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" title="Branch"><GitBranch className="w-3 h-3"/></Button>
                        {!ver.active && <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-blue-400" title="Rollback"><RotateCcw className="w-3 h-3"/></Button>}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ModelVersioningSystem;