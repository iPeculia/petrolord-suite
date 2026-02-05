import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WellSelectionPanel from './WellSelectionPanel';
import { FolderOpen, Filter } from 'lucide-react';

const LeftSidebar = ({ width }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800" style={{ width }}>
      <Tabs defaultValue="wells" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-slate-800 bg-slate-950 p-0 h-10">
          <TabsTrigger 
            value="wells" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-slate-900 text-xs h-10 text-slate-400 data-[state=active]:text-blue-400 transition-all"
          >
            <FolderOpen className="w-3 h-3 mr-1.5" /> Project Wells
          </TabsTrigger>
          <TabsTrigger 
            value="filters" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-slate-900 text-xs h-10 text-slate-400 data-[state=active]:text-blue-400 transition-all"
          >
            <Filter className="w-3 h-3 mr-1.5" /> Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wells" className="flex-1 p-0 overflow-hidden data-[state=inactive]:hidden">
          <WellSelectionPanel />
        </TabsContent>
        
        <TabsContent value="filters" className="flex-1 p-4 overflow-y-auto bg-slate-900 data-[state=inactive]:hidden text-slate-500 text-xs text-center italic">
          Advanced filtering options coming soon.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftSidebar;