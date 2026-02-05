import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Box, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GridDesigner = ({ activeProject }) => {
    const { toast } = useToast();
    const [gridDef, setGridDef] = useState({
        name: 'New 3D Grid',
        nx: 50, ny: 50, nz: 20,
        minX: 0, maxX: 10000,
        minY: 0, maxY: 10000,
        minZ: 1000, maxZ: 3000,
        rotation: 0
    });

    const handleSave = () => {
        toast({ title: "Grid Design Saved", description: `${gridDef.name} definition updated.` });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-full overflow-y-auto">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Box className="mr-2 h-5 w-5 text-green-500" /> Grid Definition
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Grid Name</Label>
                            <Input value={gridDef.name} onChange={e => setGridDef({...gridDef, name: e.target.value})} />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>NX</Label>
                                <Input type="number" value={gridDef.nx} onChange={e => setGridDef({...gridDef, nx: parseInt(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                                <Label>NY</Label>
                                <Input type="number" value={gridDef.ny} onChange={e => setGridDef({...gridDef, ny: parseInt(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                                <Label>NZ</Label>
                                <Input type="number" value={gridDef.nz} onChange={e => setGridDef({...gridDef, nz: parseInt(e.target.value)})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                            <div className="space-y-2">
                                <Label>Min X</Label>
                                <Input type="number" value={gridDef.minX} onChange={e => setGridDef({...gridDef, minX: parseFloat(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Max X</Label>
                                <Input type="number" value={gridDef.maxX} onChange={e => setGridDef({...gridDef, maxX: parseFloat(e.target.value)})} />
                            </div>
                             <div className="space-y-2">
                                <Label>Min Y</Label>
                                <Input type="number" value={gridDef.minY} onChange={e => setGridDef({...gridDef, minY: parseFloat(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Y</Label>
                                <Input type="number" value={gridDef.maxY} onChange={e => setGridDef({...gridDef, maxY: parseFloat(e.target.value)})} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button className="w-full" onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> Save Definition
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col space-y-6">
                 <Card className="border-slate-800 bg-slate-900 flex-1">
                    <CardHeader>
                        <CardTitle>Grid Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px] bg-slate-950 rounded-md m-6 border border-slate-800 border-dashed">
                        <div className="text-slate-500 text-sm">
                            2D Footprint Preview <br/>
                            <span className="text-xs">
                                {gridDef.maxX - gridDef.minX}m x {gridDef.maxY - gridDef.minY}m
                            </span>
                        </div>
                    </CardContent>
                 </Card>
                 
                 <Card className="border-slate-800 bg-slate-900">
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                         <div className="flex justify-between">
                             <span className="text-slate-400">Total Cells:</span>
                             <span className="font-mono">{gridDef.nx * gridDef.ny * gridDef.nz}</span>
                         </div>
                         <div className="flex justify-between">
                             <span className="text-slate-400">Est. Memory:</span>
                             <span className="font-mono">~{(gridDef.nx * gridDef.ny * gridDef.nz * 4 / 1024 / 1024).toFixed(2)} MB</span>
                         </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
};

export default GridDesigner;