import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit2, Layers, Link, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const LayerGroupingManager = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Overburden', layers: ['Water Layer', 'Top Tertiary', 'Base Cretaceous'], color: 'bg-blue-500' },
    { id: 2, name: 'Reservoir Section', layers: ['Top Jurassic', 'Base Jurassic'], color: 'bg-emerald-500' },
    { id: 3, name: 'Basement', layers: ['Basement Top'], color: 'bg-purple-500' }
  ]);

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Layer Grouping
            </CardTitle>
            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">
              <Link className="w-3 h-3 mr-1" /> Auto-Group
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.map(group => (
            <div key={group.id} className="bg-slate-950 border border-slate-800 rounded-md p-3">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${group.color}`}></div>
                  <h4 className="font-medium text-sm text-white">{group.name}</h4>
                  <Badge variant="secondary" className="text-[10px] h-5 bg-slate-800 text-slate-400">{group.layers.length} Layers</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5 ml-4">
                {group.layers.map((layer, idx) => (
                  <div key={idx} className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded flex justify-between items-center border border-slate-800/50">
                    <span>{layer}</span>
                    <span className="text-[10px] text-slate-600 font-mono">V0=Function</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-slate-500">Group V0 Shift</Label>
                  <Input className="h-6 text-xs bg-slate-900 border-slate-700" placeholder="+0 m/s" />
                </div>
                <div>
                  <Label className="text-[10px] text-slate-500">Group k Factor</Label>
                  <Input className="h-6 text-xs bg-slate-900 border-slate-700" placeholder="x1.0" />
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full border border-dashed border-slate-700 text-slate-500 hover:text-white hover:bg-slate-800 text-xs h-8">
            + Create New Group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayerGroupingManager;