import { mean } from 'simple-statistics';

// Constants
const PSI_TO_PPG = 1 / 0.052;
const RHO_TO_PSI_FT = 0.4335;
const G_WATER = 0.44; // psi/ft (approx for brine)

/**
 * 1. Overburden Gradient (OBG) Calculation
 * Integrates bulk density (RHOB) from surface/seabed downwards.
 */
export const calculateOBG = (depths, rhob, waterDepth = 0, airGap = 0, extrapolation = 'power') => {
    const obg_psi = [];
    const obg_ppg = [];
    let cumulativePressure = 0;
    let prevDepth = waterDepth + airGap;

    // Initial pressure at seabed (hydrostatic water column)
    cumulativePressure = waterDepth * G_WATER; 

    for (let i = 0; i < depths.length; i++) {
        const depth = depths[i];
        const rho = rhob[i] || 2.0; // Default fallback density
        
        if (depth <= (waterDepth + airGap)) {
            obg_psi.push(depth * G_WATER); // In water column
            obg_ppg.push(8.5); // Approx seawater ppg
        } else {
            const dz = depth - prevDepth;
            if (dz > 0) {
                cumulativePressure += rho * RHO_TO_PSI_FT * dz;
            }
            obg_psi.push(cumulativePressure);
            // EMW = Pressure / (0.052 * TVD)
            obg_ppg.push(cumulativePressure / (0.052 * depth));
        }
        prevDepth = depth;
    }
    return { obg_psi, obg_ppg };
};

/**
 * 2. Normal Compaction Trend (NCT) Calculation
 * Fits a trend line (Linear-Log usually) to Shale points.
 * log(DT) = log(DT_surface) - b * Depth
 */
export const calculateNCT = (depths, logData, shaleMask, method = 'linear_log', params = { a: 180, b: 0.00005 }) => {
    return depths.map(z => {
        if (method === 'linear_log') {
            // DT_nct = A * exp(-B * z)
            return params.a * Math.exp(-params.b * z);
        }
        return 0;
    });
};

/**
 * 3. Pore Pressure Calculation (Eaton's Method)
 * PP = OBG - (OBG - P_hyd) * (DT_nct / DT_obs)^N
 */
export const calculatePorePressureEaton = (obg_ppg, dt_obs, dt_nct, hydrostatic_ppg = 8.5, n_exponent = 3.0) => {
    return obg_ppg.map((obg, i) => {
        const dt = dt_obs[i];
        const nct = dt_nct[i];
        
        if (!dt || !nct || !obg) return hydrostatic_ppg;

        // Avoid singularity or weird boosting if DT is bad
        if (dt <= 0) return obg; 

        const ratio = nct / dt;
        // Eaton formula for Sonic (Ratio is usually > 1 for overpressure if using Velocity, < 1 if using DT... wait. 
        // Standard Eaton Sonic: PP = S - (S - Ph) * (dTn/dT)^3. If dTn < dT (slower than normal), it's overpressure? 
        // No, undercompaction means HIGHER DT (slower). So dTn (normal) < dT (observed). Ratio < 1.
        // If ratio < 1, (ratio)^3 is small. S - (large diff * small) -> PP approaches S. Correct.
        
        const pp = obg - (obg - hydrostatic_ppg) * Math.pow(ratio, n_exponent);
        return Math.max(hydrostatic_ppg, Math.min(obg, pp));
    });
};

/**
 * 4. Fracture Gradient (Matthews-Kelly / Eaton)
 * FG = PP + K * (OBG - PP)
 * K often related to Poisson's Ratio: K = v / (1-v)
 */
export const calculateFractureGradient = (pp_ppg, obg_ppg, depths, poissonRatio = 0.4) => {
    return pp_ppg.map((pp, i) => {
        const obg = obg_ppg[i];
        if (pp === null || obg === null) return null;
        
        // Variable Poisson ratio based on depth often used, simple constant here for engine core unless map provided
        // K0 = v / (1-v)
        const k0 = poissonRatio / (1 - poissonRatio); 
        
        const fg = pp + k0 * (obg - pp);
        return fg;
    });
};

/**
 * 5. Main Workflow Wrapper
 */
export const runPPFGWorkflow = (inputs) => {
    const { 
        depths, 
        gr, 
        res, 
        dt, 
        rhob, 
        waterDepth, 
        airGap,
        params 
    } = inputs;

    // 1. OBG
    const { obg_ppg } = calculateOBG(depths, rhob, waterDepth, airGap);

    // 2. NCT (Sonic)
    const dt_nct = calculateNCT(depths, dt, null, 'linear_log', params.nct || { a: 180, b: 0.00005 });

    // 3. Pore Pressure (Eaton Sonic)
    const pp_ppg = calculatePorePressureEaton(obg_ppg, dt, dt_nct, 8.5, params.eatonExponent || 3.0);

    // 4. Fracture Gradient
    const fg_ppg = calculateFractureGradient(pp_ppg, obg_ppg, depths, params.poisson || 0.4);

    // 5. Shmin (Minimum Horizontal Stress) - often approximated as FG in simple models, or slightly less
    const shmin_ppg = fg_ppg.map(f => f * 0.95); 

    return {
        depths,
        obg: obg_ppg,
        nct: dt_nct,
        pp: pp_ppg,
        fg: fg_ppg,
        shmin: shmin_ppg
    };
};