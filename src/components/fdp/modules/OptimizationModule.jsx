import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Button } from '@/components/ui/button';
import { Settings, Sliders, Target, TrendingDown } from 'lucide-react';
import OptimizationOverview from './optimization/OptimizationOverview';
import ScenarioOptimization from './optimization/ScenarioOptimization';
import CostOptimization from './optimization/CostOptimization';

const OptimizationModule = () => {
    const { state } = useFDP();
    const [activeTool, setActiveTool] = useState('overview');

    const renderTool = () => {
        switch(activeTool) {
            case 'scenario': return <ScenarioOptimization />;
            case 'cost': return <CostOptimization />;
            default: return <OptimizationOverview />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Optimization</h2>
                    <p className="text-slate-400">Maximize value and minimize cost using advanced algorithms.</p>
                </div>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <Button 
                        variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('overview')}
                        className="text-xs"
                    >
                        <Target className="w-4 h-4 mr-2" /> Overview
                    </Button>
                    <Button 
                        variant={activeTool === 'scenario' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('scenario')}
                        className="text-xs"
                    >
                        <Sliders className="w-4 h-4 mr-2" /> Scenarios
                    </Button>
                    <Button 
                        variant={activeTool === 'cost' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('cost')}
                        className="text-xs"
                    >
                        <TrendingDown className="w-4 h-4 mr-2" /> Cost & Value
                    </Button>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default OptimizationModule;