import React from 'react';
import { MoveVertical, AlignCenterVertical, ArrowDownUp, Ruler, GitCompare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DepthAlignmentTools = () => {
    return (
        <div className="h-full flex flex-col space-y-4">
            <Tabs defaultValue="shift" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start">
                    <TabsTrigger value="shift">Bulk Shift</TabsTrigger>
                    <TabsTrigger value="stretch">Stretch & Squeeze</TabsTrigger>
                    <TabsTrigger value="core">Core Alignment</TabsTrigger>
                </TabsList>

                <TabsContent value="shift" className="mt-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MoveVertical className="w-4 h-4 text-blue-400" />
                                Bulk Depth Shift
                            </CardTitle>
                            <CardDescription>Apply constant shift to match reference logs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Target Curves</Label>
                                    <div className="p-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-300">
                                        GR, RHOB, NPHI
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Shift Amount (m)</Label>
                                    <div className="flex gap-2">
                                        <Input type="number" placeholder="0.00" className="bg-slate-950 border-slate-700" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-950 border border-dashed border-slate-700 rounded text-xs text-slate-500 text-center">
                                Preview: Shift Visualization Placeholder
                            </div>
                            <Button className="w-full">Apply Shift</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stretch" className="mt-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlignCenterVertical className="w-4 h-4 text-orange-400" />
                                Elastic Alignment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-slate-500 flex flex-col items-center">
                                <GitCompare className="w-12 h-12 mb-3 opacity-30" />
                                <p className="mb-4">Define anchor points on the log viewer to perform stretch/squeeze operations.</p>
                                <Button variant="outline">Enter Interactive Mode</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DepthAlignmentTools;