import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PetroleumEconomicsProvider, usePetroleumEconomics } from './contexts/PetroleumEconomicsContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
    ChevronLeft, Save, Share2, Settings, Layers, BarChart3, Tornado, FileCheck, 
    Shield, FileSpreadsheet, FileText, Sliders, Activity, DollarSign, Scale, 
    Calculator, Menu, Home, AlertCircle, HelpCircle, CheckCircle2, Clock, Undo2, Redo2, AlertTriangle
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Tabs
import SetupTab from './tabs/SetupTab';
import ProductionTab from './tabs/ProductionTab';
import CostsTab from './tabs/CostsTab';
import FiscalTab from './tabs/FiscalTab';
import CashflowTab from './tabs/CashflowTab'; 
import DashboardTab from './tabs/DashboardTab';
import ScenariosTab from './tabs/ScenariosTab';
import SensitivityTab from './tabs/SensitivityTab';
import ReconciliationTab from './tabs/ReconciliationTab'; 
import GovernanceTab from './tabs/GovernanceTab'; 
import ExportTab from './tabs/ExportTab'; 
import ReportingTab from './tabs/ReportingTab'; 
import IntegrationTab from './tabs/IntegrationTab';

// Components
import AssumptionsMiniPanel from '@/components/PetroleumEconomicsStudio/AssumptionsMiniPanel';
import DataQCBanner from '@/components/PetroleumEconomicsStudio/DataQCBanner';
import QuickStartModal from '@/components/PetroleumEconomicsStudio/QuickStartModal'; 
import HelpCenter from '@/components/PetroleumEconomicsStudio/HelpCenter';
import OnboardingFlow from '@/components/PetroleumEconomicsStudio/OnboardingFlow';
import SmartGuidance from '@/components/PetroleumEconomicsStudio/SmartGuidance';
import ProgressIndicator from '@/components/PetroleumEconomicsStudio/ProgressIndicator';
import ValidationSummary from '@/components/PetroleumEconomicsStudio/ValidationSummary';
import ExportGuide from '@/components/PetroleumEconomicsStudio/ExportGuide';

const WorkspaceContent = () => {
  const { modelId } = useParams();
  
  const { 
    currentModel, 
    currentProject, 
    fetchModelDetails, 
    loading, 
    validationIssues, 
    applyQuickFix, 
    activeScenario, 
    scenarios,
    saving,
    loadDemoModel,
    economicsStatus,
    lastRunTime,
    runEconomics,
    undo, redo, historyIndex, history,
    progress
  } = usePetroleumEconomics();
  
  const [activeTab, setActiveTab] = useState('setup');
  const [dismissedIssues, setDismissedIssues] = useState([]);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Help & Overlays
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isExportGuideOpen, setIsExportGuideOpen] = useState(false);

  useEffect(() => {
    if (modelId) fetchModelDetails(modelId);
  }, [modelId, fetchModelDetails]);

  // Initial Check for Empty Model -> Show QuickStart
  useEffect(() => {
      if (!loading && currentModel && scenarios && scenarios.length === 0) {
          setShowQuickStart(true);
      }
  }, [loading, currentModel, scenarios]);

  // Keyboard Shortcuts
  useEffect(() => {
      const handleKeyDown = (e) => {
          // Ignore if typing
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

          if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
              e.preventDefault();
              runEconomics(true);
          }
          if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
              e.preventDefault();
              setIsHelpOpen(prev => !prev);
          }
          if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
              e.preventDefault();
              setShowQuickStart(true);
          }
          if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
              e.preventDefault();
              undo();
          }
          if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
              e.preventDefault();
              redo();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runEconomics, undo, redo]);

  if (loading) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-950 text-white flex-col gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-slate-400">Loading economic model...</p>
        </div>
      );
  }

  if (!currentModel) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-950 text-white flex-col gap-4">
            <div className="bg-slate-900 p-6 rounded-full border border-slate-800">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Model Not Found</h2>
            <Link to="/dashboard/apps/petroleum-economics-studio/projects">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-500">Return to Projects</Button>
            </Link>
        </div>
      );
  }

  const activeIssues = validationIssues.filter(i => !dismissedIssues.includes(i.id));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hierarchy</h3>
        </div>
        <ScrollArea className="flex-1 px-2 py-3">
            <div className="space-y-1">
                <div className="px-2.5 py-2 bg-blue-900/20 text-blue-400 rounded text-sm font-medium flex items-center gap-2">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span className="truncate">{currentModel.name}</span>
                </div>
                <div className="pl-6 space-y-1 mt-2">
                    <div className="text-[10px] text-slate-600 font-bold uppercase px-2">Active Scenario</div>
                    <div className="px-3 py-2 text-xs text-white bg-slate-800/60 rounded border-l-2 border-blue-500 truncate flex justify-between items-center group hover:bg-slate-800 transition-colors cursor-default">
                        <span className="truncate">{activeScenario?.name || 'None'}</span>
                        {activeScenario?.is_locked && <Shield className="w-3 h-3 text-emerald-500/70 shrink-0 ml-2" />}
                    </div>
                </div>
            </div>
        </ScrollArea>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      <Helmet><title>{currentModel.name} - Economics Studio</title></Helmet>

      {/* Overlays */}
      <OnboardingFlow isActive={isOnboardingActive} onComplete={() => setIsOnboardingActive(false)} />
      <HelpCenter isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} onReplayOnboarding={() => setIsOnboardingActive(true)} />
      <QuickStartModal isOpen={showQuickStart} onClose={() => setShowQuickStart(false)} onLoadTemplate={(type) => { loadDemoModel(type); setShowQuickStart(false); }} />
      <SmartGuidance />
      <ValidationSummary isOpen={isValidationOpen} onClose={() => setIsValidationOpen(false)} issues={validationIssues} onFix={applyQuickFix} />
      <ExportGuide isOpen={isExportGuideOpen} onClose={() => setIsExportGuideOpen(false)} />

      {/* Top Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden text-slate-400"><Menu className="w-5 h-5" /></Button></SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-slate-950 border-r border-slate-800"><SidebarContent /></SheetContent>
            </Sheet>

            <Link to="/dashboard/apps/petroleum-economics-studio/projects">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></Button>
            </Link>
            
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-slate-500 hidden sm:flex">
                        <span>{currentProject?.name}</span><span>/</span><span>{currentModel.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-white truncate max-w-[150px]">{currentModel.name}</div>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${economicsStatus === 'complete' ? 'bg-emerald-950/50 border-emerald-900 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                            {economicsStatus === 'complete' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {economicsStatus === 'complete' ? `Run ${lastRunTime ? format(lastRunTime, 'HH:mm') : ''}` : 'Not Run'}
                        </div>
                    </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="hidden lg:block border-l border-slate-800 pl-4 h-8 flex items-center">
                    <ProgressIndicator progress={progress} />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="flex items-center mr-2 border-r border-slate-800 pr-2">
                <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} className="text-slate-400 disabled:opacity-30"><Undo2 className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Undo (Ctrl+Z)</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className="text-slate-400 disabled:opacity-30"><Redo2 className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Redo (Ctrl+Y)</TooltipContent></Tooltip>
                </TooltipProvider>
            </div>

            {validationIssues.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setIsValidationOpen(true)} className="text-yellow-500 hover:text-yellow-400 bg-yellow-950/20 hover:bg-yellow-950/30 mr-2">
                    <AlertTriangle className="w-4 h-4 mr-1.5" /> {validationIssues.length} Issues
                </Button>
            )}

            <Button variant="ghost" size="sm" onClick={() => setIsHelpOpen(true)} className="text-slate-400 hover:text-white mr-2 hidden sm:flex">
                <HelpCircle className="w-4 h-4 mr-2" /> Help
            </Button>
            
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white h-8" disabled={activeScenario?.is_locked || saving}>
                {saving ? <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div> : <Save className="w-3.5 h-3.5 mr-2" />}
                {saving ? 'Saving...' : 'Save'}
            </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col shrink-0">
            <SidebarContent />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
                <div className="border-b border-slate-800 bg-slate-900 shrink-0">
                    <ScrollArea className="w-full whitespace-nowrap" orientation="horizontal">
                        <TabsList className="bg-transparent h-12 px-2 space-x-1 min-w-max justify-start">
                            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><BarChart3 className="w-3.5 h-3.5" /> Dashboard</TabsTrigger>
                            <div className="w-px h-6 bg-slate-800 mx-1" />
                            <TabsTrigger value="setup" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><Sliders className="w-3.5 h-3.5" /> Setup</TabsTrigger>
                            <TabsTrigger value="production" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><Activity className="w-3.5 h-3.5" /> Production</TabsTrigger>
                            <TabsTrigger value="costs" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><DollarSign className="w-3.5 h-3.5" /> Costs</TabsTrigger>
                            <TabsTrigger value="fiscal" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><Scale className="w-3.5 h-3.5" /> Fiscal</TabsTrigger>
                            <div className="w-px h-6 bg-slate-800 mx-1" />
                            <TabsTrigger value="results" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><Calculator className="w-3.5 h-3.5" /> Cashflow</TabsTrigger>
                            <TabsTrigger value="sensitivity" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><Tornado className="w-3.5 h-3.5" /> Sensitivity</TabsTrigger>
                            <TabsTrigger value="scenarios" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><Layers className="w-3.5 h-3.5" /> Scenarios</TabsTrigger>
                            <TabsTrigger value="reporting" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><FileText className="w-3.5 h-3.5" /> Reporting</TabsTrigger>
                            <TabsTrigger value="export" className="data-[state=active]:bg-slate-800 text-slate-400 h-9 text-xs gap-2"><FileSpreadsheet className="w-3.5 h-3.5" /> Export</TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <TabsContent value="dashboard" className="h-full overflow-y-auto p-4 md:p-6 m-0"><DashboardTab /></TabsContent>
                    <TabsContent value="setup" className="h-full overflow-y-auto p-4 md:p-6 m-0"><SetupTab /></TabsContent>
                    <TabsContent value="production" className="h-full p-4 md:p-6 m-0"><ProductionTab /></TabsContent>
                    <TabsContent value="costs" className="h-full p-4 md:p-6 m-0"><CostsTab /></TabsContent>
                    <TabsContent value="fiscal" className="h-full overflow-y-auto p-4 md:p-6 m-0"><FiscalTab /></TabsContent>
                    <TabsContent value="results" className="h-full p-4 md:p-6 m-0"><CashflowTab /></TabsContent>
                    <TabsContent value="sensitivity" className="h-full p-4 md:p-6 m-0"><SensitivityTab /></TabsContent>
                    <TabsContent value="scenarios" className="h-full overflow-y-auto p-4 md:p-6 m-0"><ScenariosTab /></TabsContent>
                    <TabsContent value="reconciliation" className="h-full p-4 md:p-6 m-0"><ReconciliationTab /></TabsContent>
                    <TabsContent value="reporting" className="h-full overflow-y-auto p-4 md:p-6 m-0"><ReportingTab /></TabsContent>
                    <TabsContent value="export" className="h-full overflow-y-auto p-4 md:p-6 m-0"><ExportTab /></TabsContent>
                    <TabsContent value="integration" className="h-full overflow-y-auto p-4 md:p-6 m-0"><IntegrationTab /></TabsContent>
                    <TabsContent value="governance" className="h-full p-4 md:p-6 m-0"><GovernanceTab /></TabsContent>
                </div>
            </Tabs>
        </main>

        <AssumptionsMiniPanel />
      </div>
    </div>
  );
};

const ModelWorkspace = () => (
    <PetroleumEconomicsProvider>
        <WorkspaceContent />
    </PetroleumEconomicsProvider>
);

export default ModelWorkspace;