import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Move, RotateCw, Maximize, Undo, Redo, AlertTriangle } from 'lucide-react';

const ObjectPlacementInterface = () => {
  const [coords, setCoords] = useState({ x: 1500, y: 2500, z: 1800 });

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="py-3">
        <CardTitle className="text-sm text-white flex items-center justify-between">
          Placement Controls
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6"><Undo className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6"><Redo className="w-3 h-3" /></Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500">Easting (X)</Label>
            <Input type="number" value={coords.x} onChange={e => setCoords({...coords, x: e.target.value})} className="h-8 bg-slate-950 border-slate-700" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500">Northing (Y)</Label>
            <Input type="number" value={coords.y} onChange={e => setCoords({...coords, y: e.target.value})} className="h-8 bg-slate-950 border-slate-700" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500">Depth (Z)</Label>
            <Input type="number" value={coords.z} onChange={e => setCoords({...coords, z: e.target.value})} className="h-8 bg-slate-950 border-slate-700" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 h-8 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700"><Move className="w-3 h-3 mr-2" /> Move</Button>
          <Button variant="secondary" className="flex-1 h-8 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700"><RotateCw className="w-3 h-3 mr-2" /> Rotate</Button>
          <Button variant="secondary" className="flex-1 h-8 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700"><Maximize className="w-3 h-3 mr-2" /> Scale</Button>
        </div>

        <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
          <div>
            <p className="text-xs text-yellow-400 font-medium">Overlap Warning</p>
            <p className="text-[10px] text-slate-400">Current placement overlaps with 'Channel_04' by 15%.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectPlacementInterface;