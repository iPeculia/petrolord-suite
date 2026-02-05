import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Activity, ArrowLeft, FileText, Layout, Calculator, Droplets, Beaker, Coins, Dices, PieChart, ShieldCheck, FileDown, Users, BrainCircuit, Database, WifiOff, Lock, Workflow, Sparkles, Box, MessageSquare, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePetrophysics } from '@/components/petrophysics/hooks/usePetrophysics';
import { useOfflineMode } from '@/hooks/useOfflineMode';

import SetupPanel from '@/components/petrophysics/SetupPanel';
import LogViewer from '@/components/petrophysics/LogViewer';
import WellManager from '@/components/petrophysics/WellManager';
import CorrelationView from '@/components/petrophysics/CorrelationView';
import MarkerManager from '@/components/petrophysics/MarkerManager';
import CalculationsPanel from '@/components/petrophysics/CalculationsPanel';
import SaturationPanel from '@/components/petrophysics/SaturationPanel';
import PropertyEstimationPanel from '@/components/petrophysics/PropertyEstimationPanel';
import ReservesPanel from '@/components/petrophysics/ReservesPanel';
import ProbabilisticPanel from '@/components/petrophysics/ProbabilisticPanel';
import ProbabilisticResults from '@/components/petrophysics/ProbabilisticResults';
import DashboardsPanel from '@/components/petrophysics/DashboardsPanel';
import QCPanel from '@/components/petrophysics/QCPanel';
import ReportsPanel from '@/components/petrophysics/ReportsPanel';
import CollaborationPanel from '@/components/petrophysics/CollaborationPanel';
import AnalyticsPanel from '@/components/petrophysics/AnalyticsPanel';
import DataSourcesPanel from '@/components/petrophysics/DataSourcesPanel';
import ResponsiveSidebar from '@/components/petrophysics/ResponsiveSidebar';
import InstallPrompt from '@/components/petrophysics/InstallPrompt';
import SecurityPanel from '@/components/petrophysics/SecurityPanel';
import WorkflowPanel from '@/components/petrophysics/WorkflowPanel';
import AIInsightsPanel from '@/components/petrophysics/AIInsightsPanel';
import ThreeDVisualizationPanel from '@/components/petrophysics/ThreeDVisualizationPanel';
import HelpPanel from '@/components/petrophysics/HelpPanel';

const PetrophysicsEstimator = () => {
  const { toast } = useToast();
  const { isOnline } = useOfflineMode();
  const { 
      petroState, 
      activeWell, 
      createProject, 
      addWellFromLAS, 
      deleteWell, 
      setActiveWell,
      toggleWellForCorrelation,
      updateCurveMap,
      addMarker,
      deleteMarker,
      setSelectedInterval,
      setFlattenMarker,
      propagateMarker,
      runCalculations,
      runSaturation,
      runPropertyEstimation,
      saveCalculatedCurves,
      saveReserves,
      runProbabilisticAnalysis,
      saveQCReport
  } = usePetrophysics(toast);
  
  const [activeTab, setActiveTab] = useState("setup");
  const [activeSidebarTab, setActiveSidebarTab] = useState("wells"); 
  const [clickedDepth, setClickedDepth] = useState(null);

  const handleDepthClick = (depth) => {
      setClickedDepth(depth);
      setActiveSidebarTab('markers');
      toast({ title: "Depth Selected", description: `Ready to add marker at ${depth.toFixed(1)} ft` });
  };
  
  const handleIntervalSelect = (interval) => {
      setSelectedInterval(interval);
      toast({ title: "Interval Selected", description: `${interval.top.toFixed(1)} - ${interval.base.toFixed(1)} ft` });
  };

  return (
    <>
      <Helmet>
        <title>Petrophysics Estimator - Enterprise</title>
        <meta name="description" content="Advanced petrophysical analysis including LAS parsing, interactive log viewing, and triple-combo interpretation." />
        <link rel="manifest" href="/manifest.json" />
      </Helmet>

      <InstallPrompt />

      <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-900/50 backdrop-blur-md flex-shrink-0">
           <div className="flex items-center gap-2 md:gap-4">
             <Link to="/dashboard/geoscience">
               <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                 <ArrowLeft className="w-5 h-5" />
               </Button>
             </Link>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 rounded-lg hidden md:block">
                 <Activity className="w-6 h-6 text-blue-400" />
               </div>
               <div>
                 <h1 className="text-sm md:text-lg font-bold text-white tracking-tight">Petrophysics Estimator</h1>
                 <p className="text-[10px] md:text-xs text-slate-400 hidden sm:block">Interactive Log Analysis Suite</p>
               </div>
             </div>
           </div>

           <div className="flex items-center gap-3">
              {!isOnline && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-900/30 border border-rose-800 text-rose-400 text-xs">
                      <WifiOff className="w-3 h-3" /> <span className="hidden sm:inline">Offline</span>
                  </div>
              )}
              <div className="bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 text-xs text-slate-400 hidden sm:block">
                  Project: <span className="text-white font-medium">{petroState.projectName}</span>
              </div>
           </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-2 md:p-4">
           <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-2 md:mb-4 overflow-x-auto scrollbar-none">
                  <TabsList className="bg-slate-900 border border-slate-800 flex-shrink-0 h-auto p-1 gap-1 w-full md:w-auto justify-start">
                      <TabsTrigger value="setup" className="data-[state=active]:bg-blue-600 flex gap-2 text-xs md:text-sm py-2">
                          <FileText className="w-4 h-4" /> Setup
                      </TabsTrigger>
                      <TabsTrigger value="qc" className="data-[state=active]:bg-rose-600 flex gap-2 text-xs md:text-sm py-2">
                          <ShieldCheck className="w-4 h-4" /> QC
                      </TabsTrigger>
                      <TabsTrigger value="datasources" className="data-[state=active]:bg-emerald-600 flex gap-2 text-xs md:text-sm py-2">
                          <Database className="w-4 h-4" /> Sources
                      </TabsTrigger>
                      <TabsTrigger value="workflows" className="data-[state=active]:bg-orange-500 flex gap-2 text-xs md:text-sm py-2">
                          <Workflow className="w-4 h-4" /> Workflows
                      </TabsTrigger>
                      <TabsTrigger value="ai-insights" className="data-[state=active]:bg-violet-600 flex gap-2 text-xs md:text-sm py-2">
                          <Sparkles className="w-4 h-4" /> AI Insights
                      </TabsTrigger>
                      <TabsTrigger value="3d-viz" className="data-[state=active]:bg-indigo-500 flex gap-2 text-xs md:text-sm py-2">
                          <Box className="w-4 h-4" /> 3D Viz
                      </TabsTrigger>
                      <TabsTrigger value="collaboration" className="data-[state=active]:bg-purple-600 flex gap-2 text-xs md:text-sm py-2">
                          <MessageSquare className="w-4 h-4" /> Collaboration
                      </TabsTrigger>
                      <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 flex gap-2 text-xs md:text-sm py-2">
                          <Lock className="w-4 h-4" /> Security
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 flex gap-2 text-xs md:text-sm py-2">
                          <BrainCircuit className="w-4 h-4" /> Analytics
                      </TabsTrigger>
                      <TabsTrigger value="calculations" className="data-[state=active]:bg-blue-600 flex gap-2 text-xs md:text-sm py-2">
                          <Calculator className="w-4 h-4" /> Porosity
                      </TabsTrigger>
                      <TabsTrigger value="saturation" className="data-[state=active]:bg-blue-600 flex gap-2 text-xs md:text-sm py-2">
                          <Droplets className="w-4 h-4" /> Saturation
                      </TabsTrigger>
                      <TabsTrigger value="properties" className="data-[state=active]:bg-blue-600 flex gap-2 text-xs md:text-sm py-2">
                          <Beaker className="w-4 h-4" /> Properties
                      </TabsTrigger>
                      <TabsTrigger value="dashboards" className="data-[state=active]:bg-emerald-600 flex gap-2 text-xs md:text-sm py-2">
                          <PieChart className="w-4 h-4" /> Dashboards
                      </TabsTrigger>
                      <TabsTrigger value="reserves" className="data-[state=active]:bg-blue-600 flex gap-2 text-xs md:text-sm py-2">
                          <Coins className="w-4 h-4" /> Reserves
                      </TabsTrigger>
                      <TabsTrigger value="probabilistic" className="data-[state=active]:bg-purple-600 flex gap-2 text-xs md:text-sm py-2">
                          <Dices className="w-4 h-4" /> Monte Carlo
                      </TabsTrigger>
                      <TabsTrigger value="correlation" className="data-[state=active]:bg-blue-600 flex gap-2 text-xs md:text-sm py-2">
                          <Layout className="w-4 h-4" /> Correlation
                      </TabsTrigger>
                      <TabsTrigger value="reports" className="data-[state=active]:bg-orange-600 flex gap-2 text-xs md:text-sm py-2">
                          <FileDown className="w-4 h-4" /> Reports
                      </TabsTrigger>
                      <TabsTrigger value="help" className="data-[state=active]:bg-emerald-500 flex gap-2 text-xs md:text-sm py-2">
                          <HelpCircle className="w-4 h-4" /> Help
                      </TabsTrigger>
                  </TabsList>
              </div>

              {/* Tab 1: Single Well (Setup/Viz) */}
              <TabsContent value="setup" className="flex-1 min-h-0 mt-0">
                 <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    <div className="lg:col-span-3 h-auto lg:h-full flex flex-col gap-4 overflow-hidden">
                        <ResponsiveSidebar title="Well Management" triggerLabel="Manage Wells & Markers">
                            <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab} className="h-full flex flex-col">
                                <TabsList className="w-full bg-slate-900 border border-slate-800 mb-2">
                                    <TabsTrigger value="wells" className="flex-1">Wells</TabsTrigger>
                                    <TabsTrigger value="markers" className="flex-1">Markers</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="wells" className="flex-1 min-h-[300px] lg:min-h-0 mt-0">
                                    <WellManager 
                                        petroState={petroState}
                                        onCreateProject={createProject}
                                        onAddWell={addWellFromLAS}
                                        onDeleteWell={deleteWell}
                                        onSelectWell={setActiveWell}
                                    />
                                </TabsContent>
                                
                                <TabsContent value="markers" className="flex-1 min-h-[300px] lg:min-h-0 mt-0">
                                    {activeWell ? (
                                        <MarkerManager 
                                            markers={petroState.markers.filter(m => m.well_id === activeWell.id)}
                                            onAddMarker={addMarker}
                                            onDeleteMarker={deleteMarker}
                                            selectedDepth={clickedDepth}
                                        />
                                    ) : (
                                        <div className="p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                                            Select a well first
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </ResponsiveSidebar>
                    </div>

                    <div className="lg:col-span-9 h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
                        <div className="w-full lg:w-64 flex-shrink-0 h-auto lg:h-full overflow-hidden">
                             {activeWell ? (
                                <ResponsiveSidebar title="Curve Mapping" triggerLabel="Curve Mapping">
                                    <SetupPanel 
                                        petroState={{...activeWell, isLoaded: true}} 
                                        onLoad={(file) => addWellFromLAS(file, petroState.projectId)}
                                        onCurveUpdate={(type, val) => updateCurveMap(activeWell.id, type, val)}
                                    />
                                </ResponsiveSidebar>
                            ) : (
                                <div className="hidden lg:flex h-full bg-slate-900/30 border border-slate-800 rounded-xl items-center justify-center text-slate-500 p-6 text-center">
                                    Select well to map curves
                                </div>
                            )}
                        </div>

                        <div className="flex-1 h-full overflow-hidden min-h-[50vh]">
                            {activeWell ? (
                                <LogViewer 
                                    data={activeWell.data}
                                    curveMap={activeWell.curveMap}
                                    depthRange={activeWell.depthRange}
                                    markers={petroState.markers.filter(m => m.well_id === activeWell.id)}
                                    onIntervalSelect={handleIntervalSelect}
                                    onDepthClick={handleDepthClick}
                                />
                            ) : (
                                <div className="h-full bg-slate-900/30 border border-slate-800 rounded-xl border-dashed flex items-center justify-center text-slate-500">
                                    <div className="text-center">
                                       <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                       <p>Select a well to visualize logs</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
              </TabsContent>

              {/* Tab 18: 3D Visualization */}
              <TabsContent value="3d-viz" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <ThreeDVisualizationPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 19: Collaboration */}
              <TabsContent value="collaboration" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <CollaborationPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 20: Help Hub (Build 23) */}
              <TabsContent value="help" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <HelpPanel />
              </TabsContent>

              {/* Tab 9: Quality Control */}
              <TabsContent value="qc" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <QCPanel petroState={petroState} onSaveReport={saveQCReport} />
              </TabsContent>

              {/* Tab 13: Data Sources */}
              <TabsContent value="datasources" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <DataSourcesPanel 
                      petroState={petroState} 
                      onImportWell={(file) => addWellFromLAS(file, petroState.projectId)}
                  />
              </TabsContent>

              {/* Tab 15: Workflows */}
              <TabsContent value="workflows" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <WorkflowPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 17: AI Insights */}
              <TabsContent value="ai-insights" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <AIInsightsPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 14: Security */}
              <TabsContent value="security" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <SecurityPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 12: Analytics */}
              <TabsContent value="analytics" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <AnalyticsPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 2: Porosity/Vsh Calculations */}
              <TabsContent value="calculations" className="flex-1 min-h-0 mt-0">
                 <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Params Sidebar */}
                    <div className="lg:col-span-3 h-auto lg:h-full overflow-hidden">
                        {activeWell ? (
                            <ResponsiveSidebar title="Calculations" triggerLabel="Calculation Parameters">
                                <CalculationsPanel 
                                    petroState={petroState} 
                                    onRunCalculations={runCalculations}
                                    onSaveResults={saveCalculatedCurves}
                                />
                            </ResponsiveSidebar>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 border border-slate-800 rounded-lg bg-slate-900/50">
                                Select a well to enable calculations
                            </div>
                        )}
                    </div>

                    {/* Result Viewer */}
                    <div className="lg:col-span-9 h-full overflow-hidden min-h-[50vh]">
                         {activeWell ? (
                            <LogViewer 
                                data={activeWell.data}
                                curveMap={activeWell.curveMap}
                                depthRange={activeWell.depthRange}
                                markers={petroState.markers.filter(m => m.well_id === activeWell.id)}
                                onIntervalSelect={handleIntervalSelect}
                            />
                        ) : (
                            <div className="h-full bg-slate-900/30 border border-slate-800 rounded-xl border-dashed flex items-center justify-center text-slate-500">
                                Select a well to view results
                            </div>
                        )}
                    </div>
                 </div>
              </TabsContent>

              {/* Tab 3: Saturation Models */}
              <TabsContent value="saturation" className="flex-1 min-h-0 mt-0">
                 <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                     <div className="lg:col-span-3 h-auto lg:h-full overflow-hidden">
                         {activeWell ? (
                             <ResponsiveSidebar title="Saturation" triggerLabel="Saturation Models">
                                <SaturationPanel 
                                    petroState={petroState}
                                    onRunSaturation={runSaturation}
                                    onSaveResults={saveCalculatedCurves}
                                />
                             </ResponsiveSidebar>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-500 border border-slate-800 rounded-lg bg-slate-900/50">
                                 Select a well
                             </div>
                         )}
                     </div>
                     
                     <div className="lg:col-span-9 h-full overflow-hidden min-h-[50vh]">
                         {activeWell ? (
                            <LogViewer 
                                data={activeWell.data}
                                curveMap={activeWell.curveMap}
                                depthRange={activeWell.depthRange}
                                markers={petroState.markers.filter(m => m.well_id === activeWell.id)}
                                onIntervalSelect={handleIntervalSelect}
                            />
                        ) : (
                             <div className="h-full bg-slate-900/30 border border-slate-800 rounded-xl border-dashed flex items-center justify-center text-slate-500">
                                 Results will appear here
                             </div>
                        )}
                     </div>
                 </div>
              </TabsContent>

              {/* Tab 4: Property Estimation */}
              <TabsContent value="properties" className="flex-1 min-h-0 mt-0">
                 <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                     <div className="lg:col-span-3 h-auto lg:h-full overflow-hidden">
                         {activeWell ? (
                             <ResponsiveSidebar title="Properties" triggerLabel="Property Estimation">
                                <PropertyEstimationPanel 
                                    petroState={petroState}
                                    onRunEstimation={runPropertyEstimation}
                                    onSaveResults={saveCalculatedCurves}
                                />
                             </ResponsiveSidebar>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-500 border border-slate-800 rounded-lg bg-slate-900/50">
                                 Select a well
                             </div>
                         )}
                     </div>
                     
                     <div className="lg:col-span-9 h-full overflow-hidden min-h-[50vh]">
                         {activeWell ? (
                            <LogViewer 
                                data={activeWell.data}
                                curveMap={activeWell.curveMap}
                                depthRange={activeWell.depthRange}
                                markers={petroState.markers.filter(m => m.well_id === activeWell.id)}
                                onIntervalSelect={handleIntervalSelect}
                            />
                        ) : (
                             <div className="h-full bg-slate-900/30 border border-slate-800 rounded-xl border-dashed flex items-center justify-center text-slate-500">
                                 Results will appear here
                             </div>
                        )}
                     </div>
                 </div>
              </TabsContent>

              {/* Tab 5: Dashboards */}
              <TabsContent value="dashboards" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <DashboardsPanel petroState={petroState} />
              </TabsContent>

              {/* Tab 6: Reserves */}
              <TabsContent value="reserves" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  {activeWell ? (
                      <ReservesPanel 
                          petroState={petroState}
                          onSaveReserves={saveReserves}
                      />
                  ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-xl">
                          <Coins className="w-12 h-12 mb-4 opacity-20" />
                          <p>Select a well to estimate reserves</p>
                      </div>
                  )}
              </TabsContent>
              
              {/* Tab 7: Probabilistic Analysis */}
              <TabsContent value="probabilistic" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                     <div className="lg:col-span-3 h-auto lg:h-full overflow-hidden">
                         <ResponsiveSidebar title="Monte Carlo" triggerLabel="Configure Simulation">
                            <ProbabilisticPanel 
                                onRun={runProbabilisticAnalysis}
                                loading={petroState.loading}
                            />
                         </ResponsiveSidebar>
                     </div>
                     <div className="lg:col-span-9 h-full overflow-hidden min-h-[50vh]">
                         {petroState.probabilisticResults ? (
                             <div className="h-full bg-slate-950 border border-slate-800 rounded-xl">
                                 <ProbabilisticResults 
                                    results={petroState.probabilisticResults} 
                                    unit={petroState.probabilisticResults.fluidType}
                                 />
                             </div>
                         ) : (
                             <div className="h-full bg-slate-900/30 border border-slate-800 rounded-xl border-dashed flex items-center justify-center text-slate-500">
                                 <div className="text-center">
                                    <Dices className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Configure distributions and run Monte Carlo simulation</p>
                                 </div>
                             </div>
                         )}
                     </div>
                  </div>
              </TabsContent>

              {/* Tab 8: Correlation */}
              <TabsContent value="correlation" className="flex-1 min-h-0 mt-0 overflow-hidden">
                 <CorrelationView 
                    wells={petroState.wells}
                    markers={petroState.markers}
                    selectedWellIds={petroState.selectedWellsForCorrelation}
                    onToggleWell={toggleWellForCorrelation}
                    flattenMarker={petroState.flattenMarker}
                    onSetFlattenMarker={setFlattenMarker}
                    onAddMarker={addMarker}
                 />
              </TabsContent>

              {/* Tab 16: Reports */}
              <TabsContent value="reports" className="flex-1 min-h-0 mt-0 overflow-hidden">
                  <ReportsPanel petroState={petroState} />
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </>
  );
};

export default PetrophysicsEstimator;