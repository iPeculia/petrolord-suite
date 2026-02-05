import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileOutput, Grid, Activity, BookOpen, Cog } from 'lucide-react';

// Sub-components
import PetrelExporter from './PetrelExporter';
import KingdomExporter from './KingdomExporter';
import EclipseSimulationExporter from './EclipseSimulationExporter';
import CMGSimulationExporter from './CMGSimulationExporter';
import StandardGridExporter from './StandardGridExporter';
import ColorTableGenerator from './ColorTableGenerator';
import VelocityFunctionExporter from './VelocityFunctionExporter';
import BatchExportManager from './BatchExportManager';
import ImportTemplateLibrary from './ImportTemplateLibrary';
import ExportFormatValidator from './ExportFormatValidator';

const ExternalToolsExportHub = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
        <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/50 p-1">
            <Tabs defaultValue="industry" className="w-full h-full flex flex-col">
                <div className="px-2 mb-2">
                    <TabsList className="w-full justify-start h-9 bg-transparent p-0 gap-1">
                        <TabsTrigger value="industry" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 border border-transparent data-[state=active]:border-slate-700">
                            <FileOutput className="w-3 h-3 mr-2" /> Industry Formats
                        </TabsTrigger>
                        <TabsTrigger value="simulation" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 border border-transparent data-[state=active]:border-slate-700">
                            <Grid className="w-3 h-3 mr-2" /> Simulation
                        </TabsTrigger>
                        <TabsTrigger value="generic" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                            <Activity className="w-3 h-3 mr-2" /> Generic & Utils
                        </TabsTrigger>
                        <TabsTrigger value="batch" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-orange-400 border border-transparent data-[state=active]:border-slate-700">
                            <Cog className="w-3 h-3 mr-2" /> Batch & Validation
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-300 border border-transparent data-[state=active]:border-slate-700">
                            <BookOpen className="w-3 h-3 mr-2" /> Guides
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-950 relative p-4">
                    <TabsContent value="industry" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <PetrelExporter />
                            <KingdomExporter />
                        </div>
                    </TabsContent>

                    <TabsContent value="simulation" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <EclipseSimulationExporter />
                            <CMGSimulationExporter />
                        </div>
                    </TabsContent>

                    <TabsContent value="generic" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-1"><StandardGridExporter /></div>
                            <div className="md:col-span-1"><ColorTableGenerator /></div>
                            <div className="md:col-span-1"><VelocityFunctionExporter /></div>
                        </div>
                    </TabsContent>

                    <TabsContent value="batch" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-2"><BatchExportManager /></div>
                            <div className="md:col-span-1"><ExportFormatValidator /></div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="docs" className="h-full m-0 overflow-y-auto">
                        <ImportTemplateLibrary />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    </div>
  );
};

export default ExternalToolsExportHub;