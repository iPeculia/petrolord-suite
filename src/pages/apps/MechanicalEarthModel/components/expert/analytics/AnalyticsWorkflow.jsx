import React from 'react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';
import { motion, AnimatePresence } from 'framer-motion';

import AnalyticsDashboard from './AnalyticsDashboard';
import ResultsVisualization from './ResultsVisualization';
import DetailedMetricsPanel from './DetailedMetricsPanel';
import ComparisonTools from './ComparisonTools';
import QualityMetricsPanel from './QualityMetricsPanel';
import TrendAnalysisPanel from './TrendAnalysisPanel';
import DepthBasedAnalysisPanel from './DepthBasedAnalysisPanel';
import RiskAssessmentPanel from './RiskAssessmentPanel';
import AnalyticsExportPanel from './AnalyticsExportPanel';

const panels = {
    dashboard: AnalyticsDashboard,
    results: ResultsVisualization,
    metrics: DetailedMetricsPanel,
    comparison: ComparisonTools,
    quality: QualityMetricsPanel,
    trends: TrendAnalysisPanel,
    depth: DepthBasedAnalysisPanel,
    risk: RiskAssessmentPanel,
    export: AnalyticsExportPanel,
};

const AnalyticsWorkflow = () => {
    const { state } = useAnalytics();
    const ActivePanel = panels[state.activeTab] || (() => <div>Panel not found</div>);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={state.activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
            >
                <ActivePanel />
            </motion.div>
        </AnimatePresence>
    );
};

export default AnalyticsWorkflow;