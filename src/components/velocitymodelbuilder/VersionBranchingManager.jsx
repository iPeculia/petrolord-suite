import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, GitMerge, Trash2, CornerDownRight } from 'lucide-react';

const VersionBranchingManager = () => {
  const branches = [
    { id: 'main', name: 'main', active: true, commit: 'v2.1', author: 'Sarah', protect: true },
    { id: 'feat1', name: 'explore_high_velocity', active: false, commit: 'v2.0-b1', author: 'Mike', protect: false },
    { id: 'feat2', name: 'shale_compaction_test', active: false, commit: 'v1.5-b2', author: 'Alex', protect: false },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-orange-400" /> Branch Management
        </CardTitle>
        <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700">
            <GitBranch className="w-3 h-3 mr-2" /> New Branch
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
            {branches.map((branch) => (
                <div key={branch.id} className={`p-3 border rounded-lg transition-colors flex items-center justify-between ${branch.active ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                    <div className="flex items-center gap-3">
                        <GitBranch className={`w-4 h-4 ${branch.active ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-mono ${branch.active ? 'text-white font-bold' : 'text-slate-300'}`}>{branch.name}</span>
                                {branch.active && <Badge className="text-[9px] h-4 px-1 bg-blue-600">Current</Badge>}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                <CornerDownRight className="w-3 h-3" />
                                <span>Latest: {branch.commit}</span>
                                <span>• {branch.author}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {!branch.active && (
                            <>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-emerald-400" title="Merge into Main">
                                    <GitMerge className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400" title="Delete Branch" disabled={branch.protect}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionBranchingManager;