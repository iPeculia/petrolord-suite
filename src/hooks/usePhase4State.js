import { useState, useCallback } from 'react';
import { runMonteCarloSimulation } from '@/utils/monteCarloEngine';
import { calculatePercentiles } from '@/utils/probabilisticCalculator';
import { calculateRiskMap } from '@/utils/riskMetricsEngine';

export const usePhase4State = (initialData, baseParams) => {
    const [uncertaintyConfig, setUncertaintyConfig] = useState({
        logNoise: 0.05,
        modelVariance: 0.1,
        trendResiduals: 0.05
    });

    const [mcSettings, setMcSettings] = useState({
        iterations: 1000,
        distribution: 'normal',
        seed: 12345
    });

    const [probResults, setProbResults] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [riskMap, setRiskMap] = useState(null);

    const runSimulation = useCallback(async () => {
        if (!initialData || !baseParams) return;
        setIsCalculating(true);
        setProgress(0);

        // Use timeout to allow UI to update before heavy calc
        setTimeout(() => {
            // Ensure we have valid inputs for the simulation
            const inputWithObg = {
                ...initialData,
                // Fallback OBG generation if missing
                obg: initialData.obg || (initialData.depths ? initialData.depths.map(() => 2.3) : [])
            };

            const rawResults = runMonteCarloSimulation(
                initialData.depths || [],
                inputWithObg,
                baseParams,
                uncertaintyConfig,
                mcSettings.iterations,
                (p) => setProgress(p * 100)
            );

            // Calculate P10, P50, P90 from the raw realizations
            const percentiles = calculatePercentiles(rawResults);
            setProbResults(percentiles);
            
            // Calculate risk indicators based on the probabilistic results
            const risks = calculateRiskMap(percentiles);
            setRiskMap(risks);

            setIsCalculating(false);
            setProgress(100);
        }, 100);
    }, [initialData, baseParams, uncertaintyConfig, mcSettings]);

    return {
        uncertaintyConfig,
        setUncertaintyConfig,
        mcSettings,
        setMcSettings,
        probResults,
        riskMap,
        isCalculating,
        progress,
        runSimulation
    };
};