import React, { useState } from 'react';
import { FileOutput, Check, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ModelExportManager = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileOutput className="w-4 h-4 text-blue-400"/> Unified Export Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="formats" className="space-y-4">
            <TabsList className="w-full bg-slate-950 border border-slate-800">
                <TabsTrigger value="formats" className="flex-1 text-xs">Format Selection</TabsTrigger>
                <TabsTrigger value="objects" className="flex-1 text-xs">Object Selection</TabsTrigger>
                <TabsTrigger value="presets" className="flex-1 text-xs">Presets</TabsTrigger>
            </TabsList>

            <TabsContent value="formats" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 border border-slate-800 rounded p-3 bg-slate-950/50">
                        <Label className="text-xs font-bold text-slate-300 mb-2 block">Velocity Functions</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fmt-las" defaultChecked/>
                                <Label htmlFor="fmt-las" className="text-xs text-slate-400">LAS 2.0 (.las)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fmt-csv" />
                                <Label htmlFor="fmt-csv" className="text-xs text-slate-400">CSV Table (.csv)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fmt-petrel" />
                                <Label htmlFor="fmt-petrel" className="text-xs text-slate-400">Petrel ASCII</Label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 border border-slate-800 rounded p-3 bg-slate-950/50">
                        <Label className="text-xs font-bold text-slate-300 mb-2 block">Depth Maps / Grids</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fmt-zmap" defaultChecked/>
                                <Label htmlFor="fmt-zmap" className="text-xs text-slate-400">ZMAP+ (.dat)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fmt-rescue" />
                                <Label htmlFor="fmt-rescue" className="text-xs text-slate-400">RESQML (.epc)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="fmt-segy" />
                                <Label htmlFor="fmt-segy" className="text-xs text-slate-400">Velocity Cube (SEG-Y)</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-slate-800 rounded bg-slate-950 hover:bg-slate-900 cursor-pointer">
                    <span className="text-sm font-medium text-slate-300">Standard Petrel Export</span>
                    <Button size="sm" variant="ghost"><Check className="w-4 h-4"/></Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-800 rounded bg-slate-950 hover:bg-slate-900 cursor-pointer">
                    <span className="text-sm font-medium text-slate-300">Kingdom Suite Compatible</span>
                    <Button size="sm" variant="ghost"></Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-800 rounded bg-slate-950 hover:bg-slate-900 cursor-pointer">
                    <span className="text-sm font-medium text-slate-300">Dug Insight (Vel Volume)</span>
                    <Button size="sm" variant="ghost"></Button>
                </div>
            </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Settings className="w-3 h-3" />
                <span>Exporting to project folder /exports</span>
            </div>
            <Button onClick={handleExport} disabled={isExporting} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]">
                {isExporting ? 'Exporting...' : 'Export Selected'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelExportManager;