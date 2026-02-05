import React, { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Presentation, Database, Share2, Workflow } from 'lucide-react';

import ReportGenerator from './ReportGenerator';
import PowerPointExporter from './PowerPointExporter';
import DataExportPanel from './DataExportPanel';
import EcosystemIntegrationPanel from './EcosystemIntegrationPanel';
import WorkflowAutomationPanel from './WorkflowAutomationPanel';
import StakeholderCommunicationPanel from './StakeholderCommunicationPanel';
import ReportPreview from './ReportPreview';
import ExportProgressTracker from './ExportProgressTracker';
import ChartQCTab from './ChartQCTab';

const Phase6ExportIntegration = ({ data }) => {
    
    // Determine if we have data to show
    const hasData = data && data.depths && data.depths.length > 0;

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden">
            {/* Left Config Column */}
            <div className="w-80 flex flex-col border-r border-slate-800 bg-slate-950 shrink-0">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-slate-100">Export & Integration</h2>
                    <p className="text-xs text-slate-500">Generate reports and sync data</p>
                </div>
                
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Actions</h3>
                            <ReportGenerator data={data} />
                            <PowerPointExporter data={data} />
                            <DataExportPanel data={data} />
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Middle Workspace (Preview/Status) */}
            <div className="flex-1 flex flex-col bg-slate-900">
                <Tabs defaultValue="chart" className="flex-1 flex flex-col">
                    <div className="px-4 py-2 border-b border-slate-800 flex gap-2 bg-slate-950">
                        <TabsList className="bg-slate-900 border border-slate-800">
                            <TabsTrigger value="chart" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs">
                                <Presentation className="w-3.5 h-3.5 mr-2"/> Chart QC
                            </TabsTrigger>
                            <TabsTrigger value="report" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-xs">
                                <FileText className="w-3.5 h-3.5 mr-2"/> Report Preview
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <div className="flex-1 p-0 overflow-hidden relative bg-slate-950">
                        <TabsContent value="chart" className="h-full m-0 p-0">
                            {/* Well Log QC Visualization */}
                            <ChartQCTab data={data} />
                        </TabsContent>
                        <TabsContent value="report" className="h-full m-0 p-8 overflow-y-auto bg-slate-900">
                            <ReportPreview />
                        </TabsContent>
                    </div>
                </Tabs>
                <ExportProgressTracker progress={hasData ? 100 : 0} status={hasData ? "Ready to export" : "Waiting for data"} />
            </div>

            {/* Right Integration Column */}
            <div className="w-72 flex flex-col border-l border-slate-800 bg-slate-950 shrink-0">
                <Tabs defaultValue="ecosystem" className="flex-1 flex flex-col">
                    <div className="p-2 border-b border-slate-800">
                        <TabsList className="w-full bg-slate-900 border border-slate-800">
                            <TabsTrigger value="ecosystem" className="flex-1 text-[10px] h-7"><Database className="w-3 h-3 mr-1"/> Sync</TabsTrigger>
                            <TabsTrigger value="workflow" className="flex-1 text-[10px] h-7"><Workflow className="w-3 h-3 mr-1"/> Flows</TabsTrigger>
                            <TabsTrigger value="comms" className="flex-1 text-[10px] h-7"><Share2 className="w-3 h-3 mr-1"/> Share</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                        <TabsContent value="ecosystem" className="h-full m-0">
                            <EcosystemIntegrationPanel data={data} />
                        </TabsContent>
                        <TabsContent value="workflow" className="h-full m-0">
                            <WorkflowAutomationPanel />
                        </TabsContent>
                        <TabsContent value="comms" className="h-full m-0">
                            <StakeholderCommunicationPanel />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default Phase6ExportIntegration;