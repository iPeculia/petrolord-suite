export const calculateTemperatureProfile = (depths, params) => {
    const { 
        seabedTemp = 40, // degF (approx 4C)
        gradient = 1.5, // degF per 100ft
        airGap = 0 
    } = params || {};

    return depths.map(depth => {
        if (depth < 0) return 60; // Surface ambient
        const effectiveDepth = Math.max(0, depth); // Simplify water depth handling for basic view
        return seabedTemp + (gradient * (effectiveDepth / 100));
    });
};