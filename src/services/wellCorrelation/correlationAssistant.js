/**
 * Correlation Assistant Service
 * Provides logic for auto-correlation, pattern matching, and suggestions.
 */

import { getValueAtDepth } from '@/utils/wellCorrelation/depthHandler';

export const calculateSimilarity = (wellA, wellB, curveType, depthRange, method = 'pearson') => {
  // 1. Extract curves
  const curveA = wellA.curves.find(c => c.mnemonic === curveType);
  const curveB = wellB.curves.find(c => c.mnemonic === curveType);

  if (!curveA || !curveB) {
    console.warn('Missing curves for similarity calculation');
    return { score: 0, method };
  }

  // 2. Extract data within depth range
  const dataA = extractDataInRange(wellA.depthInfo.depths, curveA.data, depthRange);
  const dataB = extractDataInRange(wellB.depthInfo.depths, curveB.data, depthRange);

  // 3. Normalize lengths (simple resampling/interpolation for demo)
  // In production, use Dynamic Time Warping (DTW) to handle stretching/squeezing
  const length = Math.min(dataA.length, dataB.length);
  const arrA = dataA.slice(0, length);
  const arrB = dataB.slice(0, length);

  // 4. Calculate Metric
  let score = 0;
  if (method === 'pearson') {
    score = calculatePearsonCorrelation(arrA, arrB);
  } else if (method === 'euclidean') {
    score = calculateEuclideanSimilarity(arrA, arrB);
  }

  return {
    score,
    confidence: Math.abs(score) > 0.7 ? 'High' : Math.abs(score) > 0.4 ? 'Medium' : 'Low',
    details: `Computed using ${method} on ${length} points.`
  };
};

// --- Helpers ---

const extractDataInRange = (depths, values, range) => {
  const result = [];
  for (let i = 0; i < depths.length; i++) {
    if (depths[i] >= range[0] && depths[i] <= range[1]) {
      result.push(values[i]);
    }
  }
  return result;
};

const calculatePearsonCorrelation = (x, y) => {
  const n = x.length;
  if (n === 0) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

  return denominator === 0 ? 0 : numerator / denominator;
};

const calculateEuclideanSimilarity = (x, y) => {
  let sumSqDiff = 0;
  for (let i = 0; i < x.length; i++) {
    sumSqDiff += Math.pow(x[i] - y[i], 2);
  }
  const dist = Math.sqrt(sumSqDiff);
  // Convert distance to similarity score (0 to 1)
  return 1 / (1 + dist); 
};