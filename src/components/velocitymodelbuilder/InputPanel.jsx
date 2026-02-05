import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Calculator, Settings2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const InputPanel = ({ projectInfo, handleProjectInfoChange, modelData, updateModelData, onCalculate, loading }) => {
  const [newLayer, setNewLayer] = useState({
    name: '',
    topDepth: '',
    bottomDepth: '',
    velocity: '',
    gradient: '0'
  });

  const addLayer = () => {
    if (!newLayer.name || !newLayer.topDepth || !newLayer.bottomDepth || !newLayer.velocity) return;

    const layer = {
      id: Date.now().toString(),
      ...newLayer
    };

    const updatedLayers = [...modelData.layers, layer].sort((a, b) => parseFloat(a.topDepth) - parseFloat(b.topDepth));
    updateModelData({ layers: updatedLayers });
    
    // Reset form, auto-suggesting next depth
    setNewLayer({
      name: '',
      topDepth: newLayer.bottomDepth,
      bottomDepth: '',
      velocity: '',
      gradient: '0'
    });
  };

  const removeLayer = (id) => {
    updateModelData({
      layers: modelData.layers.filter(l => l.id !== id)
    });
  };

  return (
    <Card className="flex flex-col h-full bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <Tabs defaultValue="project" className="w-full">
          <TabsList className="w-full bg-slate-950/50 grid grid-cols-2">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="project" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Project Name</Label>
              <Input 
                name="name"
                value={projectInfo.name}
                onChange={handleProjectInfoChange}
                placeholder="e.g., North Sea Block 4"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Input 
                name="description"
                value={projectInfo.description}
                onChange={handleProjectInfoChange}
                placeholder="Optional description"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
              />
            </div>
            
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center">
                <Settings2 className="w-4 h-4 mr-2" />
                Global Parameters
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Datum (m)</Label>
                  <Input 
                    type="number"
                    value={modelData.datum}
                    onChange={(e) => updateModelData({ datum: parseFloat(e.target.value) })}
                    className="bg-slate-950 border-slate-800 h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">V_rep (m/s)</Label>
                  <Input 
                    type="number"
                    value={modelData.replacementVelocity}
                    onChange={(e) => updateModelData({ replacementVelocity: parseFloat(e.target.value) })}
                    className="bg-slate-950 border-slate-800 h-8"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="mt-4 h-[calc(100%-60px)] flex flex-col">
            {/* New Layer Form */}
            <div className="space-y-3 p-3 bg-slate-950/30 rounded-lg border border-slate-800 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Layer Name"
                  value={newLayer.name}
                  onChange={(e) => setNewLayer({...newLayer, name: e.target.value})}
                  className="bg-slate-900 border-slate-700 h-8 text-xs col-span-2"
                />
                <Input 
                  type="number"
                  placeholder="Top (m)"
                  value={newLayer.topDepth}
                  onChange={(e) => setNewLayer({...newLayer, topDepth: e.target.value})}
                  className="bg-slate-900 border-slate-700 h-8 text-xs"
                />
                <Input 
                  type="number"
                  placeholder="Base (m)"
                  value={newLayer.bottomDepth}
                  onChange={(e) => setNewLayer({...newLayer, bottomDepth: e.target.value})}
                  className="bg-slate-900 border-slate-700 h-8 text-xs"
                />
                <Input 
                  type="number"
                  placeholder="Vel (m/s)"
                  value={newLayer.velocity}
                  onChange={(e) => setNewLayer({...newLayer, velocity: e.target.value})}
                  className="bg-slate-900 border-slate-700 h-8 text-xs"
                />
                <Input 
                  type="number"
                  placeholder="Grad (1/s)"
                  value={newLayer.gradient}
                  onChange={(e) => setNewLayer({...newLayer, gradient: e.target.value})}
                  className="bg-slate-900 border-slate-700 h-8 text-xs"
                />
              </div>
              <Button 
                size="sm" 
                onClick={addLayer}
                className="w-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-300 h-8 text-xs uppercase tracking-wider border border-emerald-600/20"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Interval
              </Button>
            </div>

            {/* Layer List */}
            <ScrollArea className="flex-1 pr-3">
              <div className="space-y-2">
                {modelData.layers.length === 0 ? (
                   <div className="text-center py-8 text-slate-500 text-sm italic">
                     No layers added yet.
                   </div>
                ) : (
                  modelData.layers.map((layer, idx) => (
                    <motion.div 
                      key={layer.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="text-slate-500 cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-white truncate">{layer.name}</div>
                          <div className="text-xs text-slate-400 flex gap-2">
                            <span>{layer.topDepth}-{layer.bottomDepth}m</span>
                            <span className="text-emerald-400">{layer.velocity} m/s</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLayer(layer.id)}
                        className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 mt-auto bg-slate-950 border-t border-slate-800">
        <Button 
          onClick={onCalculate}
          disabled={loading || modelData.layers.length === 0}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold"
        >
          {loading ? (
            <span className="flex items-center">
               Processing...
            </span>
          ) : (
            <span className="flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Build Model
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default InputPanel;