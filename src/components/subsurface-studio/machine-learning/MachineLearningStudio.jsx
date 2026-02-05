import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Layers, TrendingUp, Search, CopyPlus, Book, Cpu, MessageSquare } from 'lucide-react';

// Component Imports
import MLModelManager from './MLModelManager';
import AutomatedInterpretation from './AutomatedInterpretation';
import PredictiveModeling from './PredictiveModeling';
import AnomalyDetectionAI from './AnomalyDetectionAI';
import PatternRecognition from './PatternRecognition';
import RecommendationEngine from './RecommendationEngine';
import NaturalLanguageProcessing from './NaturalLanguageProcessing';
import ImageRecognition from './ImageRecognition';
import DataAugmentation from './DataAugmentation';
import ModelEvaluation from './ModelEvaluation';
import FeatureEngineering from './FeatureEngineering';
import AIDocumentation from './AIDocumentation';

const MachineLearningStudio = () => {
    return (
        <div className="h-full flex bg-slate-900 text-white">
            <Tabs defaultValue="models" orientation="vertical" className="flex w-full h-full">
                {/* Sidebar Navigation */}
                <div className="w-16 md:w-64 border-r border-slate-800 bg-slate-950 flex-shrink-0">
                    <div className="p-4 border-b border-slate-800 font-bold text-sm flex items-center text-purple-400">
                        <Cpu className="w-5 h-5 mr-2" />
                        <span className="hidden md:inline">AI Studio</span>
                    </div>
                    <TabsList className="flex flex-col h-full justify-start bg-transparent space-y-1 p-2 w-full">
                        <TabsTrigger value="models" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-purple-400">
                            <Brain className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Model Manager</span>
                        </TabsTrigger>
                        <TabsTrigger value="interp" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-cyan-400">
                            <Layers className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Auto-Interpretation</span>
                        </TabsTrigger>
                        <TabsTrigger value="predict" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-emerald-400">
                            <TrendingUp className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Prediction</span>
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-blue-400">
                            <Search className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Advanced Analysis</span>
                        </TabsTrigger>
                        <TabsTrigger value="dataops" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-orange-400">
                            <CopyPlus className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Data Ops</span>
                        </TabsTrigger>
                        <TabsTrigger value="nlp" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-teal-400">
                            <MessageSquare className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Assistant</span>
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="w-full justify-start px-2 data-[state=active]:bg-slate-900 text-slate-400 data-[state=active]:text-slate-200">
                            <Book className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Documentation</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow h-full overflow-hidden bg-slate-900">
                    <TabsContent value="models" className="h-full m-0 p-4 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                            <div className="lg:col-span-2"><MLModelManager /></div>
                            <div className="space-y-4">
                                <ModelEvaluation />
                                <FeatureEngineering />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="interp" className="h-full m-0 p-4 overflow-y-auto">
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                            <div className="lg:col-span-2"><AutomatedInterpretation /></div>
                            <div><ImageRecognition /></div>
                        </div>
                    </TabsContent>

                    <TabsContent value="predict" className="h-full m-0 p-4 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <PredictiveModeling />
                            <RecommendationEngine />
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="h-full m-0 p-4 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <AnomalyDetectionAI />
                            <PatternRecognition />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="dataops" className="h-full m-0 p-4 overflow-y-auto">
                        <div className="max-w-xl">
                            <DataAugmentation />
                        </div>
                    </TabsContent>

                    <TabsContent value="nlp" className="h-full m-0 p-4">
                        <div className="h-full max-w-2xl mx-auto">
                            <NaturalLanguageProcessing />
                        </div>
                    </TabsContent>

                    <TabsContent value="docs" className="h-full m-0 p-4 overflow-y-auto">
                        <AIDocumentation />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default MachineLearningStudio;