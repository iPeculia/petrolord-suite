import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SlidersHorizontal, Edit, Target, Sliders, Columns, BarChart3, Palette, HelpCircle, FileDown, Wrench } from 'lucide-react';
import { useExpertMode } from '../../contexts/ExpertModeContext';
import { Button } from '@/components/ui/button';

const tools = [
    { id: 'properties', name: 'Property Editor', icon: Edit, description: "Edit rock properties by depth or zone." },
    { id: 'stresses', name: 'Stress Editor', icon: SlidersHorizontal, description: "Manually adjust calculated stress profiles." },
    { id: 'calibration', name: 'Calibration', icon: Target, description: "Calibrate model with LOT/FIT/minifrac data." },
    { id: 'scenarios', name: 'Scenario Builder', icon: Sliders, description: "Create and manage multiple what-if scenarios." },
    { id: 'comparison', name: 'Comparison', icon: Columns, description: "Compare scenarios side-by-side." },
    { id: 'sensitivity', name: 'Sensitivity', icon: BarChart3, description: "Analyze parameter impact on results." },
    { id: 'visualization', name: 'Visualization', icon: Palette, description: "Customize plots and annotations." },
    { id: 'export', name: 'Advanced Export', icon: FileDown, description: "Export scenarios, plots, and data." },
    { id: 'help', name: 'Expert Help', icon: HelpCircle, description: "Access documentation and tutorials." },
];

const ExpertToolsPanel = () => {
    const { showNotImplementedToast } = useExpertMode();

    return (
        <Card className="h-full bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center text-white"><Wrench className="w-5 h-5 mr-2" /> Expert Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {tools.map(tool => (
                     <Button key={tool.id} variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white" onClick={showNotImplementedToast}>
                        <tool.icon className="w-4 h-4 mr-3" />
                        {tool.name}
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
};

export default ExpertToolsPanel;