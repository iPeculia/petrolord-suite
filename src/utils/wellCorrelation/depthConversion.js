/**
 * Depth Conversion Utilities
 */

export const FEET_TO_METER = 0.3048;
export const METER_TO_FEET = 3.28084;

export const convertDepthArray = (depths, fromUnit, toUnit) => {
  if (!depths) return [];
  if (fromUnit === toUnit) return [...depths]; // Return copy

  const factor = (fromUnit === 'FT' && toUnit === 'M') ? FEET_TO_METER : 
                 (fromUnit === 'M' && toUnit === 'FT') ? METER_TO_FEET : 1;

  return depths.map(d => d * factor);
};

export const mdToTvdSimple = (md, deviationData) => {
  // Stub for simple vertical correction if deviation survey exists
  // If no deviation, TVD = MD
  if (!deviationData) return md;
  
  // TODO: Implement minimum curvature method
  return md;
};