import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, Trash2, Copy } from 'lucide-react';

const ObjectPropertyPanel = ({ selectedObject }) => {
  if (!selectedObject) {
    return (
      <Card className="h-full bg-slate-900 border-slate-800 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Select an object to view properties</div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-slate-900 border-slate-800 overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          <span>Properties</span>
          <span className="text-xs font-normal text-slate-400 uppercase">{selectedObject.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-400">Name</Label>
          <Input defaultValue={`${selectedObject.type}_${selectedObject.id}`} className="bg-slate-950 border-slate-700" />
        </div>
        
        <Separator className="bg-slate-800" />
        
        <h4 className="text-sm font-medium text-slate-200">Geometry</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-slate-500">Position X</Label>
            <Input type="number" defaultValue={selectedObject.position[0]} className="bg-slate-950 border-slate-700 h-8" />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Position Y</Label>
            <Input type="number" defaultValue={selectedObject.position[1]} className="bg-slate-950 border-slate-700 h-8" />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Position Z</Label>
            <Input type="number" defaultValue={selectedObject.position[2]} className="bg-slate-950 border-slate-700 h-8" />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Orientation</Label>
            <Input type="number" defaultValue={45} className="bg-slate-950 border-slate-700 h-8" />
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <h4 className="text-sm font-medium text-slate-200">Petrophysics</h4>
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Facies Code</Label>
          <Input type="number" defaultValue={1} className="bg-slate-950 border-slate-700 h-8" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Porosity Mean</Label>
          <Input type="number" defaultValue={0.25} step={0.01} className="bg-slate-950 border-slate-700 h-8" />
        </div>

        <div className="pt-4 flex gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-500"><Save className="w-4 h-4 mr-2" /> Update</Button>
          <Button variant="outline" size="icon" className="border-slate-700"><Copy className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="border-slate-700 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectPropertyPanel;