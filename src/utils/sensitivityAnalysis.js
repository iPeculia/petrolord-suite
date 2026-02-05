import { calculateRealTime } from './realTimeCalculationEngine';
import { mean, standardDeviation } from 'simple-statistics';

export const runSensitivityAnalysis = (baseInputs, baseParams) => {
    const metrics = ['eatonExponent', 'poissonRatio', 'nctIntercept', 'nctSlope'];
    const results = [];
    
    // Baseline calculation
    const baseResult = calculateRealTime(baseInputs, baseParams);
    // Calculate mean PP of base case for comparison (using last 20% of well for deep impact)
    const basePP = mean(baseResult.pp.slice(-Math.floor(baseResult.pp.length * 0.2)).filter(v => v > 0));

    // Tornado Chart Data
    metrics.forEach(metric => {
        const baseVal = baseParams[metric];
        
        // +/- 10% variation
        const lowParams = { ...baseParams, [metric]: baseVal * 0.9 };
        const highParams = { ...baseParams, [metric]: baseVal * 1.1 };
        
        const lowResult = calculateRealTime(baseInputs, lowParams);
        const highResult = calculateRealTime(baseInputs, highParams);
        
        const lowPP = mean(lowResult.pp.slice(-Math.floor(lowResult.pp.length * 0.2)).filter(v => v > 0));
        const highPP = mean(highResult.pp.slice(-Math.floor(highResult.pp.length * 0.2)).filter(v => v > 0));
        
        results.push({
            parameter: metric,
            base: basePP,
            low: lowPP,
            high: highPP,
            swing: Math.abs(highPP - lowPP),
            elasticity: ((highPP - lowPP) / basePP) / 0.2 // % change output / 20% change input
        });
    });

    return results.sort((a, b) => b.swing - a.swing);
};

export const calculateUncertaintyEnvelope = (baseInputs, baseParams) => {
    // Generate P10, P50 (Base), P90 approximation
    // Usually requires Monte Carlo, here we use simplified range approximation
    
    const p10Params = { ...baseParams, eatonExponent: baseParams.eatonExponent * 0.9 };
    const p90Params = { ...baseParams, eatonExponent: baseParams.eatonExponent * 1.1 };

    const p10Res = calculateRealTime(baseInputs, p10Params);
    const p90Res = calculateRealTime(baseInputs, p90Params);

    return {
        minPP: p10Res.pp,
        maxPP: p90Res.pp,
        minFG: p10Res.fg,
        maxFG: p90Res.fg
    };
};