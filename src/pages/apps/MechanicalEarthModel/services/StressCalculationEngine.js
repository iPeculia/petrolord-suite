/**
 * Calculates vertical stress (Sv) from depth and density logs.
 * Assumes density is in g/cm3 and depth in feet. Output is in psi.
 * Formula: Sv(psi) at a depth is the integral of (density * gravity) from surface to that depth.
 * A common approximation is a cumulative sum. psi/ft = 0.433 * g/cm3
 * @param {number[]} depth - Array of depth values (ft).
 * @param {number[]} density - Array of density values (g/cm3).
 * @returns {{sv: number[], gradient: number}} - Object with Sv array (psi) and average gradient (psi/ft).
 */
export const calculateVerticalStress = (depth, density) => {
    if (!depth || !density || depth.length !== density.length) {
        throw new Error("Invalid input for vertical stress calculation. Depth and density arrays must be of the same length.");
    }
    
    const sv = [0];
    let cumulativeStress = 0;

    for (let i = 1; i < depth.length; i++) {
        const d_depth = depth[i] - depth[i - 1];
        const avg_density = (density[i] + density[i - 1]) / 2;
        if (isNaN(avg_density) || avg_density <= 0 || d_depth <= 0) {
            // If bad data, carry over the previous stress value
            sv.push(sv[i-1]);
        } else {
            const stress_increase = avg_density * 0.433 * d_depth;
            cumulativeStress = sv[i-1] + stress_increase;
            sv.push(cumulativeStress);
        }
    }
    
    const finalDepth = depth[depth.length - 1];
    const finalStress = sv[sv.length - 1];
    const averageGradient = (finalStress > 0 && finalDepth > 0) ? finalStress / finalDepth : 0.433; // Default to water gradient

    return { sv, gradient: averageGradient };
};


/**
 * Calculates horizontal stresses (Shmin, SHmax) using the Andersonian stress model.
 * @param {string} stressRegime - 'NF' (Normal Faulting), 'SS' (Strike-Slip), 'TF' (Thrust/Reverse Faulting).
 * @param {{sv: number[], pp: number[], poissonRatio: number, frictionAngle: number}} params
 * @returns {{shmin: number[], shmax: number[], ratios: object, stressRegimeProfile: string[]}} - Calculated horizontal stresses and ratios.
 */
export const calculateHorizontalStresses = (stressRegime, { sv, pp, poissonRatio, frictionAngle }) => {
    if (!sv || !pp || sv.length !== pp.length) {
        throw new Error("Invalid inputs for horizontal stress calculation.");
    }
    
    const shmin = [];
    const shmax = [];
    const stressRegimeProfile = [];

    const nu = poissonRatio; // Poisson's Ratio
    const phi = (frictionAngle * Math.PI) / 180; // Friction angle in radians
    const k0 = nu / (1 - nu); // Coefficient of earth pressure at rest

    for (let i = 0; i < sv.length; i++) {
        const svi = sv[i];
        const ppi = pp[i];
        let shmini, shmaxi, regime;

        if (isNaN(svi) || isNaN(ppi) || svi <= ppi) {
            shmini = NaN;
            shmaxi = NaN;
            regime = 'Unknown';
        } else {
            const effectiveVerticalStress = svi - ppi;
            
            // These are simplified Andersonian formulas for principal stresses.
            const passiveLimit = ((1 + Math.sin(phi)) / (1 - Math.sin(phi))) * effectiveVerticalStress + ppi;
            const activeLimit = ((1 - Math.sin(phi)) / (1 + Math.sin(phi))) * effectiveVerticalStress + ppi;
            
            switch (stressRegime) {
                case 'SS': // Strike-Slip: Sv is the intermediate principal stress
                    shmini = activeLimit;
                    shmaxi = passiveLimit;
                    regime = 'Strike-Slip';
                    break;
                case 'TF': // Thrust Faulting: Sv is the minimum principal stress
                    shmini = svi; // Approximation
                    shmaxi = passiveLimit;
                    regime = 'Thrust Faulting';
                    break;
                case 'NF': // Normal Faulting: Sv is the maximum principal stress
                default:
                    shmini = activeLimit;
                    shmaxi = k0 * effectiveVerticalStress + ppi; // SHmax is often approximated this way in NF
                    if (shmaxi < shmini) shmaxi = shmini * 1.1; // Ensure SHmax > Shmin
                    regime = 'Normal Faulting';
                    break;
            }
        }
        
        shmin.push(shmini);
        shmax.push(shmaxi);
        stressRegimeProfile.push(regime);
    }
    
    // Calculate Ratios for the last valid point
    const lastIdx = sv.length - 1;
    const ratios = {
        shmax_shmin: shmax[lastIdx] / shmin[lastIdx],
        shmax_sv: shmax[lastIdx] / sv[lastIdx],
        shmin_sv: shmin[lastIdx] / sv[lastIdx],
    };

    return { shmin, shmax, ratios, stressRegimeProfile };
};