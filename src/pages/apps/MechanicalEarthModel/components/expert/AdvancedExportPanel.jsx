import React from 'react';
import { useExpertMode } from '../../contexts/ExpertModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { FileDown } from 'lucide-react';

const AdvancedExportPanel = () => {
    const { showNotImplementedToast } = useExpertMode();

    return (
        <Card className="h-full bg-transparent border-none">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><FileDown className="w-6 h-6 mr-2" /> Advanced Export</CardTitle>
                <CardDescription className="text-slate-400">Export scenarios, comparisons, plots, and sensitivity analyses.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-center">
                 <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <FileDown className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">Advanced Export Options Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4 max-w-md">This panel will provide comprehensive export capabilities, including JSON for scenarios, CSV for data, and high-resolution images for plots.</p>
                <Button onClick={showNotImplementedToast}>Request This Feature</Button>
            </CardContent>
        </Card>
    );
};

export default AdvancedExportPanel;