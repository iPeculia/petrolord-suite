/**
 * Basic unit conversion utility
 */
const conversions = {
  // Length
  m: { ft: 3.28084, in: 39.3701 },
  ft: { m: 0.3048, in: 12 },
  in: { m: 0.0254, ft: 1 / 12, mm: 25.4 },
  mm: { in: 1 / 25.4 },
  
  // Weight/Mass
  kg: { lb: 2.20462 },
  lb: { kg: 0.453592 },

  // Force
  kN: { lbf: 224.809, klbf: 0.224809 },
  lbf: { kN: 0.00444822 },
  klbf: { kN: 4.44822 },

  // Pressure
  psi: { kPa: 6.89476 },
  kPa: { psi: 0.145038 },
  
  // Density
  ppg: { sg: 0.119826 },
  sg: { ppg: 8.3454 },
};

export const convertUnits = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) {
    return value;
  }
  if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
    return value * conversions[fromUnit][toUnit];
  }
  if (conversions[toUnit] && conversions[toUnit][fromUnit]) {
    return value / conversions[toUnit][fromUnit];
  }
  console.warn(`No conversion path found from ${fromUnit} to ${toUnit}`);
  return value; // Return original value if no conversion is found
};