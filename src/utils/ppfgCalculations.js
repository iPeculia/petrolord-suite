import { mean, standardDeviation } from 'simple-statistics';

// Constants
const G_H = 0.433; // psi/ft (Hydrostatic gradient approx)
const G_L = 1.0;   // psi/ft (Lithostatic gradient approx)

// --- 1. Overburden Calculation ---
export const calculateOverburden = (depths, rhob, waterDepth = 0, airGap = 0) => {
    const RHO_TO_PSI_FT = 0.4335;
    
    const sv = [];
    let cumulativePressure = 0;
    let prevDepth = 0;

    cumulativePressure += waterDepth * 0.44; // psi
    prevDepth = waterDepth + airGap;

    for (let i = 0; i < depths.length; i++) {
        const depth = depths[i];
        const rho = rhob[i] || 2.2; 
        
        const dz = depth - prevDepth;
        if (dz > 0) {
            const layerPressure = rho * RHO_TO_PSI_FT * dz;
            cumulativePressure += layerPressure;
        }
        
        const sv_ppg = depth > 0 ? (cumulativePressure / (0.052 * depth)) : 0;
        
        sv.push({
            depth,
            pressure_psi: cumulativePressure,
            gradient_ppg: sv_ppg
        });
        
        prevDepth = depth;
    }
    return sv;
};

// --- 2. Normal Compaction Trend (NCT) ---
export const calculateNCT = (depths, method = 'linear_log', params) => {
    return depths.map(z => {
        if (method === 'linear_log') {
            return params.intercept * Math.exp(-params.slope * z);
        } else if (method === 'power') {
            return params.a * Math.pow(z, params.b);
        }
        return 0;
    });
};

// --- 3. Pore Pressure Methods ---
export const calculateEatonSonic = (dt_obs, dt_nct, sv_ppg, hyd_ppg = 8.5, n = 3.0) => {
    return dt_obs.map((dt, i) => {
        if (!dt || !dt_nct[i] || !sv_ppg[i]) return null;
        const ratio = dt_nct[i] / dt; 
        const pp = sv_ppg[i] - (sv_ppg[i] - hyd_ppg) * Math.pow(ratio, n);
        return Math.max(hyd_ppg, Math.min(sv_ppg[i], pp)); 
    });
};

export const calculateEatonResistivity = (res_obs, res_nct, sv_ppg, hyd_ppg = 8.5, n = 1.2) => {
    return res_obs.map((res, i) => {
        if (!res || !res_nct[i] || !sv_ppg[i]) return null;
        const ratio = res / res_nct[i]; 
        const pp = sv_ppg[i] - (sv_ppg[i] - hyd_ppg) * Math.pow(ratio, n);
        return Math.max(hyd_ppg, Math.min(sv_ppg[i], pp));
    });
};

// --- 4. Fracture Gradient ---
export const calculateFG_MatthewsKelly = (pp_ppg, sv_ppg, depths, k0_chart = null) => {
    return pp_ppg.map((pp, i) => {
        if (!pp || !sv_ppg[i]) return null;
        const depth = depths[i];
        // Simple Ki approximation if no chart provided
        const ki = k0_chart ? k0_chart(depth) : (0.4 + (depth / 20000) * 0.6);
        
        return pp + ki * (sv_ppg[i] - pp);
    });
};

// --- 5. Temperature Calculations ---
export const calculateTemperatureProfile = (depths, surfaceTemp = 60, gradient = 1.5) => {
    // gradient in degF/100ft
    return depths.map(depth => surfaceTemp + (gradient * depth / 100));
};

// --- 6. Uncertainty Bands ---
export const calculateUncertaintyBands = (baseData, variance = 0.05) => {
    // Simple +/- variance for demo purposes
    return baseData.map(val => {
        if(val === null) return { p10: null, p50: null, p90: null };
        return {
            p10: val * (1 - variance),
            p50: val,
            p90: val * (1 + variance)
        };
    });
};