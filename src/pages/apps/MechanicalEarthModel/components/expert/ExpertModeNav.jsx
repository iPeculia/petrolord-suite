import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Edit, Target, Sliders, Columns, BarChart3, Palette, HelpCircle, FileDown, Wrench } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const sections = [
    { id: 'properties', name: 'Properties', icon: Edit, description: "Edit rock properties" },
    { id: 'stresses', name: 'Stresses', icon: SlidersHorizontal, description: "Adjust stress profiles" },
    { id: 'calibration', name: 'Calibration', icon: Target, description: "Calibrate with test data" },
    { id: 'scenarios', name: 'Scenarios', icon: Sliders, description: "Build what-if scenarios" },
    { id: 'comparison', name: 'Comparison', icon: Columns, description: "Compare scenarios" },
    { id: 'sensitivity', name: 'Sensitivity', icon: BarChart3, description: "Run sensitivity analysis" },
    { id: 'visualization', name: 'Visualization', icon: Palette, description: "Customize plots" },
    { id: 'export', name: 'Export', icon: FileDown, description: "Export data and reports" },
    { id: 'help', name: 'Help', icon: HelpCircle, description: "Get help and documentation" },
];

const ExpertModeNav = ({ activeSection, setActiveSection }) => {
    return (
        <nav className="flex flex-col p-2 bg-slate-800/50 rounded-lg border border-slate-700">
            <h2 className="text-lg font-semibold text-white p-2 flex items-center"><Wrench className="w-5 h-5 mr-2" /> Expert Nav</h2>
            <div className="flex flex-col space-y-1 mt-2">
                <TooltipProvider>
                    {sections.map(section => (
                        <Tooltip key={section.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeSection === section.id ? 'secondary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <section.icon className="w-4 h-4 mr-3" />
                                    <span>{section.name}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{section.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </nav>
    );
};

export default ExpertModeNav;