/**
 * LAS Validator
 * Checks structural integrity, content quality, and logic of parsed LAS data.
 */

export const validateLAS = (parsedData) => {
  const errors = [];
  const warnings = [];
  const statistics = {
    totalCurves: 0,
    totalDepthPoints: 0,
    missingValueCount: 0,
    outlierCount: 0
  };

  if (!parsedData || !parsedData.metadata) {
    return { 
      isValid: false, 
      errors: ["Invalid or empty LAS data structure"], 
      warnings: [],
      statistics
    };
  }

  statistics.totalCurves = parsedData.curves.length;
  statistics.totalDepthPoints = parsedData.depths.length;

  // 1. Metadata Checks
  if (!parsedData.metadata.name) warnings.push("Well name is missing in header (WELL mnemonic).");
  if (!parsedData.metadata.uwi && !parsedData.metadata.api) warnings.push("Unique Well Identifier (UWI/API) is missing.");
  if (!parsedData.metadata.startDepth) warnings.push("Start depth (STRT) is missing.");
  if (!parsedData.metadata.endDepth) warnings.push("Stop depth (STOP) is missing.");

  // 2. Depth Checks
  if (!parsedData.depths || parsedData.depths.length === 0) {
    errors.push("No depth channel found or depth array is empty.");
  } else {
    // Check monotonicity
    let direction = 0; // 1 for increasing, -1 for decreasing
    if (parsedData.depths.length > 1) {
      const start = parsedData.depths[0];
      const end = parsedData.depths[parsedData.depths.length - 1];
      direction = end > start ? 1 : -1;
      
      // Verify step consistency (first 10 points)
      const step = parsedData.depths[1] - parsedData.depths[0];
      if (Math.abs(step) < 0.0001) {
        errors.push("Depth step is effectively zero.");
      }
      
      // Check full array for monotony breaks
      let monotonicityErrors = 0;
      for (let i = 1; i < parsedData.depths.length; i++) {
        const diff = parsedData.depths[i] - parsedData.depths[i-1];
        if (direction === 1 && diff <= 0) monotonicityErrors++;
        if (direction === -1 && diff >= 0) monotonicityErrors++;
      }
      if (monotonicityErrors > 0) {
        errors.push(`Depth array is not strictly monotonic. Found ${monotonicityErrors} inconsistencies.`);
      }
    }
  }

  // 3. Curve Checks
  if (!parsedData.curves || parsedData.curves.length === 0) {
    errors.push("No curve data found in DATA section.");
  } else {
    parsedData.curves.forEach(curve => {
      // Length check
      if (curve.data.length !== parsedData.depths.length) {
        errors.push(`Curve length mismatch: ${curve.mnemonic} has ${curve.data.length} points, expected ${parsedData.depths.length}.`);
      }
      
      // Null value check
      if (curve.count === 0) {
        warnings.push(`Curve ${curve.mnemonic} contains only null values.`);
      } else if (curve.count < parsedData.depths.length * 0.1) {
        warnings.push(`Curve ${curve.mnemonic} has very sparse data (<10% populated).`);
      }

      statistics.missingValueCount += (curve.data.length - curve.count);

      // Outlier check (simple heuristic for logs like GR, Neutron, Density)
      // Example: Negative GR or Density < 1.0 or > 3.5 often indicates issue unless specific lithology
      if (curve.mnemonic.toUpperCase().includes('GR')) {
        if (curve.minValue < 0) warnings.push(`Curve ${curve.mnemonic} (Gamma Ray) has negative values.`);
      }
      if (curve.mnemonic.toUpperCase().includes('NPHI') || curve.mnemonic.toUpperCase().includes('NEUT')) {
        // Neutron porosity > 100% or < -10% is suspicious
        if (curve.maxValue > 1.0 && curve.maxValue <= 100) {
           // Assuming V/V vs percentage, handled elsewhere usually, but if 45% vs 0.45
        } else if (curve.maxValue > 100) {
           warnings.push(`Curve ${curve.mnemonic} has suspiciously high values for porosity (>100).`);
        }
      }
    });
  }

  // 4. Unit Consistency
  if (parsedData.metadata.depthUnit && !['M', 'FT'].includes(parsedData.metadata.depthUnit)) {
    warnings.push(`Unknown depth unit: ${parsedData.metadata.depthUnit}. Assuming Meters for calculations might be incorrect.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    statistics
  };
};