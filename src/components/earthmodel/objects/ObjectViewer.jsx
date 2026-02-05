import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, MousePointer2, Maximize2 } from 'lucide-react';

const ObjectViewer = () => {
  const [objects, setObjects] = useState([
    { id: 1, name: 'Channel_Main', visible: true, type: 'Channel' },
    { id: 2, name: 'Channel_Trib_1', visible: true, type: 'Channel' },
    { id: 3, name: 'Lobe_Delta_A', visible: false, type: 'Lobe' },
  ]);

  const toggleVisibility = (id) => {
    setObjects(objects.map(o => o.id === id ? { ...o, visible: !o.visible } : o));
  };

  return (
    <div className="h-full flex gap-4">
      {/* Object List */}
      <Card className="w-64 bg-slate-900 border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold text-white">Scene Objects</h3>
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-auto">
          {objects.map(obj => (
            <div key={obj.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-800 group">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${obj.visible ? 'bg-green-500' : 'bg-slate-600'}`} />
                <span className={`text-sm ${obj.visible ? 'text-slate-200' : 'text-slate-500'}`}>
                  {obj.name}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-500 hover:text-white"
                onClick={() => toggleVisibility(obj.id)}
              >
                {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Viewer */}
      <div className="flex-1 relative bg-black rounded-lg overflow-hidden border border-slate-800 group">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-600 text-sm text-center">
            <p>3D Visualization Engine</p>
            <p className="text-xs mt-1">Displaying {objects.filter(o => o.visible).length} objects</p>
          </div>
        </div>
        
        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="bg-slate-800/80 backdrop-blur text-white hover:bg-slate-700">
            <MousePointer2 className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="bg-slate-800/80 backdrop-blur text-white hover:bg-slate-700">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          <Badge className="bg-slate-900/80 backdrop-blur border-slate-700 text-slate-300">
            x: 1500 y: 2300 z: -1200
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ObjectViewer;