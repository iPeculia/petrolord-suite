/**
 * Calculates SVG path commands for various curve fill types.
 */

/**
 * Converts a value to X coordinate based on scale
 */
const scaleValue = (value, min, max, width, isLog) => {
  if (value === null || value === undefined) return null;
  
  // Clamp values for display
  // For log scale, ensure strictly positive
  let val = value;
  let minVal = min;
  let maxVal = max;

  if (isLog) {
    if (val <= 0) val = 0.001;
    if (minVal <= 0) minVal = 0.001;
    if (maxVal <= 0) maxVal = 0.001;
    
    const minLog = Math.log10(minVal);
    const maxLog = Math.log10(maxVal);
    const valLog = Math.log10(val);
    
    // Avoid division by zero
    if (maxLog === minLog) return 0;
    
    return ((valLog - minLog) / (maxLog - minLog)) * width;
  } else {
    // Linear scale
    if (maxVal === minVal) return 0;
    return ((val - minVal) / (maxVal - minVal)) * width;
  }
};

/**
 * Generates the SVG path d attribute for a filled area
 */
export const calculateFillPath = (
  curveData, 
  fillType, 
  fillSettings, 
  trackWidth, 
  trackHeight, 
  minDepth, 
  maxDepth, 
  scaleType, 
  logMin, 
  logMax, 
  otherCurves = []
) => {
  if (!curveData || curveData.length === 0) return '';

  const isLog = scaleType === 'log';
  const totalDepth = maxDepth - minDepth;
  
  // Helper to get Y coordinate from depth
  const getY = (depth) => ((depth - minDepth) / totalDepth) * trackHeight;

  // Helper to get X coordinate
  const getX = (val) => scaleValue(val, logMin, logMax, trackWidth, isLog);

  // Start building the path
  let path = '';
  
  // We need to process the curve points
  // curveData is assumed to be array of { depth, value }
  // Filter to visible range
  const visiblePoints = curveData.filter(p => p.depth >= minDepth && p.depth <= maxDepth);
  
  if (visiblePoints.length < 2) return '';

  // --- FILL STRATEGIES ---

  if (fillType === 'left' || fillType === 'track-to-curve') {
    // Fill from left edge (0) to curve
    path = `M 0 ${getY(visiblePoints[0].depth)}`; // Start top-left
    
    visiblePoints.forEach(p => {
      const x = getX(p.value);
      const y = getY(p.depth);
      if (x !== null) path += ` L ${x} ${y}`;
    });
    
    path += ` L 0 ${getY(visiblePoints[visiblePoints.length - 1].depth)} Z`; // Close to bottom-left then top-left
  } 
  
  else if (fillType === 'right' || fillType === 'curve-to-track') {
    // Fill from curve to right edge (trackWidth)
    path = `M ${trackWidth} ${getY(visiblePoints[0].depth)}`; // Start top-right
    
    visiblePoints.forEach(p => {
      const x = getX(p.value);
      const y = getY(p.depth);
      if (x !== null) path += ` L ${x} ${y}`;
    });
    
    path += ` L ${trackWidth} ${getY(visiblePoints[visiblePoints.length - 1].depth)} Z`;
  }
  
  else if (fillType === 'constant' || fillType === 'curve-to-constant') {
    // Fill from curve to a constant value line
    const constantVal = parseFloat(fillSettings.constantValue) || 0;
    const constantX = getX(constantVal);
    
    if (constantX === null) return '';

    path = `M ${constantX} ${getY(visiblePoints[0].depth)}`;
    
    visiblePoints.forEach(p => {
      const x = getX(p.value);
      const y = getY(p.depth);
      if (x !== null) path += ` L ${x} ${y}`;
    });
    
    path += ` L ${constantX} ${getY(visiblePoints[visiblePoints.length - 1].depth)} Z`;
  }

  else if (fillType === 'curve-to-curve' || fillType === 'between-curves') {
    // Fill between this curve and another reference curve
    const refCurveId = fillSettings.referenceCurveId;
    const refCurve = otherCurves.find(c => c.id === refCurveId);
    
    if (!refCurve || !refCurve.data) return '';

    // We need to align depths. Assuming sorted by depth.
    // Simple approach: Iterate primary curve, find closest point in ref curve (or interpolate)
    // For high performance rendering, simple index matching often used if depth steps are uniform.
    // Here we'll do a simple find.
    
    // Start path along primary curve
    const startP = visiblePoints[0];
    const startX = getX(startP.value);
    if (startX === null) return '';
    
    path = `M ${startX} ${getY(startP.depth)}`;
    
    visiblePoints.forEach(p => {
      const x = getX(p.value);
      const y = getY(p.depth);
      if (x !== null) path += ` L ${x} ${y}`;
    });

    // Now trace back along the reference curve
    // We need reference points in reverse order
    const refPoints = refCurve.data.filter(p => p.depth >= minDepth && p.depth <= maxDepth).reverse();
    
    if (refPoints.length === 0) return '';

    refPoints.forEach(p => {
        const x = getX(p.value); // Use SAME scale as primary curve usually
        const y = getY(p.depth);
        if (x !== null) path += ` L ${x} ${y}`;
    });
    
    path += ' Z';
  }

  return path;
};