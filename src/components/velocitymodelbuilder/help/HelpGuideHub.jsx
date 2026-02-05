import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Layout, PlayCircle, Terminal, MessageCircle, 
  Settings, GraduationCap, Share2, 
  Zap, Database, FileText, AlertTriangle,
  Mountain, Atom, Scale, Cloud, Trophy
} from 'lucide-react';

// PHASE 11-12 COMPONENTS
import GettingStartedGuide from './GettingStartedGuide';
import FeatureDocumentation from './FeatureDocumentation';
import WorkflowGuides from './WorkflowGuides';
import BestPracticesGuide from './BestPracticesGuide';
import TroubleshootingGuide from './TroubleshootingGuide';
import APIReferenceGuide from './APIReferenceGuide';
import DataFormatGuide from './DataFormatGuide';
import VideoTutorialLibrary from './VideoTutorialLibrary';
import FAQSection from './FAQSection';
import GlossaryAndTerminology from './GlossaryAndTerminology';
import KeyboardShortcutsReference from './KeyboardShortcutsReference';
import SupportContactCenter from './SupportContactCenter';
import UserFeedbackSystem from './UserFeedbackSystem';
import HelpSearchEngine from './HelpSearchEngine';
import PrintableDocumentation from './PrintableDocumentation';
import AdvancedTechniquesGuide from './AdvancedTechniquesGuide';
import CaseStudiesLibrary from './CaseStudiesLibrary';
import RegionalVelocityDatabase from './RegionalVelocityDatabase';
import PerformanceOptimizationGuide from './PerformanceOptimizationGuide';
import SecurityAndComplianceGuide from './SecurityAndComplianceGuide';
import CustomizationAndExtensionGuide from './CustomizationAndExtensionGuide';
import MultilingualSupport from './MultilingualSupport';
import ComparisonAndMigrationGuides from './ComparisonAndMigrationGuides';
import PerformanceMetricsAndBenchmarks from './PerformanceMetricsAndBenchmarks';
import RegulatoryComplianceChecklist from './RegulatoryComplianceChecklist';
import AdvancedVisualizationGuide from './AdvancedVisualizationGuide';
import DataQualityAssessmentGuide from './DataQualityAssessmentGuide';
import ScenarioAnalysisGuide from './ScenarioAnalysisGuide';
import TeamTrainingProgram from './TeamTrainingProgram';
import TipsAndTricksCollection from './TipsAndTricksCollection';
import DepthConversionMathematicsGuide from './DepthConversionMathematicsGuide';
import QCStandardsAndMetrics from './QCStandardsAndMetrics';
import CollaborationBestPractices from './CollaborationBestPractices';
import AIFeatureExplanations from './AIFeatureExplanations';
import ExportWorkflowGuides from './ExportWorkflowGuides';
import VersioningStrategies from './VersioningStrategies';
import CommonMistakesAndPitfalls from './CommonMistakesAndPitfalls';
import CalculatorAndTools from './CalculatorAndTools';
import InteractiveExamples from './InteractiveExamples';
import CertificationAndTraining from './CertificationAndTraining';
import DocumentationUpdatesLog from './DocumentationUpdatesLog';
import IntegrationGuide from './IntegrationGuide';

// NEW COMPONENTS (PHASE 13)
import GeologicalContextGuide from './GeologicalContextGuide';
import VelocityPhysicsGuide from './VelocityPhysicsGuide';
import CheckshotVSPMastery from './CheckshotVSPMastery';
import SonicLogInterpretationGuide from './SonicLogInterpretationGuide';
import ReservoirCharacterizationGuide from './ReservoirCharacterizationGuide';
import PressurePredictionGuide from './PressurePredictionGuide';
import DepthConversionValidationGuide from './DepthConversionValidationGuide';
import SeismicVelocityPickingGuide from './SeismicVelocityPickingGuide';
import PreStackDepthMigrationGuide from './PreStackDepthMigrationGuide';
import FullWaveformInversionGuide from './FullWaveformInversionGuide';
import DepthMigrationQCGuide from './DepthMigrationQCGuide';
import WellCorrelationGuide from './WellCorrelationGuide';
import ReservesCalculationGuide from './ReservesCalculationGuide';
import RiskAssessmentGuide from './RiskAssessmentGuide';
import DataManagementBestPracticesGuide from './DataManagementBestPracticesGuide';
import WorkflowAutomationGuide from './WorkflowAutomationGuide';
import ReportingAndDocumentationGuide from './ReportingAndDocumentationGuide';
import ExportFormatDetailsGuide from './ExportFormatDetailsGuide';
import IntegrationWithGeoSoftwareGuide from './IntegrationWithGeoSoftwareGuide';
import CloudComputingGuide from './CloudComputingGuide';
import HighPerformanceComputingGuide from './HighPerformanceComputingGuide';
import MachineLearningApplicationsGuide from './MachineLearningApplicationsGuide';
import DeepLearningApplicationsGuide from './DeepLearningApplicationsGuide';
import DataVisualizationGuide from './DataVisualizationGuide';
import PublicationAndPresentationGuide from './PublicationAndPresentationGuide';
import AcademicResearchGuide from './AcademicResearchGuide';
import IndustryStandardsGuide from './IndustryStandardsGuide';
import TroubleshootingAdvancedGuide from './TroubleshootingAdvancedGuide';
import UserSuccessStoriesGuide from './UserSuccessStoriesGuide';
import RoadmapAndFutureGuide from './RoadmapAndFutureGuide';
import EnvironmentalAndSustainabilityGuide from './EnvironmentalAndSustainabilityGuide';
import EconomicsAndCostAnalysisGuide from './EconomicsAndCostAnalysisGuide';
import LegalAndIPGuide from './LegalAndIPGuide';
import AccessibilityGuide from './AccessibilityGuide';

const HelpGuideHub = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
        <div className="p-6 pb-0 flex-shrink-0">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Velocity Modeling Knowledge Base</h1>
                    <p className="text-slate-400 mb-6">The complete encyclopedia for depth conversion, from basic physics to advanced AI workflows.</p>
                </div>
                <MultilingualSupport />
            </div>
            <HelpSearchEngine />
        </div>

        <Tabs defaultValue="start" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 border-b border-slate-800 bg-slate-900/50">
                <TabsList className="bg-transparent h-12 w-full justify-start gap-6 overflow-x-auto no-scrollbar">
                    <TabsTrigger value="start" className="data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Layout className="w-4 h-4 mr-2"/> Start</TabsTrigger>
                    <TabsTrigger value="geo" className="data-[state=active]:text-amber-400 data-[state=active]:border-b-2 data-[state=active]:border-amber-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Mountain className="w-4 h-4 mr-2"/> Geology</TabsTrigger>
                    <TabsTrigger value="physics" className="data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Atom className="w-4 h-4 mr-2"/> Physics</TabsTrigger>
                    <TabsTrigger value="data" className="data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Database className="w-4 h-4 mr-2"/> Data</TabsTrigger>
                    <TabsTrigger value="modeling" className="data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Zap className="w-4 h-4 mr-2"/> Modeling</TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:text-pink-400 data-[state=active]:border-b-2 data-[state=active]:border-pink-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Settings className="w-4 h-4 mr-2"/> Advanced</TabsTrigger>
                    <TabsTrigger value="integration" className="data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Share2 className="w-4 h-4 mr-2"/> Integration</TabsTrigger>
                    <TabsTrigger value="cloud" className="data-[state=active]:text-sky-400 data-[state=active]:border-b-2 data-[state=active]:border-sky-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Cloud className="w-4 h-4 mr-2"/> Cloud/AI</TabsTrigger>
                    <TabsTrigger value="business" className="data-[state=active]:text-yellow-400 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><Trophy className="w-4 h-4 mr-2"/> Business</TabsTrigger>
                    <TabsTrigger value="support" className="data-[state=active]:text-slate-400 data-[state=active]:border-b-2 data-[state=active]:border-slate-400 rounded-none px-0 pb-3 bg-transparent whitespace-nowrap"><MessageCircle className="w-4 h-4 mr-2"/> Support</TabsTrigger>
                </TabsList>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-950 relative">
                {/* 1. GETTING STARTED */}
                <TabsContent value="start" className="h-full m-0 p-6 overflow-y-auto">
                    <GettingStartedGuide />
                    <div className="mt-8 space-y-8">
                        <WorkflowGuides />
                        <InteractiveExamples />
                        <VideoTutorialLibrary />
                        <FAQSection />
                        <UserFeedbackSystem />
                    </div>
                </TabsContent>

                {/* 2. GEOLOGICAL FOUNDATIONS */}
                <TabsContent value="geo" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <GeologicalContextGuide />
                        <RegionalVelocityDatabase />
                        <ReservoirCharacterizationGuide />
                        <PressurePredictionGuide />
                        <WellCorrelationGuide />
                    </div>
                </TabsContent>

                {/* 3. VELOCITY PHYSICS */}
                <TabsContent value="physics" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <VelocityPhysicsGuide />
                        <DepthConversionMathematicsGuide />
                        <SonicLogInterpretationGuide />
                        <AdvancedTechniquesGuide /> {/* Anisotropy is here */}
                    </div>
                </TabsContent>

                {/* 4. DATA ACQUISITION & QC */}
                <TabsContent value="data" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <CheckshotVSPMastery />
                        <SeismicVelocityPickingGuide />
                        <DataQualityAssessmentGuide />
                        <QCStandardsAndMetrics />
                        <DataManagementBestPracticesGuide />
                        <RegulatoryComplianceChecklist />
                    </div>
                </TabsContent>

                {/* 5. MODELING & DEPTH CONVERSION */}
                <TabsContent value="modeling" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <FeatureDocumentation />
                        <BestPracticesGuide />
                        <DepthConversionValidationGuide />
                        <ReservesCalculationGuide />
                        <RiskAssessmentGuide />
                        <ScenarioAnalysisGuide />
                        <WorkflowAutomationGuide />
                    </div>
                </TabsContent>

                {/* 6. ADVANCED TECHNIQUES (PSDM/FWI) */}
                <TabsContent value="advanced" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <PreStackDepthMigrationGuide />
                        <FullWaveformInversionGuide />
                        <DepthMigrationQCGuide />
                        <AdvancedVisualizationGuide />
                        <CustomizationAndExtensionGuide />
                        <TroubleshootingAdvancedGuide />
                    </div>
                </TabsContent>

                {/* 7. INTEGRATION & EXPORT */}
                <TabsContent value="integration" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <IntegrationGuide />
                        <IntegrationWithGeoSoftwareGuide />
                        <ExportWorkflowGuides />
                        <ExportFormatDetailsGuide />
                        <ComparisonAndMigrationGuides />
                        <APIReferenceGuide />
                        <DataFormatGuide />
                    </div>
                </TabsContent>

                {/* 8. CLOUD & AI */}
                <TabsContent value="cloud" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <CloudComputingGuide />
                        <HighPerformanceComputingGuide />
                        <MachineLearningApplicationsGuide />
                        <DeepLearningApplicationsGuide />
                        <AIFeatureExplanations />
                        <PerformanceOptimizationGuide />
                        <EnvironmentalAndSustainabilityGuide />
                    </div>
                </TabsContent>

                {/* 9. BUSINESS & STANDARDS */}
                <TabsContent value="business" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <EconomicsAndCostAnalysisGuide />
                        <UserSuccessStoriesGuide />
                        <RoadmapAndFutureGuide />
                        <IndustryStandardsGuide />
                        <ReportingAndDocumentationGuide />
                        <PublicationAndPresentationGuide />
                        <AcademicResearchGuide />
                        <LegalAndIPGuide />
                        <SecurityAndComplianceGuide />
                    </div>
                </TabsContent>

                {/* 10. SUPPORT */}
                <TabsContent value="support" className="h-full m-0 p-6 overflow-y-auto">
                    <div className="space-y-12">
                        <SupportContactCenter />
                        <TroubleshootingGuide />
                        <GlossaryAndTerminology />
                        <KeyboardShortcutsReference />
                        <TeamTrainingProgram />
                        <CertificationAndTraining />
                        <TipsAndTricksCollection />
                        <AccessibilityGuide />
                        <DocumentationUpdatesLog />
                    </div>
                    <PrintableDocumentation />
                </TabsContent>
            </div>
        </Tabs>
    </div>
  );
};

export default HelpGuideHub;