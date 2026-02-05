import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Layers, Save, Settings2, Wand2, Database, 
  Play, Layout, Activity, FileText, Share2, ChevronRight,
  Plus, Trash2, Download, Network, FileOutput, Users, BrainCircuit, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Components
import MultiWellProjectManager from '@/components/velocitymodelbuilder/MultiWellProjectManager';
import AdvancedInputWorkflows from '@/components/velocitymodelbuilder/AdvancedInputWorkflows';
import SmartCurveDetector from '@/components/velocitymodelbuilder/SmartCurveDetector';
import LayerTypeBuilder from '@/components/velocitymodelbuilder/LayerTypeBuilder';
import AnisotropyParameterEditor from '@/components/velocitymodelbuilder/AnisotropyParameterEditor';
import PressureTemperatureLinker from '@/components/velocitymodelbuilder/PressureTemperatureLinker';
import UnitConverter from '@/components/velocitymodelbuilder/UnitConverter';
import ScenarioSetComparator from '@/components/velocitymodelbuilder/ScenarioSetComparator';
import TimeDepthConversionEngine from '@/components/velocitymodelbuilder/TimeDepthConversionEngine';
import InteractiveTDCurveViewer from '@/components/velocitymodelbuilder/InteractiveTDCurveViewer';
import VelocityPanelVisualizer from '@/components/velocitymodelbuilder/VelocityPanelVisualizer';
import GuidedModeWizard from '@/components/velocitymodelbuilder/GuidedModeWizard';
import VelocityModelBuilderStrategicSuite from '@/components/velocitymodelbuilder/VelocityModelBuilderStrategicSuite';
import ExpertModeInterface from '@/components/velocitymodelbuilder/ExpertModeInterface';
import PetrolordIntegrationHub from '@/components/velocitymodelbuilder/PetrolordIntegrationHub';
import ExternalToolsExportHub from '@/components/velocitymodelbuilder/ExternalToolsExportHub';
import CollaborationWorkspace from '@/components/velocitymodelbuilder/CollaborationWorkspace';
import AIInsightsDashboard from '@/components/velocitymodelbuilder/AIInsightsDashboard';
import HelpGuideHub from '@/components/velocitymodelbuilder/help/HelpGuideHub';
import { HelpTooltip } from '@/components/velocitymodelbuilder/help/ContextualHelpTooltips';
import VelocityEquationEditor from '@/components/velocitymodelbuilder/VelocityEquationEditor';

const VelocityModelBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('build');
  const [mode, setMode] = useState('standard'); 
  const [isBuilding, setIsBuilding] = useState(false);
  
  const [layers, setLayers] = useState([
    { id: 1, name: 'Water Layer', method: 'water', locked: true },
    { id: 2, name: 'Overburden', method: 'linear', locked: false },
    { id: 3, name: 'Target Reservoir', method: 'compaction', locked: false }
  ]);

  const addLayer = () => {
    setLayers([...layers, { id: Date.now(), name: 'New Interval', method: 'constant', locked: false }]);
  };

  const removeLayer = (id) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  const handleBuildModel = () => {
    setIsBuilding(true);
    toast({
      title: "Building Velocity Model",
      description: "Compiling layers, calculating gradients, and integrating well tops...",
    });
    
    setTimeout(() => {
      setIsBuilding(false);
      setActiveTab('visualize');
      toast({
        title: "Model Built Successfully",
        description: "Velocity model is ready for QC and visualization.",
        variant: "default",
      });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Velocity Model Builder - Enterprise</title>
        <meta name="description" content="Phase 1-10 Integrated Velocity Modeling Suite with AI Automation" />
      </Helmet>

      <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
        <header className="flex-shrink-0 h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/geoscience">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm">Velocity Model Builder</span>
              <Badge variant="outline" className="ml-2 text-[10px] border-slate-700 text-slate-500">v10.0 AI</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setMode('guided')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
                  mode === 'guided' ? 'bg-slate-800 text-purple-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Wand2 className="w-3 h-3" /> Guided
              </button>
              <button
                onClick={() => setMode('standard')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
                  mode === 'standard' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Layout className="w-3 h-3" /> Standard
              </button>
              <button
                onClick={() => setMode('expert')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${
                  mode === 'expert' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Settings2 className="w-3 h-3" /> Expert
              </button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[850px]">
              <TabsList className="grid w-full grid-cols-10 bg-slate-950 border border-slate-800 h-8">
                <TabsTrigger value="build" className="text-xs h-full">Build</TabsTrigger>
                <TabsTrigger value="visualize" className="text-xs h-full">Visualize</TabsTrigger>
                <TabsTrigger value="scenarios" className="text-xs h-full">Scenarios</TabsTrigger>
                <TabsTrigger value="convert" className="text-xs h-full">Convert</TabsTrigger>
                <TabsTrigger value="integrate" className="text-xs h-full flex items-center gap-1 text-purple-400 data-[state=active]:text-purple-400">
                  <Share2 className="w-3 h-3" /> Integ.
                </TabsTrigger>
                <TabsTrigger value="export" className="text-xs h-full flex items-center gap-1 text-blue-400 data-[state=active]:text-blue-400">
                  <FileOutput className="w-3 h-3" /> Export
                </TabsTrigger>
                <TabsTrigger value="collaborate" className="text-xs h-full flex items-center gap-1 text-orange-400 data-[state=active]:text-orange-400">
                  <Users className="w-3 h-3" /> Team
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs h-full flex items-center gap-1 text-emerald-400 data-[state=active]:text-emerald-400 font-bold">
                  <BrainCircuit className="w-3 h-3" /> AI
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="text-xs h-full">Roadmap</TabsTrigger>
                <TabsTrigger value="help" className="text-xs h-full flex items-center gap-1 text-slate-400 data-[state=active]:text-white">
                  <HelpCircle className="w-3 h-3" /> Help
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => setActiveTab('help')} className="h-8 w-8 text-slate-400 hover:text-white" title="Help Center">
                <HelpCircle className="w-4 h-4" />
            </Button>
            <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-lg shadow-emerald-900/20">
              <Save className="w-3 h-3 mr-2" /> Save Project
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto relative bg-slate-950">
          
          {mode === 'guided' && (
             <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-12 animate-in fade-in duration-300">
                <div className="w-full max-w-4xl h-full max-h-[800px]">
                   <GuidedModeWizard />
                </div>
                <Button 
                  variant="ghost" 
                  className="absolute top-4 right-4 text-slate-500 hover:text-white"
                  onClick={() => setMode('standard')}
                >
                  Exit Guided Mode
                </Button>
             </div>
          )}

          {activeTab === 'integrate' ? (
             <div className="h-full p-0 bg-slate-950">
                <PetrolordIntegrationHub />
             </div>
          ) : activeTab === 'export' ? (
            <div className="h-full p-0 bg-slate-950">
               <ExternalToolsExportHub />
            </div>
          ) : activeTab === 'collaborate' ? (
            <div className="h-full p-0 bg-slate-950">
               <CollaborationWorkspace />
            </div>
          ) : activeTab === 'ai' ? (
            <div className="h-full p-0 bg-slate-950">
               <AIInsightsDashboard />
            </div>
          ) : activeTab === 'roadmap' ? (
            <div className="h-full p-0 bg-slate-950">
               <VelocityModelBuilderStrategicSuite />
            </div>
          ) : activeTab === 'help' ? (
            <div className="h-full p-0 bg-slate-950">
               <HelpGuideHub />
            </div>
          ) : (
            <div className="h-full grid grid-cols-12 divide-x divide-slate-800">
              
              <aside className="col-span-3 flex flex-col bg-slate-900/50 min-w-0">
                 <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-3 h-3" /> Data Inputs
                      <HelpTooltip content="Manage all input data including wells, checkshots, and seismic velocities." />
                    </span>
                 </div>
                 <ScrollArea className="flex-1">
                    <div className="p-3 space-y-4">
                       <MultiWellProjectManager />
                       <Separator className="bg-slate-800" />
                       <AdvancedInputWorkflows />
                       <SmartCurveDetector />
                    </div>
                 </ScrollArea>
              </aside>

              <section className="col-span-6 flex flex-col bg-slate-950 min-w-0 relative">
                 {mode === 'expert' && activeTab === 'build' ? (
                    <ExpertModeInterface layers={layers} />
                 ) : (
                    <>
                      {activeTab === 'build' && (
                        <div className="flex flex-col h-full">
                            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                              <span className="text-sm font-bold text-white flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-400" /> Layer Definition
                                <HelpTooltip content="Define geological layers and assign velocity functions (e.g., V0 + kZ)." />
                              </span>
                              <Button size="sm" variant="outline" onClick={addLayer} className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-300 hover:text-white">
                                <Plus className="w-3 h-3 mr-1" /> Add Interval
                              </Button>
                            </div>
                            
                            <ScrollArea className="flex-1 p-4">
                              <div className="space-y-4">
                                {layers.map((layer, index) => (
                                  <div key={layer.id} className="relative pl-6 border-l-2 border-slate-800 hover:border-slate-700 transition-colors group">
                                    <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 text-[9px] flex items-center justify-center text-slate-400 font-mono">
                                      {index + 1}
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-200">{layer.name}</span>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-6 w-6 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => removeLayer(layer.id)}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <LayerTypeBuilder layer={layer} />
                                  </div>
                                ))}

                                <Separator className="my-6 bg-slate-800" />
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <PressureTemperatureLinker />
                                    <VelocityEquationEditor />
                                </div>
                              </div>
                            </ScrollArea>

                            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                              <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 text-sm font-bold shadow-lg shadow-emerald-900/20"
                                onClick={handleBuildModel}
                                disabled={isBuilding}
                              >
                                {isBuilding ? (
                                  <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Processing Layers...
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Play className="w-4 h-4 fill-current" /> Build Velocity Model
                                  </span>
                                )}
                              </Button>
                            </div>
                        </div>
                      )}

                      {activeTab === 'visualize' && (
                        <div className="flex flex-col h-full p-4 gap-4">
                            <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden relative">
                              <div className="absolute top-2 left-2 z-10">
                                <HelpTooltip content="Interactive Time-Depth Curve. Toggle residuals and checkshots using controls." side="right" />
                              </div>
                              <InteractiveTDCurveViewer />
                            </div>
                            <div className="h-1/3 min-h-[250px] bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                              <VelocityPanelVisualizer />
                            </div>
                        </div>
                      )}

                      {activeTab === 'scenarios' && (
                        <div className="p-6 h-full flex flex-col items-center justify-center">
                            <div className="w-full max-w-3xl space-y-6">
                              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Scenario Management
                                <HelpTooltip content="Create P10/P50/P90 velocity scenarios to estimate depth uncertainty." />
                              </h2>
                              <ScenarioSetComparator />
                              <div className="p-8 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/30 text-center">
                                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                  <p className="text-slate-400">Detailed Monte Carlo simulation results would appear here.</p>
                              </div>
                            </div>
                        </div>
                      )}

                      {activeTab === 'convert' && (
                        <div className="p-6 h-full flex flex-col">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                Grid Conversion Engine
                                <HelpTooltip content="Convert seismic time grids to depth surfaces using your velocity model." />
                            </h2>
                            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-8 flex items-center justify-center">
                              <TimeDepthConversionEngine />
                            </div>
                        </div>
                      )}
                    </>
                 )}
              </section>

              <aside className="col-span-3 flex flex-col bg-slate-900/50 min-w-0 border-l border-slate-800">
                 <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Settings2 className="w-3 h-3" /> Tools
                    </span>
                 </div>
                 <ScrollArea className="flex-1">
                    <div className="p-3 space-y-4">
                       <UnitConverter />
                       
                       <div className="space-y-4">
                          {activeTab === 'build' && (
                             <>
                               <ScenarioSetComparator />
                               <Card className="bg-slate-900 border-slate-800">
                                 <CardHeader className="pb-2 border-b border-slate-800">
                                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                                 </CardHeader>
                                 <CardContent className="p-3 space-y-2">
                                    <Button variant="outline" className="w-full justify-start text-xs h-8 border-slate-700 text-slate-300">
                                       <Share2 className="w-3 h-3 mr-2" /> Share Configuration
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-xs h-8 border-slate-700 text-slate-300">
                                       <Download className="w-3 h-3 mr-2" /> Export Parameters
                                    </Button>
                                 </CardContent>
                               </Card>
                             </>
                          )}

                          <TimeDepthConversionEngine /> 
                       </div>
                    </div>
                 </ScrollArea>
              </aside>

            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default VelocityModelBuilder;