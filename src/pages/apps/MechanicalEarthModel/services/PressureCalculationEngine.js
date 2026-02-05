/**
 * Calculates pore pressure using various methods.
 * @param {string} method - 'Eaton', 'Hottman-Johnson', or 'ConstantGradient'.
 * @param {object} params - Contains depth, Sv, sonic, eatonExponent, etc.
 * @returns {{pp: number[], gradient: number}}
 */
export const calculatePorePressure = (method, { depth, Sv, sonic, eatonExponent, constantGradient = 0.45 }) => {
    if (!depth || !Sv || depth.length !== Sv.length) {
        throw new Error("Depth and Sv are required for pore pressure calculation.");
    }
    
    let pp = [];
    const normalPressureGradient = 0.433; // for freshwater, psi/ft

    switch (method) {
        case 'Eaton':
            if (!sonic || sonic.length !== depth.length) {
                console.warn("Eaton method selected, but sonic log (DT) is missing. Falling back to constant gradient.");
                return calculatePorePressure('ConstantGradient', { depth, Sv, constantGradient: 0.465 });
            }
            // Simplified Eaton's method
            // Pp = Sv - (Sv - Pn) * (DT_norm / DT_log)^n
            const dtNormal = 100; // Normal compaction trend sonic value (example)
            const n = eatonExponent || 3.0; // Eaton exponent
            pp = depth.map((d, i) => {
                const sv_i = Sv[i];
                const pn_i = normalPressureGradient * d;
                const dt_log = sonic[i];
                if (isNaN(sv_i) || isNaN(dt_log) || dt_log <= 0 || sv_i < pn_i) return pn_i; // Fallback to normal pressure
                
                const ratio = dtNormal / dt_log;
                const ppi = sv_i - (sv_i - pn_i) * Math.pow(ratio, n);
                return ppi > pn_i ? ppi : pn_i;
            });
            break;
            
        case 'Hottman-Johnson':
             // Placeholder for Hottman-Johnson method
            console.warn("Hottman-Johnson method is not yet implemented. Falling back to constant gradient.");
            return calculatePorePressure('ConstantGradient', { depth, Sv, constantGradient: 0.465 });

        case 'ConstantGradient':
        default:
            pp = depth.map(d => d * constantGradient);
            break;
    }

    const finalDepth = depth[depth.length - 1];
    const finalPressure = pp[pp.length - 1];
    const averageGradient = (finalPressure > 0 && finalDepth > 0) ? finalPressure / finalDepth : constantGradient;

    return { pp, gradient: averageGradient };
};

/**
 * Calculates fracture gradient using various methods.
 * @param {string} method - 'Hubbert-Willis', 'Matthews-Kelly', 'Eaton'.
 * @param {object} params - Contains sv, pp, poissonRatio, etc.
 * @returns {{fg: number[], gradient: number}}
 */
export const calculateFractureGradient = (method, { sv, pp, poissonRatio, frictionAngle, matthewsKellyCoeff, depth }) => {
    if (!sv || !pp || sv.length !== pp.length) {
        throw new Error("Sv and Pp are required for fracture gradient calculation.");
    }
    
    let fg = [];

    switch (method) {
        case 'Hubbert-Willis':
            // Fg = (Sv - Pp) * (nu / (1 - nu)) + Pp  (assuming one horizontal stress is minimum)
            const nu = poissonRatio;
            fg = sv.map((sv_i, i) => {
                const pp_i = pp[i];
                if (isNaN(sv_i) || isNaN(pp_i)) return NaN;
                const term1 = (nu / (1 - nu)) * (sv_i - pp_i);
                return term1 + pp_i;
            });
            break;
            
        case 'Matthews-Kelly':
            // Fg = Ki * (Sv - Pp) + Pp
            const Ki = matthewsKellyCoeff || 0.7; // Regional coefficient
            fg = sv.map((sv_i, i) => {
                 const pp_i = pp[i];
                 if (isNaN(sv_i) || isNaN(pp_i)) return NaN;
                 return Ki * (sv_i - pp_i) + pp_i;
            });
            break;

        case 'Eaton':
        default:
            // Fg = (Sv-Pp)/(D) + Pp/D ... in gradient form. Let's use simplified Hubbert-Willis as default
            return calculateFractureGradient('Hubbert-Willis', { sv, pp, poissonRatio, frictionAngle, depth });
    }

    const finalDepth = depth[depth.length - 1];
    const finalFg = fg[fg.length - 1];
    const averageGradient = (finalFg > 0 && finalDepth > 0) ? finalFg / finalDepth : 1.0;

    return { fg, gradient: averageGradient };
};