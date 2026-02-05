import React, { useState } from 'react';
import { useCasingTubingDesign } from '../contexts/CasingTubingDesignContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, ShieldCheck, Database, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CatalogBrowser from './CatalogBrowser';

const RightPanel = () => {
    const { safetyFactors, setSafetyFactors } = useCasingTubingDesign();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    if (isCollapsed) {
        return (
            <div className="w-14 bg-slate-950 border-l border-slate-800 flex flex-col items-center py-4 space-y-6 shrink-0 transition-all duration-300 z-10">
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="text-slate-400 hover:text-white">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="h-px w-8 bg-slate-800" />
                <Button variant="ghost" size="icon" title="Safety Factors">
                    <ShieldCheck className="w-5 h-5 text-slate-400 hover:text-blue-400" />
                </Button>
                <Button variant="ghost" size="icon" title="KPIs">
                    <Activity className="w-5 h-5 text-slate-400 hover:text-emerald-400" />
                </Button>
            </div>
        );
    }

    return (
        <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 transition-all duration-300 overflow-y-auto custom-scrollbar z-10">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                <span className="text-sm font-semibold text-slate-200">Analysis Parameters</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCollapsed(true)}>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </Button>
            </div>

            <div className="p-4 space-y-6">
                
                {/* KPI Section */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
                        <Activity className="w-3 h-3 mr-2" /> Design KPIs
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 block mb-1">Min Burst SF</span>
                            <span className="text-xl font-mono font-bold text-emerald-400">1.45</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 block mb-1">Min Coll SF</span>
                            <span className="text-xl font-mono font-bold text-amber-400">1.05</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 block mb-1">Cost Est.</span>
                            <span className="text-sm font-mono text-white">$450k</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-[10px] text-slate-500 block mb-1">Total Weight</span>
                            <span className="text-sm font-mono text-white">285 klb</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-xs text-amber-200 font-medium block">Controlling Load</span>
                            <span className="text-[10px] text-slate-400">Evacuation (Collapse) at 8,500ft</span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Safety Factors */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2 text-blue-400" /> Design Factors
                    </h4>
                    
                    <div className="space-y-4 bg-slate-900/30 p-3 rounded border border-slate-800">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <Label className="text-slate-400">Burst Factor</Label>
                                <span className="text-slate-500 font-mono text-[10px]">Default: 1.1</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="number" 
                                    step="0.05"
                                    value={safetyFactors.burst}
                                    onChange={(e) => setSafetyFactors({...safetyFactors, burst: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-700 text-xs font-mono text-right"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <Label className="text-slate-400">Collapse Factor</Label>
                                <span className="text-slate-500 font-mono text-[10px]">Default: 1.0</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="number" 
                                    step="0.05"
                                    value={safetyFactors.collapse}
                                    onChange={(e) => setSafetyFactors({...safetyFactors, collapse: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-700 text-xs font-mono text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <Label className="text-slate-400">Tension Factor</Label>
                                <span className="text-slate-500 font-mono text-[10px]">Default: 1.6</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="number" 
                                    step="0.05"
                                    value={safetyFactors.tension}
                                    onChange={(e) => setSafetyFactors({...safetyFactors, tension: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-700 text-xs font-mono text-right"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <Label className="text-slate-400">Triaxial Factor</Label>
                                <span className="text-slate-500 font-mono text-[10px]">Default: 1.25</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="number" 
                                    step="0.05"
                                    value={safetyFactors.triaxial}
                                    onChange={(e) => setSafetyFactors({...safetyFactors, triaxial: parseFloat(e.target.value)})}
                                    className="h-8 bg-slate-950 border-slate-700 text-xs font-mono text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Catalog / Material */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center">
                        <Database className="w-4 h-4 mr-2 text-purple-400" /> Catalog
                    </h4>
                    <Button 
                        variant="outline" 
                        className="w-full text-xs h-9 bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={() => setIsCatalogOpen(true)}
                    >
                        Browse Casing Catalog
                    </Button>
                    <Button variant="outline" className="w-full text-xs h-9 bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        Connection Library
                    </Button>
                </div>

            </div>
            
            <CatalogBrowser open={isCatalogOpen} onOpenChange={setIsCatalogOpen} />
        </div>
    );
};

export default RightPanel;