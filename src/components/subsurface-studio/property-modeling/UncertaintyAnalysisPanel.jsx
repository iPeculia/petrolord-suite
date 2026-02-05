import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Dna } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UncertaintyAnalysisPanel = () => {
    const [iterations, setIterations] = useState(1000);
    
    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-purple-400">
                    <Dna className="w-4 h-4 mr-2" /> Uncertainty & Risk
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="setup">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800 h-8 mb-2">
                        <TabsTrigger value="setup" className="text-xs py-1">Setup</TabsTrigger>
                        <TabsTrigger value="results" className="text-xs py-1">Results</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="setup" className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Iterations</Label>
                            <Input 
                                type="number" value={iterations} 
                                onChange={e => setIterations(parseInt(e.target.value))}
                                className="h-8 bg-slate-800 border-slate-700 text-xs"
                            />
                        </div>
                        
                        <div className="p-2 bg-slate-950 rounded border border-slate-800 text-xs space-y-2">
                            <div className="font-semibold text-slate-300 mb-1">Variables (±20%)</div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700"/>
                                <span>Porosity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700"/>
                                <span>Water Saturation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700"/>
                                <span>GRV (Structure)</span>
                            </div>
                        </div>

                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs" size="sm">
                            <BarChart3 className="w-3 h-3 mr-2" /> Run Monte Carlo
                        </Button>
                    </TabsContent>

                    <TabsContent value="results">
                         <div className="flex items-center justify-center h-32 text-xs text-slate-500 italic bg-slate-950 rounded border border-slate-800 border-dashed">
                            Run analysis to view P10/P50/P90 results.
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default UncertaintyAnalysisPanel;