/**
 * Comprehensive synthetic well log data generator for demo wells.
 * Simulates realistic geological responses for correlation testing.
 */

// Helper to generate random walk data with trends
const generateCurve = (depths, baseValue, noise, trend, anomalyDepth, anomalyMagnitude) => {
  let value = baseValue;
  return depths.map(d => {
    // Add random noise
    value += (Math.random() - 0.5) * noise;
    
    // Add underlying trend (e.g., compaction)
    if (trend) value += trend;
    
    // Add geological anomalies (e.g., sand bodies)
    let anomaly = 0;
    if (d > anomalyDepth && d < anomalyDepth + 50) {
      anomaly = anomalyMagnitude * Math.sin((d - anomalyDepth) * 0.1);
    }
    
    // Keep within realistic physical bounds (soft limits)
    if (baseValue > 0 && value < 0) value = 0;
    
    return value + anomaly;
  });
};

// Generate synthetic logs for a specific well
export const generateWellLogs = (wellId, startDepth, endDepth, step) => {
  const count = Math.floor((endDepth - startDepth) / step);
  const depths = new Float32Array(count);
  for (let i = 0; i < count; i++) depths[i] = startDepth + (i * step);

  // Seed variations based on wellId hash/char code for consistency
  const seed = wellId.charCodeAt(wellId.length - 1);
  const anomalyStart = 1500 + (seed * 50); 

  return {
    depths,
    curves: {
      GR: {
        mnemonic: 'GR',
        unit: 'gAPI',
        data: generateCurve(depths, 60 + (seed % 20), 2, 0, anomalyStart, -40), // Sand is low GR
        min: 0,
        max: 150,
        description: 'Gamma Ray'
      },
      CALI: {
        mnemonic: 'CALI',
        unit: 'in',
        data: generateCurve(depths, 8.5, 0.1, 0, anomalyStart, 1.5), // Washout in sands
        min: 6,
        max: 16,
        description: 'Caliper'
      },
      RES_DEEP: {
        mnemonic: 'RES_DEEP',
        unit: 'ohm.m',
        data: generateCurve(depths, 2 + (seed % 5), 0.5, 0.001, anomalyStart, 20), // Resistive hydrocarbon
        min: 0.2,
        max: 2000,
        scale: 'log',
        description: 'Deep Resistivity'
      },
      RES_SHAL: {
        mnemonic: 'RES_SHAL',
        unit: 'ohm.m',
        data: generateCurve(depths, 2 + (seed % 5), 0.6, 0.001, anomalyStart, 10),
        min: 0.2,
        max: 2000,
        scale: 'log',
        description: 'Shallow Resistivity'
      },
      NPHI: {
        mnemonic: 'NPHI',
        unit: 'v/v',
        data: generateCurve(depths, 0.25, 0.01, -0.00001, anomalyStart, -0.15), // Gas crossover effect
        min: -0.15,
        max: 0.45,
        description: 'Neutron Porosity'
      },
      RHOB: {
        mnemonic: 'RHOB',
        unit: 'g/cc',
        data: generateCurve(depths, 2.4, 0.02, 0.00005, anomalyStart, -0.2),
        min: 1.95,
        max: 2.95,
        description: 'Bulk Density'
      },
      FACIES: {
        mnemonic: 'FACIES',
        unit: 'code',
        data: depths.map(d => {
          if (d > anomalyStart && d < anomalyStart + 50) return 1; // Sand
          if (d > anomalyStart + 100 && d < anomalyStart + 120) return 2; // Limestone
          return 0; // Shale
        }),
        min: 0,
        max: 5,
        description: 'Discrete Facies'
      }
    }
  };
};