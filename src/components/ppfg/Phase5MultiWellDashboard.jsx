import React, { useState } from 'react';
import { usePhase5State } from '@/hooks/usePhase5State';
import { Loader2, Map as MapIcon, BarChart2, AlertCircle, Layers, Globe } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import WellSelector from './WellSelector';
import MultiWellOverlayChart from './MultiWellOverlayChart';
import AnomalyDetectionPanel from './AnomalyDetectionPanel';
import PortfolioRiskDashboard from './PortfolioRiskDashboard';
import WellMapVisualization from './WellMapVisualization';
import FieldStatisticsSummary from './FieldStatisticsSummary';

// Placeholder components for new tabs requested
const FieldTrendsTab = () => <div className="p-4 text-slate-500">Field Trends Analysis (Under Construction)</div>;
const PressureCompartmentTab = () => <div className="p-4 text-slate-500">Pressure Compartments (Under Construction)</div>;

const Phase5MultiWellDashboard = () => {
    const { 
        wells, 
        selectedWellIds, 
        toggleWellSelection, 
        stats, 
        anomalies, 
        portfolioRisk,
        isLoading 
    } = usePhase5State();

    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading) {
        return <div className="flex h-full items-center justify-center text-slate-500"><Loader2 className="animate-spin mr-2" /> Loading Field Data...</div>;
    }

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden">
            {/* Left Sidebar: Selection */}
            <WellSelector 
                wells={wells} 
                selectedIds={selectedWellIds} 
                onToggle={toggleWellSelection} 
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    {/* Top Toolbar */}
                    <div className="h-12 border-b border-slate-800 bg-slate-950 flex items-center px-4 justify-between shrink-0">
                         <div className="flex items-center gap-4">
                            <h2 className="text-sm font-bold text-slate-200">Multi-Well Analysis</h2>
                         </div>
                         <TabsList className="bg-slate-900 border border-slate-800">
                            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-white">Overview</TabsTrigger>
                            <TabsTrigger value="comparison" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-white">Comparison</TabsTrigger>
                            <TabsTrigger value="map" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-white">Map View</TabsTrigger>
                         </TabsList>
                    </div>

                    {/* Dashboard Content */}
                    <div className="flex-1 p-4 overflow-hidden bg-slate-950">
                        
                        <TabsContent value="overview" className="h-full m-0 grid grid-rows-[auto_1fr_1fr] gap-4">
                             {/* Row 1: Summary Stats */}
                            <div className="h-20 shrink-0">
                                <FieldStatisticsSummary stats={stats} />
                            </div>

                            {/* Row 2: Main Viz */}
                            <div className="min-h-0 flex gap-4">
                                <div className="flex-1">
                                     <MultiWellOverlayChart wells={wells.filter(w => selectedWellIds.includes(w.id))} stats={stats} />
                                </div>
                                <div className="w-1/3 min-w-[300px]">
                                    <PortfolioRiskDashboard portfolioRisk={portfolioRisk} />
                                </div>
                            </div>

                            {/* Row 3: Anomalies */}
                            <div className="min-h-0 border border-slate-800 rounded-lg overflow-hidden">
                                <AnomalyDetectionPanel anomalies={anomalies} />
                            </div>
                        </TabsContent>

                        <TabsContent value="comparison" className="h-full m-0">
                             <div className="h-full flex flex-col gap-4">
                                <div className="flex-1 border border-slate-800 rounded-lg bg-slate-900/20 p-2">
                                    <MultiWellOverlayChart wells={wells.filter(w => selectedWellIds.includes(w.id))} stats={stats} />
                                </div>
                             </div>
                        </TabsContent>

                        <TabsContent value="map" className="h-full m-0">
                             <WellMapVisualization wells={wells} selectedIds={selectedWellIds} onToggle={toggleWellSelection} />
                        </TabsContent>

                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default Phase5MultiWellDashboard;