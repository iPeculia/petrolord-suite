import React from 'react';
import { useAdvancedAnalytics } from '../../../contexts/AdvancedAnalyticsContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Sigma } from 'lucide-react';

const StatisticalAnalysis = () => {
    const { showNotImplementedToast } = useAdvancedAnalytics();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Sigma className="w-6 h-6 mr-2" /> Statistical Analysis</CardTitle>
                <CardDescription className="text-slate-400">Perform in-depth statistical analysis, from descriptive stats to hypothesis testing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Sigma className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Statistical Analysis Toolkit Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Utilize a full suite of statistical tools including correlation, regression, and distribution analysis to rigorously validate your data and models.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default StatisticalAnalysis;