// Calculates centroid effect for tilted reservoirs (Gas/Oil columns)
export const calculateCentroidEffect = (inputs) => {
    const { depths, pp_psi, params } = inputs;
    const { centroidDepth, fluidGradient } = params; 
    // fluidGradient: Gas ~0.1, Oil ~0.35 psi/ft

    if (!centroidDepth || !fluidGradient) return pp_psi;

    // At Centroid Depth, Pressure is P_centroid (from shale trend)
    // P(z) = P_centroid + FluidGrad * (z - CentroidDepth)
    
    // First find PP at Centroid from regional trend (interpolated)
    // For simplicity, find closest index
    const idx = depths.findIndex(d => d >= centroidDepth);
    if (idx === -1) return pp_psi;
    
    const pp_centroid = pp_psi[idx] || 0;

    const pp_adjusted = depths.map((d, i) => {
        // Only adjust inside the reservoir container? 
        // Usually this adjustment is applied to the permeable zone (reservoir)
        // But for the output curve we might want to show the "potential" pressure if sand existed
        
        // For this simplified engine, we return a 'Sand PP' curve distinct from 'Shale PP'
        const deltaZ = d - centroidDepth;
        return pp_centroid + fluidGradient * deltaZ;
    });

    return pp_adjusted;
};