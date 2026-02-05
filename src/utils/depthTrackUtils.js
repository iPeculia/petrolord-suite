/**
 * Utilities for Depth Track calculations and rendering
 */

export const DEPTH_TYPES = {
  MD: 'DEPTH_MD',
  TVD: 'DEPTH_TVD',
  TVDSS: 'DEPTH_TVDSS'
};

export const DEPTH_COLORS = {
  [DEPTH_TYPES.MD]: '#3b82f6',    // Blue-500
  [DEPTH_TYPES.TVD]: '#10b981',   // Emerald-500
  [DEPTH_TYPES.TVDSS]: '#a855f7'  // Purple-500
};

export const DEPTH_LABELS = {
  [DEPTH_TYPES.MD]: 'MD',
  [DEPTH_TYPES.TVD]: 'TVD',
  [DEPTH_TYPES.TVDSS]: 'TVDSS'
};

/**
 * Binary search for closest index in sorted array
 * Returns an index where arr[index] >= value
 */
export const findClosestIndex = (arr, value) => {
  if (!arr || arr.length === 0) return 0;
  
  let low = 0;
  let high = arr.length - 1;
  let ans = arr.length;

  while(low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] >= value) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
};

/**
 * Interpolates a value from a source array to a target array.
 * Example: Given a TVD value, find the corresponding MD.
 * @param {Array<number>} targetArr - The array to interpolate into (e.g., MD).
 * @param {Array<number>} sourceArr - The array containing the known value (e.g., TVD).
 * @param {number} sourceVal - The value in the source array to find a match for.
 * @returns {number} The interpolated value in the target array.
 */
export const interpolateDepth = (targetArr, sourceArr, sourceVal) => {
  if (!sourceArr || sourceArr.length === 0 || !targetArr || targetArr.length === 0) return sourceVal;
  
  // Find index i in sourceArr such that sourceArr[i-1] < sourceVal <= sourceArr[i]
  let idx = findClosestIndex(sourceArr, sourceVal);

  // Boundary checks
  if (idx === 0) return targetArr[0];
  if (idx >= sourceArr.length) return targetArr[targetArr.length - 1];
  
  const s0 = sourceArr[idx - 1];
  const s1 = sourceArr[idx];
  const t0 = targetArr[idx - 1];
  const t1 = targetArr[idx];
  
  // Avoid division by zero if source values are identical
  if (s1 === s0) return t0;

  // Linear interpolation
  const factor = (sourceVal - s0) / (s1 - s0);
  return t0 + factor * (t1 - t0);
};