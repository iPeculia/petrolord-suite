import React from 'react';
import { useAdvancedAnalytics } from '../../../contexts/AdvancedAnalyticsContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const RiskAnalytics = () => {
    const { showNotImplementedToast } = useAdvancedAnalytics();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><AlertTriangle className="w-6 h-6 mr-2" /> Risk Analytics</CardTitle>
                <CardDescription className="text-slate-400">Build risk matrices, identify high-risk zones, and calculate risk-adjusted parameters.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Risk Analytics Dashboard Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Quantify wellbore stability risks using interactive risk matrices, hotspot identification, and trend analysis to support mitigation planning.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default RiskAnalytics;