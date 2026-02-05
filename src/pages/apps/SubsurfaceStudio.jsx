import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudioProvider, useStudio } from '@/contexts/StudioContext';
import ProjectTreePanel from '@/components/subsurface-studio/ProjectTreePanel';
import MapView from '@/components/subsurface-studio/MapView';
import ThreeDWindow from '@/components/subsurface-studio/ThreeDWindow';
import CrossSectionView from '@/components/subsurface-studio/CrossSectionView';
import WellSectionView from '@/components/subsurface-studio/WellSectionView';
import CrossplotView from '@/components/subsurface-studio/CrossplotView';
import PlottingStudio from '@/components/subsurface-studio/PlottingStudio';
import StylePanel from '@/components/subsurface-studio/StylePanel';
import InterpretationPanel from '@/components/subsurface-studio/InterpretationPanel';
import { Layers, Palette, Pencil } from 'lucide-react';

const StudioMain = () => {
  const [rightPanelTab, setRightPanelTab] = useState('explorer');

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <header className="p-2 border-b border-slate-700">
        <h1 className="text-xl font-bold text-lime-300">Subsurface Studio</h1>
      </header>
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <ProjectTreePanel />
        </Panel>
        <PanelResizeHandle className="w-1.5 bg-slate-700 hover:bg-lime-500 transition-colors" />
        <Panel defaultSize={60} minSize={30}>
          <Tabs defaultValue="map" className="h-full flex flex-col">
            <TabsList className="bg-slate-800 border-b border-slate-700 rounded-none justify-start">
              <TabsTrigger value="3d">3D Window</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="cross_section">Cross Section</TabsTrigger>
              <TabsTrigger value="well_section">Well Section</TabsTrigger>
              <TabsTrigger value="crossplot">Crossplot</TabsTrigger>
              <TabsTrigger value="plotting">Plotting</TabsTrigger>
            </TabsList>
            <TabsContent value="3d" className="flex-grow bg-slate-950">
              <ThreeDWindow />
            </TabsContent>
            <TabsContent value="map" className="flex-grow bg-slate-950">
              <MapView />
            </TabsContent>
            <TabsContent value="cross_section" className="flex-grow bg-slate-950">
              <CrossSectionView />
            </TabsContent>
            <TabsContent value="well_section" className="flex-grow bg-slate-950">
              <WellSectionView />
            </TabsContent>
            <TabsContent value="crossplot" className="flex-grow bg-slate-950">
              <CrossplotView />
            </TabsContent>
            <TabsContent value="plotting" className="flex-grow bg-slate-950">
              <PlottingStudio />
            </TabsContent>
          </Tabs>
        </Panel>
        <PanelResizeHandle className="w-1.5 bg-slate-700 hover:bg-lime-500 transition-colors" />
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-b border-slate-700 rounded-none">
              <TabsTrigger value="explorer"><Layers className="w-4 h-4 mr-2"/> Explorer</TabsTrigger>
              <TabsTrigger value="style"><Palette className="w-4 h-4 mr-2"/> Style</TabsTrigger>
              <TabsTrigger value="interpretation"><Pencil className="w-4 h-4 mr-2"/> Interpretation</TabsTrigger>
            </TabsList>
            <TabsContent value="explorer" className="flex-grow bg-slate-800/50 p-2 overflow-y-auto">
              <div className="text-slate-400 p-4">Context panel for selected items will appear here.</div>
            </TabsContent>
            <TabsContent value="style" className="flex-grow bg-slate-800/50 p-2 overflow-y-auto">
              <StylePanel />
            </TabsContent>
            <TabsContent value="interpretation" className="flex-grow bg-slate-800/50 p-2 overflow-y-auto">
              <InterpretationPanel />
            </TabsContent>
          </Tabs>
        </Panel>
      </PanelGroup>
    </div>
  );
};

const SubsurfaceStudio = () => {
  return (
    <>
      <Helmet>
        <title>Subsurface Studio - Petrolord</title>
        <meta name="description" content="Integrated geoscience and reservoir characterization platform." />
      </Helmet>
      <StudioProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-screen w-full"
        >
          <StudioMain />
        </motion.div>
      </StudioProvider>
    </>
  );
};

export default SubsurfaceStudio;