import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wand2, Settings2, Database, Activity, Sliders, Share2, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Components
import PrognosisTab from '@/components/ppfg/PrognosisTab'; 
import PreRiskChart from '@/components/ppfg/PreRiskChart';
import GuidedModeWizard from '@/components/ppfg/GuidedModeWizard';
import Phase1InputSystem from '@/components/ppfg/Phase1InputSystem';
import Phase2AnalysisWorkflow from '@/components/ppfg/Phase2AnalysisWorkflow';
import Phase3ParameterTuning from '@/components/ppfg/Phase3ParameterTuning';
import Phase6ExportIntegration from '@/components/ppfg/Phase6ExportIntegration';
import PPFGHelpGuide from '@/components/ppfg/PPFGHelpGuide';

// State Hooks (The Source of Truth)
import { usePhase1State } from '@/hooks/usePhase1State';
import { usePhase2State } from '@/hooks/usePhase2State';
import { usePhase4State } from '@/hooks/usePhase4State'; 

const PorePressureFracGradient = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState('guided');
  const [activeTab, setActiveTab] = useState('input'); 
  const [completedSteps, setCompletedSteps] = useState(['input']); 

  // --- DATA AGGREGATION START ---
  const { state: phase1State } = usePhase1State();
  const { steps: phase2Steps } = usePhase2State();
  const { probResults: phase4Results } = usePhase4State(); 

  // Phase 1 Data Preparation
  const phase1Data = useMemo(() => {
      if (phase1State.data && phase1State.data.length > 0) {
          const depths = phase1State.data.map(d => d[phase1State.curveMapping.DEPTH] || d.DEPTH || d.depth);
          return {
              depths,
              GR: phase1State.data.map(d => d[phase1State.curveMapping.GR] || d.GR),
              dt: phase1State.data.map(d => d[phase1State.curveMapping.DT] || d.DT),
              rhob: phase1State.data.map(d => d[phase1State.curveMapping.RHOB] || d.RHOB),
              res: phase1State.data.map(d => d[phase1State.curveMapping.RES_DEEP] || d.RES_DEEP),
              waterDepth: 500, 
              airGap: 80
          };
      }
      return null;
  }, [phase1State]);

  // Phase 4/5 Data Preparation (Results)
  const prognosisInput = useMemo(() => {
      if (phase4Results) {
          return {
              pp: phase4Results.pp.p50,
              fg: phase4Results.fg.p50,
              obg: phase4Results.obg 
          };
      }
      if (phase2Steps[4].results && phase2Steps[5].results) {
          return {
              pp: phase2Steps[4].results.pp_ppg,
              fg: phase2Steps[5].results.fg_ppg,
              obg: phase2Steps[1].results?.obg_ppg
          };
      }
      return null;
  }, [phase2Steps, phase4Results]);

  // Merged Data for Export/QC
  const exportData = useMemo(() => {
      if (!phase1Data) return null;
      const results = prognosisInput || {};
      return {
          ...phase1Data,
          ...results
      };
  }, [phase1Data, prognosisInput]);
  // --- DATA AGGREGATION END ---

  const handleWizardComplete = () => {
      setMode('expert'); 
      toast({ title: "Workflow Complete", description: "Initial model generated. Switching to Expert View." });
  };

  const markStepComplete = (stepValue) => {
      if (!completedSteps.includes(stepValue)) {
          setCompletedSteps(prev => [...prev, stepValue]);
      }
  };

  const navigateToTab = (tabValue) => {
      setActiveTab(tabValue);
      markStepComplete(activeTab); 
  };

  const workflowTabs = [
    { id: 'input', label: 'Load Well Data', icon: Database, step: 1, description: 'Upload logs & check quality' },
    { id: 'analysis', label: 'Analyze Trends', icon: Activity, step: 2, description: 'Pick shale points & NCT' },
    { id: 'tuning', label: 'Calc Gradients', icon: Sliders, step: 3, description: 'Tune Eaton/Bowers parameters' },
    { id: 'risk', label: 'Assess Risks', icon: AlertCircle, step: 4, description: 'Identify hazards & windows' },
    { id: 'export', label: 'QC & Reports', icon: Share2, step: 5, description: 'Validate & Export Results' },
    { id: 'prognosis', label: 'Prognosis', icon: CheckCircle2, step: 6, description: 'Final visualization' },
  ];

  const TabNavigationFooter = ({ currentTabId, nextTabId, nextLabel }) => (
      <div className="absolute bottom-4 right-4 z-50">
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            onClick={() => navigateToTab(nextTabId)}
          >
              {nextLabel || "Next Step"} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
      </div>
  );

  return (
    <>
      <Helmet>
        <title>PP–FG Analyzer | Petrolord</title>
      </Helmet>
      
      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
        
        <header className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800 z-10">
            <div className="flex items-center gap-4">
                <Link to="/dashboard/drilling">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-lg font-bold text-slate-100 tracking-tight">PP–FG Analyzer</h1>
                    <p className="text-xs text-slate-500 font-mono">
                        Well: {phase1State.projectMeta?.wellName || "New Well"}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <PPFGHelpGuide />

                <div className="hidden md:flex items-center gap-1 mr-4">
                    {workflowTabs.map((tab, idx) => (
                         <div key={tab.id} className="flex items-center">
                            <div 
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    activeTab === tab.id ? "bg-emerald-500 ring-2 ring-emerald-500/30 scale-125" : 
                                    completedSteps.includes(tab.id) ? "bg-emerald-800" : "bg-slate-800"
                                )}
                                title={tab.label}
                            />
                            {idx < workflowTabs.length - 1 && (
                                <div className={cn("w-4 h-0.5 transition-colors duration-300", completedSteps.includes(tab.id) ? "bg-emerald-900" : "bg-slate-800")} />
                            )}
                         </div>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">
                        Step {workflowTabs.findIndex(t => t.id === activeTab) + 1} of {workflowTabs.length}
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <Button 
                        variant={mode === 'guided' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setMode('guided')}
                        className={mode === 'guided' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}
                    >
                        <Wand2 className="w-4 h-4 mr-2" /> Guided
                    </Button>
                    <Button 
                        variant={mode === 'expert' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setMode('expert')}
                        className={mode === 'expert' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
                    >
                        <Settings2 className="w-4 h-4 mr-2" /> Expert
                    </Button>
                </div>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
                {mode === 'guided' ? (
                    <GuidedModeWizard onComplete={handleWizardComplete} />
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="px-6 pt-2 border-b border-slate-800 bg-slate-950">
                            <TabsList className="bg-slate-900 border border-slate-800 p-1 h-auto flex flex-wrap gap-1 justify-start">
                                {workflowTabs.map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <TabsTrigger 
                                            key={tab.id} 
                                            value={tab.id}
                                            className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 flex items-center gap-2 px-3 py-2 h-9"
                                        >
                                            <Icon className="w-3.5 h-3.5" /> 
                                            <span>{tab.label}</span>
                                            {completedSteps.includes(tab.id) && <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-1" />}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                            
                            <div className="py-2 flex items-center justify-between text-xs text-slate-400">
                                <span>Current: <span className="text-slate-200 font-medium">{workflowTabs.find(t => t.id === activeTab)?.description}</span></span>
                            </div>
                        </div>

                        <div className="flex-1 p-0 overflow-hidden bg-slate-950 relative">
                            <TabsContent value="input" className="h-full m-0">
                                <Phase1InputSystem />
                                <TabNavigationFooter currentTabId="input" nextTabId="analysis" />
                            </TabsContent>

                            <TabsContent value="analysis" className="h-full m-0">
                                <Phase2AnalysisWorkflow initialData={phase1Data} />
                                <TabNavigationFooter currentTabId="analysis" nextTabId="tuning" />
                            </TabsContent>

                            <TabsContent value="tuning" className="h-full m-0">
                                <Phase3ParameterTuning initialData={phase1Data} />
                                <TabNavigationFooter currentTabId="tuning" nextTabId="risk" />
                            </TabsContent>

                            <TabsContent value="risk" className="h-full m-0 p-4">
                                <PreRiskChart risks={[]} />
                                <TabNavigationFooter currentTabId="risk" nextTabId="export" />
                            </TabsContent>

                            <TabsContent value="export" className="h-full m-0">
                                <Phase6ExportIntegration data={exportData} />
                                <TabNavigationFooter currentTabId="export" nextTabId="prognosis" nextLabel="View Prognosis Results" />
                            </TabsContent>

                            <TabsContent value="prognosis" className="h-full m-0 p-0">
                                <PrognosisTab 
                                    phase1Data={phase1Data}
                                    phase4Data={prognosisInput?.pp ? prognosisInput.pp.map((p,i) => ({
                                        depth: phase1Data.depths[i],
                                        pp_mean: p,
                                        fg_mean: prognosisInput.fg[i],
                                        obg_mean: prognosisInput.obg[i]
                                    })) : null}
                                    onNavigate={navigateToTab} 
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default PorePressureFracGradient;