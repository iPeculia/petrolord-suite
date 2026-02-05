import React, { useState } from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DCAWellGrouping = () => {
  const { wellGroups, createWellGroup, deleteWellGroup, selectedWellGroup, setSelectedWellGroup } = useDeclineCurve();
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreate = () => {
    if (!newGroupName) return;
    createWellGroup(newGroupName);
    setNewGroupName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <Layers size={14} />
        <span className="text-xs font-medium uppercase tracking-wider">Well Groups</span>
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="New Group Name" 
          value={newGroupName} 
          onChange={(e) => setNewGroupName(e.target.value)}
          className="h-8 bg-slate-800 border-slate-700 text-xs"
        />
        <Button onClick={handleCreate} size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 px-3">
          <Plus size={14} />
        </Button>
      </div>

      <ScrollArea className="h-[200px] pr-2">
        <div className="space-y-2">
          {wellGroups.length === 0 ? (
            <div className="text-center py-4 text-slate-500 text-xs italic">No groups created</div>
          ) : (
            wellGroups.map(group => (
              <div 
                key={group.id}
                className={`p-2 rounded border text-sm flex justify-between items-center cursor-pointer transition-colors ${selectedWellGroup === group.id ? 'bg-blue-900/30 border-blue-700' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                onClick={() => setSelectedWellGroup(group.id)}
              >
                <div>
                  <div className="font-medium text-slate-200">{group.name}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Users size={10} /> {group.wellIds.length} wells
                  </div>
                </div>
                {selectedWellGroup === group.id && (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-[10px] h-5">Active</Badge>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DCAWellGrouping;