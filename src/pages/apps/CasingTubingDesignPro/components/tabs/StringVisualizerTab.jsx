import React, { useState } from 'react';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import WellboreVisualization from '../visualizer/WellboreVisualization';
import DesignComparison from '../visualizer/DesignComparison';
import IntegrationPanel from '../visualizer/IntegrationPanel';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Camera } from 'lucide-react';

const StringVisualizerTab = () => {
    const { casingStrings, tubingStrings } = useCasingTubingDesign();
    const [compareMode, setCompareMode] = useState(false);

    // Mock baseline for comparison
    const baselineDesign = {
        casingStrings: casingStrings.map(c => ({...c, bottom_depth: c.bottom_depth * 0.9})), // Mock difference
        tubingStrings: tubingStrings
    };

    const currentDesign = { casingStrings, tubingStrings };

    return (
        <div className="h-full flex flex-col bg-slate-950 px-0 py-0 space-y-0 overflow-hidden w-full">
            
            {/* Controls */}
            <div className="flex justify-between items-center bg-slate-900/50 p-2 border-b border-slate-800 mt-0 shrink-0">
                <div className="flex items-center space-x-6 px-2">
                    <div className="flex items-center space-x-2">
                        <Switch id="compare-mode" checked={compareMode} onCheckedChange={setCompareMode} className="scale-75" />
                        <Label htmlFor="compare-mode" className="text-xs text-slate-300">Compare Mode</Label>
                    </div>
                    <div className="h-4 w-px bg-slate-700" />
                    <span className="text-xs text-slate-500">
                        Visualizing {casingStrings.length} Casing Strings, {tubingStrings.length} Tubing String
                    </span>
                </div>
                <div className="flex space-x-2 px-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-white">
                        <Camera className="w-3.5 h-3.5 mr-2" /> Snapshot
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 text-slate-300">
                        <Download className="w-3.5 h-3.5 mr-2" /> Export SVG
                    </Button>
                </div>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 min-h-0 bg-slate-950 relative overflow-hidden p-0">
                {compareMode ? (
                    <DesignComparison designA={currentDesign} designB={baselineDesign} />
                ) : (
                    <WellboreVisualization 
                        casingStrings={casingStrings} 
                        tubingStrings={tubingStrings} 
                        width={600} 
                    />
                )}
            </div>

            {/* Integration Panel */}
            <div className="shrink-0 border-t border-slate-800 p-2 bg-slate-900/30">
                <IntegrationPanel />
            </div>
        </div>
    );
};

export default StringVisualizerTab;