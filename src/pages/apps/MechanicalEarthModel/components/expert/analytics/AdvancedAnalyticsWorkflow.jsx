import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedAnalyticsProvider } from '../../../contexts/AdvancedAnalyticsContext';
import PredictiveModeling from './PredictiveModeling';
import RiskAnalytics from './RiskAnalytics';
import MachineLearningPanel from './MachineLearningPanel';
import TrendAnalysis from './TrendAnalysis';
import AnomalyDetection from './AnomalyDetection';
import Forecasting from './Forecasting';
import StatisticalAnalysis from './StatisticalAnalysis';
import VisualizationAnalytics from './VisualizationAnalytics';
import AnalyticsExportPanel from './AnalyticsExportPanel';
import AnalyticsHelpPanel from './AnalyticsHelpPanel';
import { Bot, AlertTriangle, Cpu, TrendingUp, Search, Forward, Sigma, BarChartHorizontal, FileDown, HelpCircle } from 'lucide-react';

const AdvancedAnalyticsWorkflow = () => {
    return (
        <AdvancedAnalyticsProvider>
            <Tabs defaultValue="predictive" className="h-full flex flex-col">
                 <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-10 h-auto">
                    <TabsTrigger value="predictive"><Bot className="w-4 h-4 mr-2" />Predictive</TabsTrigger>
                    <TabsTrigger value="risk"><AlertTriangle className="w-4 h-4 mr-2" />Risk</TabsTrigger>
                    <TabsTrigger value="ml"><Cpu className="w-4 h-4 mr-2" />ML</TabsTrigger>
                    <TabsTrigger value="trends"><TrendingUp className="w-4 h-4 mr-2" />Trends</TabsTrigger>
                    <TabsTrigger value="anomaly"><Search className="w-4 h-4 mr-2" />Anomalies</TabsTrigger>
                    <TabsTrigger value="forecast"><Forward className="w-4 h-4 mr-2" />Forecast</TabsTrigger>
                    <TabsTrigger value="stats"><Sigma className="w-4 h-4 mr-2" />Stats</TabsTrigger>
                    <TabsTrigger value="viz"><BarChartHorizontal className="w-4 h-4 mr-2" />Visualize</TabsTrigger>
                    <TabsTrigger value="export"><FileDown className="w-4 h-4 mr-2" />Export</TabsTrigger>
                    <TabsTrigger value="help"><HelpCircle className="w-4 h-4 mr-2" />Help</TabsTrigger>
                </TabsList>

                <div className="flex-grow mt-4 overflow-y-auto">
                    <TabsContent value="predictive"><PredictiveModeling /></TabsContent>
                    <TabsContent value="risk"><RiskAnalytics /></TabsContent>
                    <TabsContent value="ml"><MachineLearningPanel /></TabsContent>
                    <TabsContent value="trends"><TrendAnalysis /></TabsContent>
                    <TabsContent value="anomaly"><AnomalyDetection /></TabsContent>
                    <TabsContent value="forecast"><Forecasting /></TabsContent>
                    <TabsContent value="stats"><StatisticalAnalysis /></TabsContent>
                    <TabsContent value="viz"><VisualizationAnalytics /></TabsContent>
                    <TabsContent value="export"><AnalyticsExportPanel /></TabsContent>
                    <TabsContent value="help"><AnalyticsHelpPanel /></TabsContent>
                </div>
            </Tabs>
        </AdvancedAnalyticsProvider>
    );
};

export default AdvancedAnalyticsWorkflow;