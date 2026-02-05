import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileText, Database, HardDrive } from 'lucide-react';

const DataManagementPanel = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <HardDrive className="w-4 h-4 mr-2 text-yellow-400" /> Data I/O
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="import">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-950 h-8 mb-4">
                        <TabsTrigger value="import" className="text-xs">Import</TabsTrigger>
                        <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
                    </TabsList>

                    <TabsContent value="import" className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs border-slate-700 hover:bg-slate-800">
                            <FileText className="w-3 h-3 mr-2 text-green-400" /> Import LAS (Wells)
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs border-slate-700 hover:bg-slate-800">
                            <Database className="w-3 h-3 mr-2 text-blue-400" /> Import SEG-Y (Seismic)
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs border-slate-700 hover:bg-slate-800">
                            <Upload className="w-3 h-3 mr-2 text-purple-400" /> Import Shapefile/GeoJSON
                        </Button>
                        <div className="p-2 bg-slate-950/50 rounded text-[10px] text-slate-500 border border-slate-800 border-dashed mt-2">
                            Drag & drop files directly into the viewport for quick import.
                        </div>
                    </TabsContent>

                    <TabsContent value="export" className="space-y-2">
                         <Button variant="outline" size="sm" className="w-full justify-start text-xs border-slate-700 hover:bg-slate-800">
                            <Download className="w-3 h-3 mr-2 text-slate-400" /> Export Project Archive
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs border-slate-700 hover:bg-slate-800">
                            <FileText className="w-3 h-3 mr-2 text-slate-400" /> Export Interpreted Tops
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs border-slate-700 hover:bg-slate-800">
                            <Database className="w-3 h-3 mr-2 text-slate-400" /> Export Structural Model (ResqML)
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default DataManagementPanel;