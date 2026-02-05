import React from 'react';
import { FileCode, Copy, Terminal, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const pythonSnippet = `# Petrel Python Script to Import Facies Flags
from Petrel import *

well_name = "Well-A01"
facies_path = r"C:\\Data\\Exports\\Well-A01_Facies.csv"

project = PetrelProject.primary_project
well = project.get_well(well_name)

# Create Discrete Log
log = well.create_log("FACIES_FINAL", "Discrete")
log.import_from_csv(facies_path)
print(f"Imported Facies for {well_name}")
`;

const PetrelTechlogExporter = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-base">
                    <FileCode className="w-4 h-4 text-blue-400" /> Industry Export
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <Tabs defaultValue="petrel" className="h-full flex flex-col">
                    <div className="px-4 pt-4">
                        <TabsList className="bg-slate-950 border-slate-800 w-full justify-start">
                            <TabsTrigger value="petrel">Petrel</TabsTrigger>
                            <TabsTrigger value="techlog">Techlog</TabsTrigger>
                            <TabsTrigger value="generic">Generic LAS</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="petrel" className="flex-1 p-4 space-y-4">
                        <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-4">
                            <h4 className="text-sm font-medium text-white">1. Download Formatted Data</h4>
                            <p className="text-xs text-slate-400">Downloads a CSV formatted specifically for Petrel's "Points with Attributes" or "Well Log" importer.</p>
                            <Button className="w-full bg-blue-700 hover:bg-blue-600">Download .CSV (Petrel Format)</Button>
                        </div>
                        
                        <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 flex-1">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-white flex items-center gap-2"><Terminal className="w-3 h-3"/> Ocean / Python Script</h4>
                                <Button size="xs" variant="ghost"><Copy className="w-3 h-3 mr-1"/> Copy</Button>
                            </div>
                            <ScrollArea className="h-32 bg-slate-900 rounded p-2 border border-slate-800">
                                <pre className="text-[10px] font-mono text-green-400">
                                    {pythonSnippet}
                                </pre>
                            </ScrollArea>
                        </div>
                    </TabsContent>

                    <TabsContent value="techlog" className="flex-1 p-4 flex items-center justify-center text-slate-500 text-sm">
                        Techlog (DLIS) export module coming soon.
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PetrelTechlogExporter;