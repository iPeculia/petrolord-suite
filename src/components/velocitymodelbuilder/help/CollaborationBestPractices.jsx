import React from 'react';
import { Users, GitMerge, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CollaborationBestPractices = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-400" /> Team Collaboration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <GitMerge className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Branching Strategy</h3>
            <p className="text-xs text-slate-400">
              Create separate branches for experimental velocity parameters (e.g., "feature/k-optimization") before merging to "Main".
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Comment Layers</h3>
            <p className="text-xs text-slate-400">
              Use annotation tools to leave spatially-referenced notes on the velocity map for peer reviewers.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Role Access</h3>
            <p className="text-xs text-slate-400">
              Limit "Write" access on the Gold Standard model to Senior Geophysicists to prevent accidental overwrites.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaborationBestPractices;