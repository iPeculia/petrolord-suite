import { useMemo } from 'react';
import { samplePorePressureData, sampleFormations, sampleCasing, sampleHardData } from '@/data/samplePorePressureData';

// This hook consolidates data from various phases into a single prognosis dataset
export const usePrognosisData = (phase1Data, phase4Data, phase5Data) => {
    
    const prognosisData = useMemo(() => {
        // If we have calculation results (phase 4/5), use them
        if (phase4Data && phase4Data.length > 0) {
            return phase4Data.map((d, i) => ({
                depth: d.depth,
                pp_pore: d.pp_mean || d.pp,
                pp_grad: d.pp_mean_grad || (d.pp_mean / 0.052 / d.depth), // Calculate gradient if missing
                fg_frac: d.fg_mean || d.fg,
                fg_grad: d.fg_mean_grad || (d.fg_mean / 0.052 / d.depth),
                obg_over: d.obg_mean || d.obg,
                obg_grad: d.obg_mean_grad || (d.obg_mean / 0.052 / d.depth),
                gr: phase1Data?.GR ? phase1Data.GR[i] : null,
                res: phase1Data?.res ? phase1Data.res[i] : null,
                temp: 40 + (1.6 * d.depth / 100) // Simple temp model if missing
            }));
        }
        
        // Return null if no data is available, to trigger empty state in UI
        // Fallback logic removed to strictly enforce workflow completion for chart
        return null;
    }, [phase1Data, phase4Data]);

    // Ensure hardData is always an array
    const safeHardData = useMemo(() => {
        if (Array.isArray(sampleHardData)) return sampleHardData;
        return [];
    }, []);

    // Ensure casing is always an array
    const safeCasing = useMemo(() => {
        if (Array.isArray(sampleCasing)) return sampleCasing;
        return [];
    }, []);

    return {
        data: prognosisData,
        formations: sampleFormations,
        casing: safeCasing, 
        hardData: safeHardData,
        risks: [] 
    };
};