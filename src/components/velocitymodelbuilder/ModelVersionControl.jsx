import React from 'react';
import { GitBranch, GitCommit, Clock, RotateCcw, Copy, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ModelVersionControl = () => {
  const versions = [
    { id: 'v2.1', name: 'VM_Final_Calibrated', user: 'Dr. Sarah Chen', time: '2 mins ago', message: 'Final calibration against Well-04 checkshots', active: true },
    { id: 'v2.0', name: 'VM_Checkshot_Update', user: 'Mike Ross', time: '2 hours ago', message: 'Added 3 new wells to control points', active: false },
    { id: 'v1.5', name: 'VM_High_Case_P90', user: 'System', time: 'Yesterday', message: 'Auto-generated P90 scenario', active: false },
    { id: 'v1.0', name: 'VM_Baseline', user: 'Dr. Sarah Chen', time: '2 days ago', message: 'Initial velocity model from stacking velocities', active: false },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-400"/> Model Version History
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">Track changes, compare versions, and rollback.</CardDescription>
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
                    {ver.active && <Badge className="text-[10px] bg-purple-600 hover:bg-purple-500">Current</Badge>}
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3"/> {ver.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2 pl-16 relative">
                    <GitCommit className="w-3 h-3 absolute left-0 top-0.5 text-slate-600" />
                    {ver.message}
                </p>
                <div className="flex items-center justify-between mt-2 pl-16">
                    <span className="text-[10px] text-slate-600">by {ver.user}</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" title="Compare"><Eye className="w-3 h-3"/></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white" title="Branch"><Copy className="w-3 h-3"/></Button>
                        {!ver.active && <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-blue-400" title="Restore"><RotateCcw className="w-3 h-3"/></Button>}
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

export default ModelVersionControl;