import React, { useState, useEffect } from 'react';
import { useExpertMode } from '../../contexts/ExpertModeContext';
import { useMEM } from '../../contexts/MEMContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Save, RotateCcw, AlertCircle, FlaskConical, LineChart, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PropertyEditor = ({ stratigraphy = [], onUpdateLayer }) => {
    const { state: expertState, setActiveLayer } = useExpertMode();
    const { state: memState } = useMEM();
    const { activeLayerId } = expertState;
    const { toast } = useToast();
    
    // Local state for property editing
    const [activeZone, setActiveZone] = useState(null);
    const [depthRange, setDepthRange] = useState({ top: 0, base: 1000 });
    const [labData, setLabData] = useState([]);
    const [correlations, setCorrelations] = useState({
        ucs: 'bradford',
        friction: 'lal',
        poisson: 'brocher'
    });
    const [overrides, setOverrides] = useState({
        ucs_mult: 1.0,
        friction_add: 0,
        poisson_add: 0
    });

    useEffect(() => {
        // If stratigraphy is passed, find active layer
        if (activeLayerId && stratigraphy.length > 0) {
            const layer = stratigraphy.find(l => l.id === activeLayerId);
            if (layer) {
                setActiveZone(layer);
                setDepthRange({ top: layer.top || 0, base: layer.base || 1000 });
            }
        } else if (stratigraphy.length > 0) {
            // Default to first layer if none active
            setActiveZone(stratigraphy[0]);
            setDepthRange({ top: stratigraphy[0].top || 0, base: stratigraphy[0].base || 1000 });
            setActiveLayer(stratigraphy[0].id);
        }
    }, [activeLayerId, stratigraphy, setActiveLayer]);

    const handleCorrelationChange = (type, value) => {
        setCorrelations(prev => ({ ...prev, [type]: value }));
    };

    const handleOverrideChange = (type, value) => {
        setOverrides(prev => ({ ...prev, [type]: parseFloat(value) }));
    };

    const handleAddLabPoint = () => {
        const newPoint = { 
            id: Date.now(), 
            depth: depthRange.top + (depthRange.base - depthRange.top)/2, 
            type: 'UCS', 
            value: 50 
        };
        setLabData([...labData, newPoint]);
    };

    const handleUpdateLabPoint = (id, field, value) => {
        setLabData(labData.map(p => p.id === id ? { ...p, [field]: field === 'type' ? value : parseFloat(value) } : p));
    };

    const handleDeleteLabPoint = (id) => {
        setLabData(labData.filter(p => p.id !== id));
    };

    const handleSave = async () => {
        // In a real app, this would call an API/Supabase
        toast({ 
            title: "Properties Updated", 
            description: `Applied changes to ${activeZone?.name || 'current zone'} (${depthRange.top}-${depthRange.base}m)`,
        });
        if (onUpdateLayer && activeZone) {
            onUpdateLayer({
                ...activeZone,
                properties: { correlations, overrides, labData }
            });
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-white">Property Editor</h2>
                        <p className="text-xs text-slate-400">Customize rock mechanical properties</p>
                    </div>
                    {activeZone && (
                        <div className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                            Active Zone: {activeZone.name}
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                            setOverrides({ ucs_mult: 1.0, friction_add: 0, poisson_add: 0 });
                            toast({ title: "Reset", description: "Overrides reset to default." });
                        }}
                        className="h-8 text-xs"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={handleSave}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Save className="w-3 h-3 mr-1" /> Apply Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* Sidebar Controls */}
                <div className="w-80 border-r border-slate-800 overflow-y-auto bg-slate-900/20 p-4 space-y-6">
                    
                    {/* Depth Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Depth Interval</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Top (m)</Label>
                                <Input 
                                    type="number" 
                                    value={depthRange.top}
                                    onChange={(e) => setDepthRange({...depthRange, top: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-800 font-mono text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-slate-500">Base (m)</Label>
                                <Input 
                                    type="number" 
                                    value={depthRange.base}
                                    onChange={(e) => setDepthRange({...depthRange, base: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-800 font-mono text-xs"
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <Slider 
                                defaultValue={[depthRange.top, depthRange.base]} 
                                min={0} max={5000} step={10}
                                onValueChange={([t, b]) => setDepthRange({ top: t, base: b })}
                                className="my-2"
                            />
                        </div>
                    </div>

                    {/* Correlations */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Correlation Models</Label>
                        
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">UCS Model</Label>
                            <Select value={correlations.ucs} onValueChange={(v) => handleCorrelationChange('ucs', v)}>
                                <SelectTrigger className="h-8 bg-slate-950 border-slate-800 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bradford">Bradford (Density)</SelectItem>
                                    <SelectItem value="horsrud">Horsrud (Porosity)</SelectItem>
                                    <SelectItem value="mcnally">McNally (Sonic)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Friction Angle</Label>
                            <Select value={correlations.friction} onValueChange={(v) => handleCorrelationChange('friction', v)}>
                                <SelectTrigger className="h-8 bg-slate-950 border-slate-800 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lal">Lal (Vp)</SelectItem>
                                    <SelectItem value="plumb">Plumb (Porosity)</SelectItem>
                                    <SelectItem value="constant">Constant (30°)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Poisson's Ratio</Label>
                            <Select value={correlations.poisson} onValueChange={(v) => handleCorrelationChange('poisson', v)}>
                                <SelectTrigger className="h-8 bg-slate-950 border-slate-800 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="brocher">Brocher (Vp/Vs)</SelectItem>
                                    <SelectItem value="dynamic_static">Dynamic to Static</SelectItem>
                                    <SelectItem value="constant">Constant (0.25)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Manual Overrides */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Check className="w-3 h-3 text-emerald-500" /> Calibrate / Override
                        </Label>
                        
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <Label className="text-xs text-slate-400">UCS Multiplier</Label>
                            <Input 
                                type="number" step="0.05"
                                value={overrides.ucs_mult}
                                onChange={(e) => handleOverrideChange('ucs_mult', e.target.value)}
                                className="h-8 bg-slate-950 border-slate-800 font-mono text-xs text-right"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <Label className="text-xs text-slate-400">Friction Adder (+deg)</Label>
                            <Input 
                                type="number" step="1"
                                value={overrides.friction_add}
                                onChange={(e) => handleOverrideChange('friction_add', e.target.value)}
                                className="h-8 bg-slate-950 border-slate-800 font-mono text-xs text-right"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    <Tabs defaultValue="lab_data">
                        <TabsList className="bg-slate-900 border border-slate-800">
                            <TabsTrigger value="lab_data" className="text-xs"><FlaskConical className="w-3 h-3 mr-2"/> Lab Data</TabsTrigger>
                            <TabsTrigger value="preview" className="text-xs"><LineChart className="w-3 h-3 mr-2"/> Visual Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="lab_data" className="mt-4">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardContent className="p-0">
                                    <div className="p-4 flex justify-between items-center border-b border-slate-800">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-200">Core Lab Data Points</h3>
                                            <p className="text-xs text-slate-500">Add measured data to calibrate curves.</p>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={handleAddLabPoint} className="h-8 text-xs">
                                            + Add Point
                                        </Button>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-slate-950/50">
                                            <TableRow className="border-slate-800 hover:bg-transparent">
                                                <TableHead className="h-8 text-xs w-[100px]">Depth (m)</TableHead>
                                                <TableHead className="h-8 text-xs w-[120px]">Parameter</TableHead>
                                                <TableHead className="h-8 text-xs">Value</TableHead>
                                                <TableHead className="h-8 text-xs w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {labData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-xs text-slate-500 italic">
                                                        No lab data added yet.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                labData.map(point => (
                                                    <TableRow key={point.id} className="border-slate-800 hover:bg-slate-800/50">
                                                        <TableCell className="p-2">
                                                            <Input 
                                                                type="number" 
                                                                value={point.depth} 
                                                                onChange={(e) => handleUpdateLabPoint(point.id, 'depth', e.target.value)}
                                                                className="h-7 bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 text-xs font-mono"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="p-2">
                                                            <Select value={point.type} onValueChange={(v) => handleUpdateLabPoint(point.id, 'type', v)}>
                                                                <SelectTrigger className="h-7 bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 text-xs"><SelectValue/></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="UCS">UCS (MPa)</SelectItem>
                                                                    <SelectItem value="FANG">Friction Ang (deg)</SelectItem>
                                                                    <SelectItem value="PR">Poisson Ratio</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell className="p-2">
                                                            <Input 
                                                                type="number" 
                                                                value={point.value} 
                                                                onChange={(e) => handleUpdateLabPoint(point.id, 'value', e.target.value)}
                                                                className="h-7 bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 text-xs font-mono"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="p-2 text-right">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-6 w-6 p-0 hover:text-red-400"
                                                                onClick={() => handleDeleteLabPoint(point.id)}
                                                            >
                                                                &times;
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preview" className="mt-4">
                            <Card className="bg-slate-900 border-slate-800 h-[400px] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1621193677219-362513002421?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                                <div className="text-center z-10">
                                    <LineChart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                    <h3 className="text-slate-400 font-semibold">Correlation Preview</h3>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                                        Visualization of UCS, Friction Angle, and Poisson's Ratio logs vs Lab Data will appear here.
                                    </p>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default PropertyEditor;