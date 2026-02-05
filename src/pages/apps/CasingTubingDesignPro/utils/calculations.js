// Engineering calculations utility for Casing & Tubing Design

/**
 * Calculates hydrostatic pressure at a given depth
 * @param {number} tvd - True Vertical Depth in ft
 * @param {number} density - Fluid density in ppg
 * @param {number} surfacePressure - Surface pressure in psi
 * @returns {number} Pressure in psi
 */
export const calculateHydrostaticPressure = (tvd, density, surfacePressure = 0) => {
    const hydrostatic = 0.052 * density * tvd;
    return hydrostatic + surfacePressure;
};

/**
 * Converts gradient (ppg) to pressure (psi) at depth
 * @param {number} gradient - Gradient in ppg
 * @param {number} tvd - True Vertical Depth in ft
 * @returns {number} Pressure in psi
 */
export const gradientToPressure = (gradient, tvd) => {
    return 0.052 * gradient * tvd;
};

/**
 * Calculates safety factors
 * @param {number} rating - Component rating (burst/collapse/tension)
 * @param {number} load - Applied load
 * @returns {number} Safety Factor (rounded to 2 decimals)
 */
export const calculateSafetyFactor = (rating, load) => {
    if (load <= 0) return 99.99; // Infinite safety if no load or compressive load where tension expected
    return Math.round((rating / load) * 100) / 100;
};

/**
 * Interpolates value linearly between two points
 */
export const interpolateLinear = (x, x0, y0, x1, y1) => {
    if (Math.abs(x1 - x0) < 0.00001) return y0;
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
};