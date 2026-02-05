import React from 'react';
import { useExpertMode } from '../../contexts/ExpertModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Columns } from 'lucide-react';

const ComparisonPanel = () => {
    const { showNotImplementedToast } = useExpertMode();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Columns className="w-6 h-6 mr-2" /> Scenario Comparison</CardTitle>
                <CardDescription className="text-slate-400">Compare two or more scenarios side-by-side to analyze differences in results.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Columns className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Advanced Comparison Tools Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">Visualize the differences between scenarios with dedicated comparison plots and summary tables to support your decisions.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default ComparisonPanel;