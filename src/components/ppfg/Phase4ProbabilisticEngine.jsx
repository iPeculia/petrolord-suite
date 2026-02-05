import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import UncertaintyInputPanel from './UncertaintyInputPanel';
import MonteCarloSettings from './MonteCarloSettings';
import ProbabilisticResultsDisplay from './ProbabilisticResultsDisplay';
import RiskHeatmap from './RiskHeatmap';
import { Card } from '@/components/ui/card';
import { runMonteCarloSimulation } from '@/utils/monteCarloEngine';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Phase4ProbabilisticEngine = ({ initialData, baseParams }) => {
    const { toast } = useToast();
    const [uncertaintyConfig, setUncertaintyConfig] = useState({
        logNoise: 0.05,
        modelVariance: 0.1,
        trendResiduals: 0.05
    });
    
    const [mcSettings, setMcSettings] = useState({
        iterations: 100, // Default low for quick test
        distribution: 'normal'
    });

    const [probResults, setProbResults] = useState(null);
    const [riskMap, setRiskMap] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [progress, setProgress] = useState(0);

    const runSimulation = async () => {
        if (!initialData || !initialData.depths) {
            toast({ title: "No Input Data", description: "Please load Phase 1 data first.", variant: "destructive" });
            return;
        }

        setIsCalculating(true);
        setProgress(0);

        try {
            // Prepare clean input object for engine
            const engineInput = {
                obg: initialData.obg || initialData.depths.map(d => 8.5 + (d/1000)), // Fallback if Phase 2 skipped
                dt: initialData.dt,
                nct: initialData.depths.map(d => 180 * Math.exp(-0.00005 * d)) // Fallback
            };

            // Use async engine
            const results = await runMonteCarloSimulation(
                initialData.depths,
                engineInput,
                baseParams,
                uncertaintyConfig,
                mcSettings.iterations,
                (p) => setProgress(p)
            );

            setProbResults(results);

            // Simple Risk Mapping based on P90
            const risks = results.depths.map((d, i) => {
                const window = results.fg.p10[i] - results.pp.p90[i];
                let riskLevel = 'Low';
                if (window < 0.5) riskLevel = 'Medium';
                if (window < 0) riskLevel = 'High'; // Kick zone
                return { depth: d, riskLevel };
            });
            setRiskMap(risks);

            toast({ title: "Simulation Complete", description: `Ran ${mcSettings.iterations} iterations successfully.` });

        } catch (error) {
            console.error(error);
            toast({ title: "Simulation Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsCalculating(false);
        }
    };

    const reset = () => {
        setProbResults(null);
        setRiskMap(null);
        setProgress(0);
    };

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden p-4 gap-4">
            {/* Left Control Column */}
            <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
                <div className="p-4 border border-slate-800 bg-slate-900/50 rounded-lg flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-100 mb-1">Probabilistic Engine</h2>
                        <p className="text-xs text-slate-500">Quantify uncertainty via Monte Carlo</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={reset} className="text-slate-500 hover:text-white">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>

                <UncertaintyInputPanel 
                    config={uncertaintyConfig} 
                    setConfig={setUncertaintyConfig} 
                />

                <MonteCarloSettings 
                    settings={mcSettings} 
                    setSettings={setMcSettings} 
                    onRun={runSimulation}
                    isRunning={isCalculating}
                    progress={progress}
                />

                {probResults && (
                    <Card className="p-4 bg-slate-900 border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase">Risk Summary</h3>
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                <div className="text-[10px] text-slate-500">Narrow Window</div>
                                <div className="text-lg font-mono text-yellow-500">
                                    {riskMap ? riskMap.filter(r => r.riskLevel === 'Medium').length * 50 + ' ft' : '-'}
                                </div>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                <div className="text-[10px] text-slate-500">Critical Zones</div>
                                <div className="text-lg font-mono text-red-500">
                                    {riskMap ? riskMap.filter(r => r.riskLevel === 'High').length * 50 + ' ft' : '-'}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Main Visualization Area */}
            <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden relative">
                {probResults ? (
                    <div className="flex-1 relative flex">
                        {/* Chart */}
                        <div className="flex-1 p-2">
                            <ProbabilisticResultsDisplay results={probResults} />
                        </div>
                        
                        {/* Heatmap Strip on Right */}
                        <div className="w-8 border-l border-slate-800 bg-slate-950 py-2 flex flex-col items-center">
                            <div className="text-[10px] text-slate-500 -rotate-90 whitespace-nowrap mb-2">Risk Heatmap</div>
                            <div className="flex-1 w-full px-1">
                                <RiskHeatmap riskMap={riskMap} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
                        <div className="p-4 bg-slate-800/50 rounded-full">
                            <RefreshCw className={`w-8 h-8 ${isCalculating ? 'animate-spin text-emerald-500' : ''}`} />
                        </div>
                        <p>{isCalculating ? 'Running Simulations...' : 'Run simulation to view probabilistic envelopes'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Phase4ProbabilisticEngine;