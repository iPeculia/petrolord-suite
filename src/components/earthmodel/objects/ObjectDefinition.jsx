import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Save, RotateCcw, Box, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ObjectDefinition = ({ onBack }) => {
  const { toast } = useToast();
  const [objectType, setObjectType] = useState('channel');
  const [params, setParams] = useState({
    width: 200,
    thickness: 15,
    sinuosity: 1.2,
    orientation: 45,
    length: 1500
  });

  const handleSave = () => {
    toast({ title: "Object Saved", description: `${objectType} definition added to library.` });
    if (onBack) onBack();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">Define Object</h2>
          <p className="text-slate-400 text-sm">Configure geometric and petrophysical parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <Card className="bg-slate-900 border-slate-800 h-full overflow-auto">
          <CardHeader>
            <CardTitle className="text-white">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Object Type</Label>
              <Select value={objectType} onValueChange={setObjectType}>
                <SelectTrigger className="bg-slate-950 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="channel">Fluvial Channel</SelectItem>
                  <SelectItem value="lobe">Deltaic Lobe</SelectItem>
                  <SelectItem value="levee">Levee / Overbank</SelectItem>
                  <SelectItem value="mound">Carbonate Mound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
              <h4 className="text-sm font-medium text-slate-300">Geometry</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Width (m)</Label>
                  <span className="text-xs text-slate-400">{params.width}m</span>
                </div>
                <Slider 
                  value={[params.width]} 
                  max={1000} 
                  step={10} 
                  onValueChange={([v]) => setParams({...params, width: v})} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Thickness (m)</Label>
                  <span className="text-xs text-slate-400">{params.thickness}m</span>
                </div>
                <Slider 
                  value={[params.thickness]} 
                  max={50} 
                  step={1} 
                  onValueChange={([v]) => setParams({...params, thickness: v})} 
                />
              </div>

              {objectType === 'channel' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sinuosity</Label>
                    <span className="text-xs text-slate-400">{params.sinuosity}</span>
                  </div>
                  <Slider 
                    value={[params.sinuosity]} 
                    min={1}
                    max={3} 
                    step={0.1} 
                    onValueChange={([v]) => setParams({...params, sinuosity: v})} 
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Orientation (deg)</Label>
                  <span className="text-xs text-slate-400">{params.orientation}°</span>
                </div>
                <Slider 
                  value={[params.orientation]} 
                  max={360} 
                  step={5} 
                  onValueChange={([v]) => setParams({...params, orientation: v})} 
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
              <h4 className="text-sm font-medium text-slate-300">Internal Properties</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facies Code</Label>
                  <Input type="number" className="bg-slate-950 border-slate-700" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label>Net-to-Gross</Label>
                  <Input type="number" className="bg-slate-950 border-slate-700" defaultValue="0.85" step="0.05" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button variant="outline" className="border-slate-700">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader className="py-3 border-b border-slate-800">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Box className="w-4 h-4" /> 3D Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-slate-950">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <div className="w-32 h-32 border-2 border-dashed border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xs">WebGL Canvas</span>
                  </div>
                  <p className="text-sm">Interactive 3D preview of {objectType}</p>
                  <p className="text-xs mt-2">
                    W: {params.width}m • H: {params.thickness}m • {params.orientation}°
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-48 bg-slate-900 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-slate-300">Vertical Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-slate-500 text-xs">
              Cross-section preview would be rendered here
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ObjectDefinition;