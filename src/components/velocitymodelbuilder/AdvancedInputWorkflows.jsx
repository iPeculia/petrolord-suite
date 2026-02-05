import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Database, Check, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const FileUploadZone = ({ type, accept, label }) => (
    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:bg-slate-800/50 hover:border-slate-600 transition-colors cursor-pointer group">
        <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3 group-hover:text-blue-400 transition-colors" />
        <h4 className="text-sm font-medium text-slate-300">{label}</h4>
        <p className="text-xs text-slate-500 mt-1">Drag & drop or click to upload {accept}</p>
    </div>
);

const AdvancedInputWorkflows = () => {
  const { toast } = useToast();

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
        <CardHeader className="pb-2 border-b border-slate-800">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400"/> Data Ingestion
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <Tabs defaultValue="wells" className="h-full">
                <TabsList className="w-full bg-slate-950 border border-slate-800 mb-4">
                    <TabsTrigger value="wells" className="flex-1">Wells & Logs</TabsTrigger>
                    <TabsTrigger value="seismic" className="flex-1">Seismic & Grids</TabsTrigger>
                    <TabsTrigger value="tops" className="flex-1">Picks & Tops</TabsTrigger>
                </TabsList>

                <TabsContent value="wells" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FileUploadZone type="checkshot" accept=".csv, .txt, .las" label="Checkshots / VSP" />
                        <FileUploadZone type="sonic" accept=".las, .dlIS" label="Sonic / Density Logs" />
                    </div>
                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2">Recently Uploaded</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm p-2 bg-slate-900 rounded">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                    <span className="text-slate-300">Well-04_Checkshot.csv</span>
                                </div>
                                <span className="text-xs text-slate-500">2 mins ago</span>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="seismic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FileUploadZone type="velocities" accept=".segy, .txt" label="Stacking Velocities (Vnmo)" />
                        <FileUploadZone type="horizons" accept=".txt, .dat, .grd" label="Time Horizons / Grids" />
                    </div>
                </TabsContent>

                <TabsContent value="tops" className="space-y-4">
                    <FileUploadZone type="tops" accept=".csv, .txt" label="Well Tops / Markers" />
                    <div className="text-xs text-slate-500 mt-2 p-2 bg-blue-900/10 border border-blue-900/30 rounded">
                        Tip: Ensure columns are named 'Well', 'Surface', 'MD' or 'TVD' for auto-detection.
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
};

export default AdvancedInputWorkflows;