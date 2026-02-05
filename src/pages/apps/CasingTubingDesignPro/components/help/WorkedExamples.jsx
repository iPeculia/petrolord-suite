import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WorkedExamples = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Worked Examples</h3>
            
            <Tabs defaultValue="onshore" className="w-full">
                <TabsList className="bg-slate-900 w-full grid grid-cols-2 p-1 h-9">
                    <TabsTrigger value="onshore" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-lime-400">Onshore Well</TabsTrigger>
                    <TabsTrigger value="offshore" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400">Offshore Well</TabsTrigger>
                </TabsList>
                
                <TabsContent value="onshore" className="mt-4 space-y-4">
                    <div className="bg-slate-900 p-4 rounded border border-slate-800 text-xs space-y-2">
                        <h4 className="font-bold text-lime-400 mb-2">Scenario: 2000m Vertical Gas Well</h4>
                        <div className="grid grid-cols-2 gap-2 text-slate-400">
                            <span>TD:</span> <span className="text-white">2000m TVD</span>
                            <span>Pore Pressure:</span> <span className="text-white">1.10 SG</span>
                            <span>Surface Casing:</span> <span className="text-white">13-3/8" @ 500m</span>
                            <span>Intermediate:</span> <span className="text-white">9-5/8" @ 1500m</span>
                            <span>Production:</span> <span className="text-white">7" @ 2000m</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-800">
                            <p className="font-semibold text-slate-300">Design Logic:</p>
                            <p className="mt-1 text-slate-500">
                                7" Production Casing must withstand full gas column burst pressure to surface in case of a tubing leak. 
                                N-80 grade was selected for the top section (0-1000m) for burst, while lower grade K-55 sufficed for the bottom.
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="offshore" className="mt-4 space-y-4">
                    <div className="bg-slate-900 p-4 rounded border border-slate-800 text-xs space-y-2">
                        <h4 className="font-bold text-blue-400 mb-2">Scenario: 3500m Deviated Oil Well</h4>
                        <div className="grid grid-cols-2 gap-2 text-slate-400">
                            <span>TD:</span> <span className="text-white">3500m TVD</span>
                            <span>Water Depth:</span> <span className="text-white">150m</span>
                            <span>Conductor:</span> <span className="text-white">30" @ 250m</span>
                            <span>Surface:</span> <span className="text-white">20" @ 800m</span>
                            <span>Production:</span> <span className="text-white">9-5/8" @ 3500m</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-800">
                            <p className="font-semibold text-slate-300">Design Logic:</p>
                            <p className="mt-1 text-slate-500">
                                High collapse load at bottom due to reservoir depletion scenario. P-110 grade required for bottom 500m. 
                                Tension checks critical due to 35 deg deviation and doglegs.
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WorkedExamples;