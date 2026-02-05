import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Cuboid, GitBranch, Layers, Box, Eye, Activity, Settings2, Droplet, Grid } from 'lucide-react';
import ObjectViewer3D from './ObjectViewer3D';
import ObjectPropertyPanel from './ObjectPropertyPanel';
import ObjectStatisticsPanel from './ObjectStatisticsPanel';
import ObjectPlacementInterface from './ObjectPlacementInterface';

const ObjectCard = ({ title, type, count, lastModified, icon: Icon, onClick }) => (
  <Card 
    className="bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
    onClick={onClick}
  >
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-blue-500/20 transition-colors text-blue-400">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-xs text-slate-500">{count} objects • {lastModified}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Settings2 className="w-4 h-4 text-slate-400" />
      </Button>
    </CardContent>
  </Card>
);

const ObjectModelingHub = ({ onViewChange }) => {
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, editor
  const [selectedObject, setSelectedObject] = useState(null);

  if (viewMode === 'editor') {
    return (
      <div className="h-full flex flex-col bg-slate-950">
        <div className="h-14 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
          <h2 className="font-bold text-slate-100">Object Editor</h2>
          <Button variant="outline" size="sm" onClick={() => setViewMode('dashboard')}>Close Editor</Button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative">
            <ObjectViewer3D onObjectSelect={setSelectedObject} />
            <div className="absolute top-4 left-4 w-72">
              <ObjectPlacementInterface />
            </div>
          </div>
          <div className="w-80 border-l border-slate-800 flex flex-col bg-slate-900">
            <div className="h-1/2 border-b border-slate-800 p-2 overflow-hidden">
              <ObjectPropertyPanel selectedObject={selectedObject} />
            </div>
            <div className="h-1/2 p-2 overflow-hidden">
              <ObjectStatisticsPanel />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cuboid className="w-6 h-6 text-orange-500" />
            Object Modeling
          </h2>
          <p className="text-slate-400 text-sm">Define and distribute stochastic geological bodies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => onViewChange('templates')}>
            <Grid className="w-4 h-4 mr-2" /> Templates
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => setViewMode('editor')}>
            <Eye className="w-4 h-4 mr-2" /> Open 3D Editor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ObjectCard 
              title="Fluvial Channels" 
              type="Channel" 
              count={12} 
              lastModified="2 mins ago" 
              icon={GitBranch} 
              onClick={() => onViewChange('channel')}
            />
            <ObjectCard 
              title="Deltaic Lobes" 
              type="Lobe" 
              count={8} 
              lastModified="1 hour ago" 
              icon={Layers} 
              onClick={() => onViewChange('lobe')}
            />
            <ObjectCard 
              title="Fault Blocks" 
              type="Block" 
              count={4} 
              lastModified="Yesterday" 
              icon={Box} 
              onClick={() => onViewChange('fault')} 
            />
            <ObjectCard 
              title="Salt Diapirs" 
              type="Dome" 
              count={1} 
              lastModified="2 days ago" 
              icon={Droplet} 
              onClick={() => onViewChange('salt')}
            />
          </div>

          <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Object Library</CardTitle>
                <Tabs defaultValue="all" className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="divide-y divide-slate-800">
                  {[
                    {name: 'Channel_Complex_01', type: 'Channel', meta: 'Sinuosity: 1.4 • Width: 250m', status: 'Active'},
                    {name: 'Lobe_System_Deep', type: 'Lobe', meta: 'Length: 4km • Thickness: 45m', status: 'Draft'},
                    {name: 'Salt_Dome_North', type: 'Dome', meta: 'Diapir • Volume: 1.2km³', status: 'Active'},
                    {name: 'Channel_Meander_B', type: 'Channel', meta: 'Sinuosity: 1.8 • Width: 120m', status: 'Active'},
                  ].map((obj, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${obj.status === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{obj.name}</p>
                          <p className="text-xs text-slate-500">{obj.meta}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-slate-800 text-slate-400">{obj.type}</Badge>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <ObjectStatisticsPanel />
          
          <Card className="bg-slate-900 border-slate-800 flex-1">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-300">
                <Activity className="w-4 h-4 mr-2" /> QC Check
              </Button>
              <Button variant="secondary" className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-300">
                <Layers className="w-4 h-4 mr-2" /> Conditioning
              </Button>
              <Button variant="secondary" className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-slate-300">
                <Box className="w-4 h-4 mr-2" /> Object Stacking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ObjectModelingHub;