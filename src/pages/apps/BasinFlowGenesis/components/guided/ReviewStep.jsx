import React, { useState } from 'react';
import { useGuidedMode } from '../../contexts/GuidedModeContext';
import { Button } from '@/components/ui/button';
import { Loader2, Play, CheckCircle, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ReviewStep = () => {
    const { wizardData, runSimulation, goToStep } = useGuidedMode();
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        await runSimulation();
        // isRunning stays true until component unmounts/switches view
    };

    const sourceLayers = wizardData.layers.filter(l => l.sourceRock?.isSource);

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Run</h2>
                <p className="text-slate-400">Verify your parameters before initializing the simulation engine.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                
                {/* Template Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Basin Template</h3>
                        <div className="text-white font-medium">
                            {wizardData.selectedTemplateId ? wizardData.selectedTemplateId.replace('_', ' ').toUpperCase() : 'None'}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(1)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                        <Pencil className="w-3 h-3 mr-2" /> Edit
                    </Button>
                </div>

                {/* Stratigraphy Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Stratigraphy</h3>
                        <div className="text-white font-medium">{wizardData.layers.length} Layers defined</div>
                        <div className="text-xs text-slate-400">Total Thickness: {wizardData.layers.reduce((a,b)=>a+b.thickness,0)}m</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(2)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                        <Pencil className="w-3 h-3 mr-2" /> Edit
                    </Button>
                </div>

                {/* Petroleum System Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Petroleum System</h3>
                        <div className="text-white font-medium">
                            {sourceLayers.length > 0 ? (
                                <span className="text-emerald-400">{sourceLayers.length} Source Rocks</span>
                            ) : (
                                <span className="text-amber-500">No Source Rocks</span>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(3)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                        <Pencil className="w-3 h-3 mr-2" /> Edit
                    </Button>
                </div>

                {/* Heat Flow Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Thermal Model</h3>
                        <div className="text-white font-medium capitalize">{wizardData.heatFlowId.replace('_', ' ')}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(4)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                        <Pencil className="w-3 h-3 mr-2" /> Edit
                    </Button>
                </div>

                 {/* Erosion Summary */}
                 <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Erosion</h3>
                        <div className="text-white font-medium capitalize">{wizardData.erosionOption}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(5)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white">
                        <Pencil className="w-3 h-3 mr-2" /> Edit
                    </Button>
                </div>
            </div>

            <Button 
                size="lg" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 text-lg h-14"
                onClick={handleRun}
                disabled={isRunning}
            >
                {isRunning ? (
                    <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Simulating...</>
                ) : (
                    <><Play className="w-6 h-6 mr-2 fill-current" /> Run Simulation</>
                )}
            </Button>
        </div>
    );
};

export default ReviewStep;