import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, FileText, GitCommit, ArrowUpRight } from 'lucide-react';
import CorrelationPanelTab from './CorrelationPanelTab';
import DataTab from './DataTab';
import HorizonsMarkersTab from './HorizonsMarkersTab';
import ExportLinksTab from './ExportLinksTab';

const WellCorrelationTabs = () => {
  return (
    <Tabs defaultValue="correlation" className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <div className="bg-slate-950 border-b border-slate-800 px-4 shrink-0">
        <TabsList className="bg-transparent h-10 p-0 space-x-6">
          <TabsTrigger 
            value="data" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 px-0 pb-0 text-slate-400 data-[state=active]:text-blue-400 hover:text-slate-200 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" /> Data Management
          </TabsTrigger>
          <TabsTrigger 
            value="correlation" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 px-0 pb-0 text-slate-400 data-[state=active]:text-blue-400 hover:text-slate-200 transition-colors"
          >
            <GitCommit className="w-4 h-4 mr-2" /> Correlation Panel
          </TabsTrigger>
          <TabsTrigger 
            value="horizons" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 px-0 pb-0 text-slate-400 data-[state=active]:text-blue-400 hover:text-slate-200 transition-colors"
          >
            <Layers className="w-4 h-4 mr-2" /> Horizons & Markers
          </TabsTrigger>
          <TabsTrigger 
            value="export" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 px-0 pb-0 text-slate-400 data-[state=active]:text-blue-400 hover:text-slate-200 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" /> Export & Links
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Force content to take remaining height and handle overflow internally */}
      <div className="flex-1 overflow-hidden relative">
        <TabsContent value="data" className="h-full w-full m-0 p-0 data-[state=inactive]:hidden">
          <DataTab />
        </TabsContent>
        
        <TabsContent value="correlation" className="h-full w-full m-0 p-0 data-[state=inactive]:hidden">
          <CorrelationPanelTab />
        </TabsContent>
        
        <TabsContent value="horizons" className="h-full w-full m-0 p-0 data-[state=inactive]:hidden">
          <HorizonsMarkersTab />
        </TabsContent>
        
        <TabsContent value="export" className="h-full w-full m-0 p-0 data-[state=inactive]:hidden">
          <ExportLinksTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default WellCorrelationTabs;