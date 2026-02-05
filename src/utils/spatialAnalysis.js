import * as turf from '@turf/simplify'; // Just using standard turf if needed, or simple math

export const calculateDistance = (loc1, loc2) => {
    const dx = loc1.x - loc2.x;
    const dy = loc1.y - loc2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

export const calculateSpatialTrend = (wells, depthSlice) => {
    // Simple linear regression for pressure vs X/Y at a specific depth
    // Returns gradient plane coefficients: P = aX + bY + c
    // Simplified for this example: Just return average gradient in E-W direction
    
    // Filter wells that reach this depth
    const validWells = wells.filter(w => w.depths[w.depths.length-1] >= depthSlice);
    if (validWells.length < 3) return null;

    const points = validWells.map(w => {
        // Find index of depthSlice
        const idx = w.depths.findIndex(d => d >= depthSlice);
        return {
            x: w.location.x,
            y: w.location.y,
            p: w.results.pp[idx] || 0
        };
    });

    // Mock result
    return {
        xGradient: 0.05, // psi/ft horizontal
        yGradient: 0.02,
        averagePressure: points.reduce((a,b) => a + b.p, 0) / points.length
    };
};