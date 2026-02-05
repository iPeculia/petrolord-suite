import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import AnalyticsNav from './components/expert/analytics/AnalyticsNav';
import AnalyticsWorkflow from './components/expert/analytics/AnalyticsWorkflow';
import { Button } from '@/components/ui/button';

const Analytics = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results;

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-8">
                <h2 className="text-2xl font-bold mb-4">No Results to Analyze</h2>
                <p className="text-slate-400 mb-8 text-center">
                    Calculation results were not found. Please run a calculation in Guided or Expert Mode to view analytics.
                </p>
                <Button onClick={() => navigate('/dashboard/apps/geoscience/mechanical-earth-model')}>
                    Return to MEM Home
                </Button>
            </div>
        );
    }
    
    return (
        <AnalyticsProvider initialData={results}>
            <div className="flex h-screen bg-slate-900 text-white">
                <AnalyticsNav />
                <main className="flex-1 p-6 overflow-auto">
                    <AnalyticsWorkflow />
                </main>
            </div>
        </AnalyticsProvider>
    );
};

export default Analytics;