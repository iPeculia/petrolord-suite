import React from 'react';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X, Grid, Activity, Type, Ruler } from 'lucide-react';

const LayerItem = ({ id, icon: Icon, label, visible, opacity, onToggle, onOpacityChange }) => (
  <div className="flex flex-col gap-2 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-300">
        <Icon className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <Switch 
        checked={!!visible} 
        onCheckedChange={onToggle}
        className="scale-75 data-[state=checked]:bg-blue-600"
      />
    </div>
    {visible && (
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] text-slate-500 w-8">Opac.</span>
        <Slider 
          value={[(opacity || 1) * 100]} 
          min={0} 
          max={100} 
          step={5}
          onValueChange={([v]) => onOpacityChange && onOpacityChange(v / 100)}
          className="flex-1"
        />
        <span className="text-[10px] text-slate-500 w-6 text-right">{Math.round((opacity || 1) * 100)}%</span>
      </div>
    )}
  </div>
);

const LayerPanel = ({ onClose }) => {
  const { layers, toggleLayer, setLayerOpacity } = useTrackConfigurationContext();

  // Safely access layer properties even if layers structure changes
  const getLayer = (id) => {
    if (Array.isArray(layers)) {
        return layers.find(l => l.id === id) || { visible: true, opacity: 1 };
    }
    return (layers && layers[id]) ? layers[id] : { visible: true, opacity: 1 };
  };

  return (
    <div className="w-64 bg-slate-950 border-l border-slate-800 flex flex-col h-full shadow-2xl z-20">
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-3 bg-slate-900">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Layers</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          <LayerItem 
            id="grid"
            icon={Grid}
            label="Grid Lines"
            visible={getLayer('grid').visible}
            opacity={getLayer('grid').opacity}
            onToggle={() => toggleLayer('grid')}
            onOpacityChange={(v) => setLayerOpacity('grid', v)}
          />
          
          <LayerItem 
            id="logs"
            icon={Activity}
            label="Well Logs"
            visible={getLayer('logs').visible}
            opacity={getLayer('logs').opacity}
            onToggle={() => toggleLayer('logs')}
            onOpacityChange={(v) => setLayerOpacity('logs', v)}
          />

          <LayerItem 
            id="annotations"
            icon={Type}
            label="Annotations"
            visible={getLayer('annotations').visible}
            opacity={getLayer('annotations').opacity}
            onToggle={() => toggleLayer('annotations')}
            onOpacityChange={(v) => setLayerOpacity('annotations', v)}
          />

          <LayerItem 
            id="measurements"
            icon={Ruler}
            label="Measurements"
            visible={getLayer('measurements').visible}
            opacity={getLayer('measurements').opacity}
            onToggle={() => toggleLayer('measurements')}
            onOpacityChange={(v) => setLayerOpacity('measurements', v)}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default LayerPanel;