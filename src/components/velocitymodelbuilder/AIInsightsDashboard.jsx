import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Zap, MessageSquare, CheckSquare, Sliders, Globe, Microscope, Layers } from 'lucide-react';

// Import Sub-Components
import AIVelocityModelSuggester from './AIVelocityModelSuggester';
import AutomatedOutlierDetectionCorrection from './AutomatedOutlierDetectionCorrection';
import SmartLayerPickingEngine from './SmartLayerPickingEngine';
import PredictiveDepthUncertaintyEstimator from './PredictiveDepthUncertaintyEstimator';
import NaturalLanguageQueryEngine from './NaturalLanguageQueryEngine';
import AIModelRecommendationEngine from './AIModelRecommendationEngine';
import AutomatedQCWorkflow from './AutomatedQCWorkflow';
import VelocityTrendLearningModule from './VelocityTrendLearningModule';
import ParameterOptimizationEngine from './ParameterOptimizationEngine';
import BatchAIProcessing from './BatchAIProcessing';
import ContextualHelpAssistant from './ContextualHelpAssistant';

const AIInsightsDashboard = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* Floating Contextual Help (Demo Position) */}
      <div className="absolute bottom-4 right-4 z-50">
        <ContextualHelpAssistant />
      </div>

      <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/50 p-1">
        <Tabs defaultValue="intelligence" className="w-full h-full flex flex-col">
            <div className="px-2 mb-2 flex justify-between items-center">
                <TabsList className="justify-start h-9 bg-transparent p-0 gap-1">
                    <TabsTrigger value="intelligence" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 border border-transparent data-[state=active]:border-slate-700">
                        <BrainCircuit className="w-3 h-3 mr-2" /> Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="optimization" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-orange-400 border border-transparent data-[state=active]:border-slate-700">
                        <Zap className="w-3 h-3 mr-2" /> Optimization
                    </TabsTrigger>
                    <TabsTrigger value="qc" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                        <CheckSquare className="w-3 h-3 mr-2" /> Auto-QC
                    </TabsTrigger>
                    <TabsTrigger value="assistant" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 border border-transparent data-[state=active]:border-slate-700">
                        <MessageSquare className="w-3 h-3 mr-2" /> Assistant
                    </TabsTrigger>
                </TabsList>
                
                <div className="text-[10px] text-slate-500 flex items-center gap-2">
                    <span className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></div> AI Online</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-950 relative p-4">
                <TabsContent value="intelligence" className="h-full m-0 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AIVelocityModelSuggester />
                            <AIModelRecommendationEngine />
                            <VelocityTrendLearningModule />
                            <SmartLayerPickingEngine />
                        </div>
                        <div className="lg:col-span-1 space-y-4">
                            <PredictiveDepthUncertaintyEstimator />
                            <AutomatedOutlierDetectionCorrection />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="optimization" className="h-full m-0 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                        <div className="md:col-span-1"><ParameterOptimizationEngine /></div>
                        <div className="md:col-span-2"><BatchAIProcessing /></div>
                    </div>
                </TabsContent>

                <TabsContent value="qc" className="h-full m-0 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <AutomatedQCWorkflow />
                        <AutomatedOutlierDetectionCorrection />
                    </div>
                </TabsContent>

                <TabsContent value="assistant" className="h-full m-0 overflow-y-auto">
                    <div className="max-w-2xl mx-auto h-full">
                        <NaturalLanguageQueryEngine />
                    </div>
                </TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AIInsightsDashboard;