import React, { useState } from 'react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Target, MousePointerClick, Circle, Activity } from 'lucide-react';
import { PolygonClippingEngine } from '../../services/PolygonClippingEngine';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

const PolygonManagerPanel = ({ onStartDrawing }) => {
    const { state, addPolygon, deletePolygon, setActiveAoi } = useReservoirCalc();
    const { toast } = useToast();
    
    // Circle Creation State
    const [circleParams, setCircleParams] = useState({ x: 0, y: 0, r: 1000, pts: 36 });
    const [circleName, setCircleName] = useState('New Circle');

    const handleCreateCircle = () => {
        const vertices = PolygonClippingEngine.generateCircle(
            parseFloat(circleParams.x), 
            parseFloat(circleParams.y), 
            parseFloat(circleParams.r), 
            parseInt(circleParams.pts)
        );
        
        const area = PolygonClippingEngine.calculatePolygonArea(vertices);
        
        addPolygon({
            id: uuidv4(),
            name: circleName || 'Circle',
            type: 'circle',
            vertices,
            area,
            color: '#22c55e' // default green
        });
        
        toast({ title: "Circle Created", description: `Area: ${area.toFixed(0)} units²` });
    };

    const formatArea = (area) => {
        const isField = state.unitSystem === 'field';
        if (isField) {
            // sq ft to acres
            return `${(area / 43560).toFixed(2)} acres`;
        } else {
            // sq m to km2
            return `${(area / 1e6).toFixed(3)} km²`;
        }
    };

    return (
        <div className="h-full flex flex-col p-4 space-y-4 bg-slate-950">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" /> Polygons / AOI
                </h3>
            </div>

            <Tabs defaultValue="list" className="flex-1 flex flex-col">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="list" className="text-xs">Manage</TabsTrigger>
                    <TabsTrigger value="draw" className="text-xs">Draw</TabsTrigger>
                    <TabsTrigger value="create" className="text-xs">Create</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="flex-1 min-h-0 mt-4">
                    <ScrollArea className="h-[300px] pr-4">
                        {state.polygons.length === 0 ? (
                            <div className="text-center text-slate-500 py-8 text-xs">
                                No polygons defined. Draw or create one.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {state.polygons.map(p => {
                                    const isAoi = state.activeAoiId === p.id;
                                    return (
                                        <Card key={p.id} className={`p-2 bg-slate-900 border ${isAoi ? 'border-purple-500' : 'border-slate-800'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-bold text-sm text-slate-200">{p.name}</div>
                                                    <div className="text-[10px] text-slate-500">Type: {p.type}</div>
                                                    <div className="text-[10px] text-emerald-400">{formatArea(p.area)}</div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 hover:bg-red-950 hover:text-red-400"
                                                    onClick={() => deletePolygon(p.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant={isAoi ? "default" : "outline"}
                                                className={`w-full h-7 text-xs ${isAoi ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                                onClick={() => setActiveAoi(isAoi ? null : p.id)}
                                            >
                                                {isAoi ? "Active AOI" : "Set as AOI"}
                                            </Button>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="draw" className="mt-4 space-y-4">
                    <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 text-center space-y-4">
                        <MousePointerClick className="w-10 h-10 mx-auto text-blue-400 opacity-80" />
                        <div>
                            <h4 className="text-sm font-medium text-white">Interactive Drawing</h4>
                            <p className="text-xs text-slate-400 mt-1">Click points on the map to define a polygon. Double click to close.</p>
                        </div>
                        <Button onClick={onStartDrawing} className="w-full bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" /> Start Drawing
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="create" className="mt-4 space-y-3">
                    <div className="space-y-2">
                        <Label className="text-xs">Name</Label>
                        <Input value={circleName} onChange={e => setCircleName(e.target.value)} className="h-8 bg-slate-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Center X</Label>
                            <Input type="number" value={circleParams.x} onChange={e => setCircleParams({...circleParams, x: e.target.value})} className="h-8 bg-slate-900" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Center Y</Label>
                            <Input type="number" value={circleParams.y} onChange={e => setCircleParams({...circleParams, y: e.target.value})} className="h-8 bg-slate-900" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Radius</Label>
                            <Input type="number" value={circleParams.r} onChange={e => setCircleParams({...circleParams, r: e.target.value})} className="h-8 bg-slate-900" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Points</Label>
                            <Input type="number" value={circleParams.pts} onChange={e => setCircleParams({...circleParams, pts: e.target.value})} className="h-8 bg-slate-900" />
                        </div>
                    </div>
                    <Button onClick={handleCreateCircle} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2">
                        <Circle className="w-4 h-4 mr-2" /> Create Circle
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PolygonManagerPanel;