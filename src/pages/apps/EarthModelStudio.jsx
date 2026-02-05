import React, { useState, Suspense, lazy } from 'react';
import { StudioProvider } from '@/contexts/StudioContext';
import { AnalyticsProvider } from '@/components/subsurface-studio/analytics/AnalyticsContext';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Settings2, PieChart as PieChartIcon, BrainCircuit, MessageSquare, Activity, FileSearch } from 'lucide-react';

// Core Components
import ProjectTreePanel from '@/components/subsurface-studio/ProjectTreePanel';
import InterpretationPanel from '@/components/subsurface-studio/InterpretationPanel';

// Phase 7 Integration Components
import UnifiedDataModel from '@/components/subsurface-studio/integration/UnifiedDataModel';
import EcosystemSyncEngine from '@/components/subsurface-studio/integration/EcosystemSyncEngine';
import AdvancedSearchPanel from '@/components/subsurface-studio/integration/AdvancedSearchPanel';
import DataManagementPanel from '@/components/subsurface-studio/integration/DataManagementPanel';
import CollaborationPanel from '@/components/subsurface-studio/integration/CollaborationPanel';
import PerformanceMonitoringPanel from '@/components/subsurface-studio/integration/PerformanceMonitoringPanel';
import SecurityPanel from '@/components/subsurface-studio/integration/SecurityPanel';
import ReportGenerationPanel from '@/components/subsurface-studio/integration/ReportGenerationPanel';

// Phase 11 Mobile Components
import { ResponsiveLayoutManager, useResponsive } from '@/components/subsurface-studio/mobile/ResponsiveLayoutManager';
import MobileNavigationPanel from '@/components/subsurface-studio/mobile/MobileNavigationPanel';
import { MobileViewWrapper } from '@/components/subsurface-studio/mobile/MobileViewOptimization';
import ProgressiveWebApp from '@/components/subsurface-studio/mobile/ProgressiveWebApp';
import { AccessibilityOptimization } from '@/components/subsurface-studio/mobile/AccessibilityOptimization';

// Phase 14 Collaboration Components (Lazy Loaded)
const CollaborationEngine = lazy(() => import('@/components/subsurface-studio/collaboration/CollaborationEngine'));
const ChatPanel = lazy(() => import('@/components/subsurface-studio/collaboration/ChatPanel'));
const PresenceAwareness = lazy(() => import('@/components/subsurface-studio/collaboration/PresenceAwareness'));
const VideoConferencing = lazy(() => import('@/components/subsurface-studio/collaboration/VideoConferencing'));
const ActivityFeed = lazy(() => import('@/components/subsurface-studio/collaboration/ActivityFeed'));

// Phase 1-6 Views (Lazy Loaded)
const ThreeDWindow = lazy(() => import('@/components/subsurface-studio/ThreeDWindow'));
const MapView = lazy(() => import('@/components/subsurface-studio/MapView'));
const SectionView = lazy(() => import('@/components/subsurface-studio/SectionView'));
const WellCorrelationView = lazy(() => import('@/components/subsurface-studio/WellCorrelationView'));
const SeismicAnalyzerView = lazy(() => import('@/components/subsurface-studio/SeismicAnalyzerView'));
const StructuralFrameworkView = lazy(() => import('@/components/subsurface-studio/StructuralFrameworkView'));
const PropertyModelingView = lazy(() => import('@/components/subsurface-studio/PropertyModelingView'));

// Phase 9 Analytics Components (Lazy Loaded)
const DashboardAnalytics = lazy(() => import('@/components/subsurface-studio/analytics/DashboardAnalytics'));
const ReportBuilder = lazy(() => import('@/components/subsurface-studio/analytics/ReportBuilder'));
const AdvancedAnalysisTools = lazy(() => import('@/components/subsurface-studio/analytics/AdvancedAnalysisTools'));
const AdvancedAnalyticsDashboard = lazy(() => import('@/components/subsurface-studio/analytics/AdvancedAnalyticsDashboard')); // NEW

// Phase 10 AI Components (Lazy Loaded)
const MachineLearningStudio = lazy(() => import('@/components/subsurface-studio/machine-learning/MachineLearningStudio'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full bg-slate-950 text-cyan-500">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const ViewContent = ({ activeTab }) => {
    // In a real implementation, this would be debounced and normalized (0-100%)
    // The broadcasting logic is now correctly handled inside the WebSocketManager
    // This is just a placeholder to show where the mouse move events are captured.
    const handleMouseMove = (e) => {
        // The CollaborationEngine wrapper will handle broadcasting cursor positions
    };

    const AnalyticsDashboardWrapper = () => (
        <Tabs defaultValue="advanced" className="h-full flex flex-col p-4 bg-slate-950">
            <TabsList className="mb-4 w-fit">
                <TabsTrigger value="advanced">Interactive Analysis</TabsTrigger>
                <TabsTrigger value="dashboard">Project Overview</TabsTrigger>
                <TabsTrigger value="reports">Reporting</TabsTrigger>
            </TabsList>
            {/* Swapped default to Advanced for visibility of new features */}
            <TabsContent value="advanced" className="flex-grow overflow-hidden"><AdvancedAnalyticsDashboard /></TabsContent>
            <TabsContent value="dashboard" className="flex-grow overflow-hidden"><DashboardAnalytics /></TabsContent>
            <TabsContent value="reports" className="flex-grow overflow-hidden"><ReportBuilder /></TabsContent>
        </Tabs>
    );

    return (
        <Suspense fallback={<LoadingFallback />}>
            <div className="h-full w-full" onMouseMove={handleMouseMove}>
                {activeTab === '3d' && <MobileViewWrapper title="3D View"><ThreeDWindow /></MobileViewWrapper>}
                {activeTab === 'map' && <MobileViewWrapper title="Map"><MapView /></MobileViewWrapper>}
                {activeTab === 'section' && <MobileViewWrapper title="Section"><SectionView /></MobileViewWrapper>}
                {activeTab === 'correlation' && <MobileViewWrapper title="Correlation"><WellCorrelationView /></MobileViewWrapper>}
                {activeTab === 'seismic' && <MobileViewWrapper title="Seismic"><SeismicAnalyzerView /></MobileViewWrapper>}
                {activeTab === 'structural' && <MobileViewWrapper title="Structural"><StructuralFrameworkView /></MobileViewWrapper>}
                {activeTab === 'property' && <MobileViewWrapper title="Property"><PropertyModelingView /></MobileViewWrapper>}
                
                {activeTab === 'analytics' && <AnalyticsDashboardWrapper />}
                
                {activeTab === 'ai' && <MachineLearningStudio />}
            </div>
        </Suspense>
    );
};

const DesktopLayout = ({ activeTab, setActiveTab, isSettingsOpen, setIsSettingsOpen }) => (
    <div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden">
        <div className="w-64 border-r border-slate-800 flex flex-col bg-slate-900">
            <div className="p-2 border-b border-slate-800 flex justify-between items-center h-12">
                <span className="font-bold text-sm">EarthModel Studio</span>
                <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Settings2 className="h-4 w-4" /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[350px] bg-slate-900 border-slate-800 text-white p-0">
                        <SheetHeader className="p-4 border-b border-slate-800">
                            <SheetTitle className="text-white">Project Integration</SheetTitle>
                            <SheetDescription>Advanced tools and settings.</SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-80px)]">
                            <div className="p-4 space-y-6">
                                <UnifiedDataModel />
                                <SecurityPanel />
                                <DataManagementPanel />
                                <PerformanceMonitoringPanel />
                                <ReportGenerationPanel />
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
            <ProjectTreePanel />
            <div className="border-t border-slate-800 flex-grow h-1/3 overflow-hidden">
                 <ActivityFeed />
            </div>
        </div>

        <div className="flex-grow flex flex-col min-w-0 relative">
            <CollaborationEngine>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                    <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-2 h-12">
                        <TabsList className="bg-transparent h-10">
                            <TabsTrigger value="3d" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">3D Window</TabsTrigger>
                            <TabsTrigger value="map" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">Map</TabsTrigger>
                            <TabsTrigger value="section" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">Section</TabsTrigger>
                            <TabsTrigger value="correlation" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">Correlation</TabsTrigger>
                            <TabsTrigger value="seismic" className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400">Seismic</TabsTrigger>
                            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 flex items-center"><PieChartIcon className="w-3 h-3 mr-1"/>Analytics</TabsTrigger>
                            <TabsTrigger value="ai" className="data-[state=active]:bg-slate-800 data-[state=active]:text-pink-400 flex items-center"><BrainCircuit className="w-3 h-3 mr-1"/>AI & ML</TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-2">
                            <PresenceAwareness />
                            <VideoConferencing />
                        </div>
                    </div>
                    <div className="flex-grow relative bg-black overflow-hidden">
                        <ViewContent activeTab={activeTab} />
                    </div>
                </Tabs>
            </CollaborationEngine>
        </div>

        <div className="w-72 border-l border-slate-800 bg-slate-950 flex flex-col">
            <Suspense fallback={<LoadingFallback/>}>
                <ChatPanel />
            </Suspense>
        </div>
    </div>
);

const MobileLayout = ({ activeTab, setActiveTab }) => {
    const [isLeftSheetOpen, setIsLeftSheetOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
            <Sheet open={isLeftSheetOpen} onOpenChange={setIsLeftSheetOpen}>
                <SheetContent side="left" className="w-[300px] bg-slate-900 border-slate-800 p-0">
                     <div className="h-full flex flex-col">
                        <div className="p-4 font-bold text-lg border-b border-slate-800">Project Explorer</div>
                        <div className="flex-grow overflow-y-auto">
                            <ProjectTreePanel />
                        </div>
                     </div>
                </SheetContent>
            </Sheet>

            <div className="flex-grow relative overflow-hidden">
                 <ViewContent activeTab={activeTab} />
            </div>

            <MobileNavigationPanel 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onMenuClick={() => setIsLeftSheetOpen(true)} 
            />
        </div>
    );
};

const ResponsiveStudio = () => {
    const { isMobile } = useResponsive();
    const [activeTab, setActiveTab] = useState('analytics');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return isMobile ? (
        <MobileLayout activeTab={activeTab} setActiveTab={setActiveTab} />
    ) : (
        <DesktopLayout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSettingsOpen={isSettingsOpen} 
            setIsSettingsOpen={setIsSettingsOpen} 
        />
    );
};

const EarthModelStudio = () => (
    <AccessibilityOptimization>
        <StudioProvider>
            <AnalyticsProvider>
                <ResponsiveLayoutManager>
                    <EcosystemSyncEngine />
                    <ResponsiveStudio />
                    <ProgressiveWebApp />
                    <Toaster />
                </ResponsiveLayoutManager>
            </AnalyticsProvider>
        </StudioProvider>
    </AccessibilityOptimization>
);

export default EarthModelStudio;