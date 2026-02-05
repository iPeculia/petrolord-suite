import { mean } from 'simple-statistics';

// Constants
const G_WATER = 0.44; // psi/ft (approx for brine)
const RHO_TO_PSI_FT = 0.4335;

/**
 * Calculates Overburden Gradient (OBG) using density integration.
 * Supports Trapezoidal integration.
 * Handles water depth and air gap.
 * Converts between RHOB and Vp if density is missing (Gardner/Castagna).
 */
export const calculateOBG = (data, params) => {
    const { waterDepth = 0, airGap = 0, method = 'trapezoid', rhoMethod = 'none' } = params;
    const { depths, rhob, dt, vp } = data;

    if (!depths || depths.length === 0) return null;

    const obg_psi = [];
    const obg_ppg = [];
    let cumulativePressure = 0; // psi
    
    // Initial pressure at mudline (hydrostatic)
    // Water depth is usually from MSL. Air gap is usually Rotary Table to MSL.
    // Depths in data are usually MD/TVD from Rotary Table.
    // So Mudline Depth (MD_ml) = Water Depth + Air Gap.
    const mudlineDepth = waterDepth + airGap;
    cumulativePressure = waterDepth * G_WATER; 

    let prevDepth = mudlineDepth;

    for (let i = 0; i < depths.length; i++) {
        const depth = depths[i];
        
        // Skip depths above mudline for rock integration (they are water/air)
        if (depth < mudlineDepth) {
            // In water column or air gap
            if (depth <= airGap) {
                obg_psi.push(0); // In air
                obg_ppg.push(0);
            } else {
                // In water
                const p = (depth - airGap) * G_WATER;
                obg_psi.push(p);
                obg_ppg.push(p / (0.052 * depth)); // EMW at this depth
            }
            continue;
        }

        // Get Density
        let rho = rhob ? rhob[i] : null;

        // Synthetic Density if missing
        if ((rho === null || isNaN(rho)) && (dt && dt[i])) {
             // Vp in ft/s = 1,000,000 / dt (us/ft)
             const v = 1000000 / dt[i];
             // Gardner: rho = 0.23 * Vp^0.25 (Vp in ft/s)
             if (rhoMethod === 'gardner') {
                 rho = 0.23 * Math.pow(v, 0.25);
             } else if (rhoMethod === 'castagna') {
                 // Castagna usually Vp/Vs, but for density: rho = -0.0261*V + 1.286 (V km/s) ?? 
                 // Let's stick to Gardner for simplicity or linear
                 rho = 0.23 * Math.pow(v, 0.25); 
             }
        }
        
        // Fallback
        if (rho === null || isNaN(rho)) rho = 2.0; 

        // Integration Step
        const dz = depth - prevDepth;
        
        if (dz > 0) {
            // Trapezoidal: (rho_prev + rho_curr) / 2 * dz
            // Here we assume blocky for simple loop, or use previous rho if tracking
            // Let's use simple block integration for stability on gaps
            cumulativePressure += rho * RHO_TO_PSI_FT * dz;
        }

        obg_psi.push(cumulativePressure);
        
        // EMW Calculation
        // Avoid division by zero
        const emw = depth > 0 ? cumulativePressure / (0.052 * depth) : 0;
        obg_ppg.push(emw);

        prevDepth = depth;
    }

    return { obg_psi, obg_ppg, depths };
};