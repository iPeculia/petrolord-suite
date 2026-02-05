import { runPPFGWorkflow } from './ppfgEngine';

export const generateProbabilisticCases = (baseInputs) => {
    const { params } = baseInputs;

    // Define P10 (Low Pressure / Safe), P50 (Base), P90 (High Pressure / Risk) parameter sets
    // Note: High Pressure case usually means "Higher Pore Pressure" (more dangerous kick risk)
    // Low Pressure case means "Lower Pore Pressure"
    
    // P90 (High Case) -> Higher Eaton Exponent? No, Eaton N: PP = S - (S-Ph)*(Run/Robs)^N.
    // If N increases, the subtraction term changes. 
    // Actually, simplistically: P90 PP usually implies fitting NCT to be faster (lower DT), making Obs DT look more anomalous.
    // Or just using parameter variance.

    const p50_results = runPPFGWorkflow({
        ...baseInputs,
        params: { ...params }
    });

    const p10_results = runPPFGWorkflow({
        ...baseInputs,
        params: {
            ...params,
            eatonExponent: (params.eatonExponent || 3.0) * 0.8, // Weaker transformation
            nct: { ...params.nct, a: params.nct.a * 1.05 } // Shift NCT
        }
    });

    const p90_results = runPPFGWorkflow({
        ...baseInputs,
        params: {
            ...params,
            eatonExponent: (params.eatonExponent || 3.0) * 1.2, // Stronger transformation
            nct: { ...params.nct, a: params.nct.a * 0.95 }
        }
    });

    // Combine into unified depth-indexed structure
    return baseInputs.depths.map((depth, i) => ({
        depth,
        obg: p50_results.obg[i],
        
        pp_low: p10_results.pp[i],
        pp_mid: p50_results.pp[i],
        pp_high: p90_results.pp[i],
        
        fg_low: p10_results.fg[i], // Note: Low FG is the RISK case for losses
        fg_mid: p50_results.fg[i],
        fg_high: p90_results.fg[i],
        
        shmin: p50_results.shmin[i]
    }));
};