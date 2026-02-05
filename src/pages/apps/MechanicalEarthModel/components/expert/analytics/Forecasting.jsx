import React from 'react';
import { useAdvancedAnalytics } from '../../../contexts/AdvancedAnalyticsContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Forward } from 'lucide-react';

const Forecasting = () => {
    const { showNotImplementedToast } = useAdvancedAnalytics();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Forward className="w-6 h-6 mr-2" /> Forecasting</CardTitle>
                <CardDescription className="text-slate-400">Forecast geomechanical parameters at future depths with confidence intervals.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Forward className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Geomechanical Forecasting Engine Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Project pressure, stress, and properties ahead of the bit. Run scenario-based forecasts and compare outcomes to de-risk drilling operations.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default Forecasting;