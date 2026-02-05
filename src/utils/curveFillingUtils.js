/**
 * Generates SVG path commands for filling areas between curves or between a curve and a baseline.
 * Handles all 5 required filling types.
 */

// Map a value to an X pixel coordinate
const mapToX = (val, min, max, width, scale = 'linear') => {
  if (scale === 'log') {
    if (val <= 0) val = 0.001; // Protect against log(0)
    const minLog = Math.log10(Math.max(min, 0.001));
    const maxLog = Math.log10(Math.max(max, 0.001));
    const valLog = Math.log10(val);
    // Avoid division by zero
    if (maxLog === minLog) return width / 2;
    return ((valLog - minLog) / (maxLog - minLog)) * width;
  }
  // Linear
  if (max === min) return width / 2;
  return ((val - min) / (max - min)) * width;
};

// Map a depth index to Y pixel coordinate
const mapToY = (index, totalPoints, height) => {
  return (index / (totalPoints - 1 || 1)) * height;
};

export const generateFillPath = (
  curve1Data, // Array of values
  curve2Data, // Array of values OR a single constant number
  config, // { min, max, width, scale, type, cutoff }
  totalHeight,
  viewRange // { startIndex, endIndex } optimization
) => {
  if (!curve1Data || curve1Data.length === 0) return '';

  const { min, max, width, scale, type, cutoff } = config;
  const { startIndex, endIndex } = viewRange;
  
  // Guard against invalid ranges
  if (startIndex >= endIndex) return '';
  
  const pointsCount = curve1Data.length; 
  let path = '';

  // Helper to check valid number
  const isValid = (n) => typeof n === 'number' && !isNaN(n) && isFinite(n);

  // 1. Track to Curve (Left or Right fill)
  // 4. Curve to Constant (Special case of this)
  // 5. Constant to Curve (Special case of this)
  if (type === 'left' || type === 'right') {
    const defaultBaseline = type === 'left' ? 0 : width;
    let cutoffX = defaultBaseline;
    
    // If cutoff value provided, map it to X
    if (isValid(cutoff)) {
        cutoffX = mapToX(cutoff, min, max, width, scale);
    }

    // Start at top baseline
    const startY = mapToY(startIndex, pointsCount, totalHeight);
    path = `M ${cutoffX.toFixed(1)} ${startY.toFixed(1)}`;

    // Draw curve line
    for (let i = startIndex; i < endIndex; i++) {
      const val = curve1Data[i];
      if (!isValid(val)) continue;
      
      const x = mapToX(val, min, max, width, scale);
      const y = mapToY(i, pointsCount, totalHeight);
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    // Close path back to baseline at bottom
    const endY = mapToY(endIndex - 1, pointsCount, totalHeight);
    path += ` L ${cutoffX.toFixed(1)} ${endY.toFixed(1)} Z`;
  } 
  
  // 2. Curve to Track (Inverse of above, but effectively same geometry usually)
  // 3. Curve to Curve (Between)
  else if (type === 'between' || type === 'crossover') {
    
    // Start point on Curve 1
    const startY = mapToY(startIndex, pointsCount, totalHeight);
    let startX1 = 0;
    const val0 = curve1Data[startIndex];
    if (isValid(val0)) {
       startX1 = mapToX(val0, min, max, width, scale);
    }
    path = `M ${startX1.toFixed(1)} ${startY.toFixed(1)}`;

    // Trace Curve 1 Down
    for (let i = startIndex; i < endIndex; i++) {
      const val = curve1Data[i];
      if (!isValid(val)) continue;
      const x = mapToX(val, min, max, width, scale);
      const y = mapToY(i, pointsCount, totalHeight);
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    // Trace Curve 2 Up (or Constant)
    for (let i = endIndex - 1; i >= startIndex; i--) {
      let val2;
      if (isValid(curve2Data)) {
        // Constant value
        val2 = curve2Data;
      } else if (Array.isArray(curve2Data)) {
        val2 = curve2Data[i];
      } else {
        val2 = min; // Fallback
      }

      if (!isValid(val2)) continue;

      const x = mapToX(val2, min, max, width, scale);
      const y = mapToY(i, pointsCount, totalHeight);
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    path += ' Z';
  }
  
  // 3. Facies (Discrete blocks)
  else if (type === 'facies') {
     // Facies fills usually handled as rectangles by the renderer loop directly
     // But if we need a full block background:
     const startY = mapToY(startIndex, pointsCount, totalHeight);
     const endY = mapToY(endIndex - 1, pointsCount, totalHeight);
     path = `M 0 ${startY.toFixed(1)} L ${width} ${startY.toFixed(1)} L ${width} ${endY.toFixed(1)} L 0 ${endY.toFixed(1)} Z`;
  }

  return path;
};