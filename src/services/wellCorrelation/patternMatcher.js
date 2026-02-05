/**
 * Pattern Matcher Service
 * Identifies recurring log motifs (e.g., coarsening upward, fining upward).
 */

export const PATTERN_TYPES = {
  FINING_UPWARD: 'Fining Upward', // Bell shape (Gamma Ray)
  COARSENING_UPWARD: 'Coarsening Upward', // Funnel shape (Gamma Ray)
  BLOCKY: 'Blocky', // Box shape
  SERRATED: 'Serrated'
};

export const detectPatterns = (curveData, depthData) => {
  const patterns = [];
  // Simplified logic: analyze slopes over windows
  const windowSize = 50; // samples
  
  for (let i = 0; i < curveData.length - windowSize; i += windowSize / 2) {
    const window = curveData.slice(i, i + windowSize);
    const slope = calculateSlope(window);
    const variance = calculateVariance(window);

    let type = null;
    if (variance < 5) type = PATTERN_TYPES.BLOCKY; // Low variance
    else if (slope > 0.5) type = PATTERN_TYPES.FINING_UPWARD; // Increasing GR (assuming GR)
    else if (slope < -0.5) type = PATTERN_TYPES.COARSENING_UPWARD; // Decreasing GR

    if (type) {
      patterns.push({
        type,
        startDepth: depthData[i],
        endDepth: depthData[i + windowSize],
        confidence: 0.8 // Mock confidence
      });
    }
  }
  return patterns;
};

const calculateSlope = (arr) => {
  const n = arr.length;
  if (n < 2) return 0;
  // Simple linear regression slope
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += arr[i];
    sumXY += i * arr[i];
    sumX2 += i * i;
  }
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
};

const calculateVariance = (arr) => {
  const n = arr.length;
  if (n < 2) return 0;
  const mean = arr.reduce((a, b) => a + b) / n;
  return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
};