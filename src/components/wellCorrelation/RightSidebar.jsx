import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackConfiguration from './TrackConfiguration';
import LayerManagement from './LayerManagement';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCorrelationPanel } from '@/hooks/useWellCorrelation';
import { Eye, Settings2, SlidersHorizontal } from 'lucide-react';

const RightSidebar = ({ width }) => {
  const { zoom, setZoom } = useCorrelationPanel();

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 shadow-xl" style={{ width }}>
      <Tabs defaultValue="tracks" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-slate-800 bg-slate-950 p-0 h-10">
          <TabsTrigger 
            value="view" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-slate-900 text-xs h-10 text-slate-400 data-[state=active]:text-blue-400 transition-all"
          >
            <Eye className="w-3 h-3 mr-1.5" /> View
          </TabsTrigger>
          <TabsTrigger 
            value="tracks" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-slate-900 text-xs h-10 text-slate-400 data-[state=active]:text-blue-400 transition-all"
          >
            <SlidersHorizontal className="w-3 h-3 mr-1.5" /> Tracks
          </TabsTrigger>
          <TabsTrigger 
            value="layers" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-slate-900 text-xs h-10 text-slate-400 data-[state=active]:text-blue-400 transition-all"
          >
            <Settings2 className="w-3 h-3 mr-1.5" /> Layers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="p-5 space-y-6 flex-1 overflow-y-auto bg-slate-900">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <Label className="text-xs text-slate-300 font-medium">Vertical Scale</Label>
               <span className="text-[10px] font-mono text-blue-400 bg-blue-950/30 px-1.5 rounded">1:{Math.round(1000/zoom)}</span>
            </div>
            <Slider 
              value={[1000/zoom]} 
              min={100} 
              max={2000} 
              step={100} 
              onValueChange={([val]) => setZoom(1000/val)} 
              className="flex-1 [&>.relative>.absolute]:bg-blue-500" 
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Zoom In</span>
              <span>Zoom Out</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <Label className="text-xs text-slate-300 font-medium">Reference Datum</Label>
            <Select defaultValue="kb">
              <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800 focus:ring-blue-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                <SelectItem value="kb">Kelly Bushing (KB)</SelectItem>
                <SelectItem value="sl">Sea Level (MSL)</SelectItem>
                <SelectItem value="gl">Ground Level (GL)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Label className="text-xs text-slate-300 font-medium">Flatten on Horizon</Label>
            <Switch className="scale-75 data-[state=checked]:bg-blue-600"/>
          </div>
        </TabsContent>

        <TabsContent value="tracks" className="flex-1 p-0 overflow-hidden data-[state=inactive]:hidden">
          <TrackConfiguration />
        </TabsContent>
        
        <TabsContent value="layers" className="flex-1 p-0 overflow-hidden data-[state=inactive]:hidden">
          <LayerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;