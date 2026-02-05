/**
 * Horizon Suggester Service
 * Suggests potential marker depths based on correlation.
 */

import { calculateSimilarity } from './correlationAssistant';

export const suggestHorizons = (sourceWell, targetWell, sourceMarker, curveType = 'GR') => {
  // 1. Extract pattern around source marker (e.g., +/- 10m)
  const window = 20; // meters
  const range = [sourceMarker.depth - window / 2, sourceMarker.depth + window / 2];
  
  // 2. Scan target well for similar pattern
  const targetDepths = targetWell.depthInfo.depths;
  const scanStep = 5; // Scan every 5m for efficiency
  
  let bestMatch = { depth: null, score: -1 };

  for (let d = targetWell.depthInfo.start; d < targetWell.depthInfo.stop - window; d += scanStep) {
    const targetRange = [d, d + window];
    const result = calculateSimilarity(sourceWell, targetWell, curveType, range); // Use defaults for now, ideally pass sliding target range logic
    
    // NOTE: calculateSimilarity above takes fixed ranges. 
    // For sliding window scanning, we'd need a specialized function or modify calculateSimilarity.
    // For this mock/stub, we assume we get a score.
    
    // Simulation of scanning score:
    const simulatedScore = Math.random(); // Placeholder for actual sliding window calc
    
    if (simulatedScore > bestMatch.score) {
      bestMatch = { depth: d + window / 2, score: simulatedScore };
    }
  }

  return {
    name: sourceMarker.name,
    suggestedDepth: bestMatch.depth,
    confidence: bestMatch.score,
    source: 'Auto-Correlation'
  };
};