import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTankSetupTab from './tabs/DataTankSetupTab';
import DiagnosticsTab from './tabs/DiagnosticsTab';
import ModelsContactsTab from './tabs/ModelsContactsTab';
import ForecastScenariosTab from './tabs/ForecastScenariosTab';
import ContactForecastTab from './tabs/ContactForecastTab';
import ExportLinksTab from './tabs/ExportLinksTab';

const MBTabs = () => {
  return (
    <Tabs defaultValue="setup" className="w-full h-full flex flex-col">
      <div className="px-4 border-b border-slate-800 bg-slate-900/50">
        <TabsList className="h-10 bg-transparent p-0 w-auto justify-start overflow-x-auto no-scrollbar flex-nowrap">
          <TabsTrigger 
            value="setup" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-slate-400 text-xs px-4 h-10 whitespace-nowrap"
          >
            Data & Tank Setup
          </TabsTrigger>
          <TabsTrigger 
            value="diagnostics" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-slate-400 text-xs px-4 h-10 whitespace-nowrap"
          >
            Diagnostics
          </TabsTrigger>
          <TabsTrigger 
            value="models" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-slate-400 text-xs px-4 h-10 whitespace-nowrap"
          >
            Models & Fitting
          </TabsTrigger>
          <TabsTrigger 
            value="forecast" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-slate-400 text-xs px-4 h-10 whitespace-nowrap"
          >
            Forecast & Scenarios
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-slate-400 text-xs px-4 h-10 whitespace-nowrap"
          >
            Fluid Contacts
          </TabsTrigger>
          <TabsTrigger 
            value="export" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-slate-400 text-xs px-4 h-10 whitespace-nowrap"
          >
            Export & Links
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950">
        <TabsContent value="setup" className="h-full m-0 p-0 border-none">
          <DataTankSetupTab />
        </TabsContent>
        <TabsContent value="diagnostics" className="h-full m-0 p-0 border-none">
          <DiagnosticsTab />
        </TabsContent>
        <TabsContent value="models" className="h-full m-0 p-0 border-none">
          <ModelsContactsTab />
        </TabsContent>
        <TabsContent value="forecast" className="h-full m-0 p-0 border-none">
          <ForecastScenariosTab />
        </TabsContent>
        <TabsContent value="contacts" className="h-full m-0 p-0 border-none">
          <ContactForecastTab />
        </TabsContent>
        <TabsContent value="export" className="h-full m-0 p-0 border-none">
          <ExportLinksTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MBTabs;