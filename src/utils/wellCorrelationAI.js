// Utilities for AI-assisted picking and correlation analysis

/**
 * Simulates AI Top Picking using simple signal processing heuristics.
 * In a real scenario, this would call a Python/TensorFlow backend.
 * 
 * @param {Object} wellLogData - { depth: [], value: [] } for a specific curve (e.g. GR)
 * @param {String} patternType - 'peak', 'trough', 'inflection'
 * @returns {Array} - List of suggested picks [{depth, confidence, type}]
 */
export const predictTopsAI = (wellLogData, patternType = 'peak') => {
    const picks = [];
    if (!wellLogData || wellLogData.length < 10) return picks;

    const values = wellLogData.map(d => d.value);
    const depths = wellLogData.map(d => d.depth);
    
    // Simple moving average for smoothing
    const windowSize = 5;
    const smoothed = values.map((val, idx, arr) => {
        if (idx < windowSize || idx >= arr.length - windowSize) return val;
        let sum = 0;
        for (let i = -windowSize; i <= windowSize; i++) sum += arr[idx + i];
        return sum / (2 * windowSize + 1);
    });

    // Find local extrema
    for (let i = 10; i < smoothed.length - 10; i++) {
        const prev = smoothed[i-1];
        const curr = smoothed[i];
        const next = smoothed[i+1];
        
        let isPick = false;
        let confidence = 0.5;

        if (patternType === 'peak') {
            if (curr > prev && curr > next) {
                // Check prominence
                const localMean = smoothed.slice(i-10, i+10).reduce((a,b)=>a+b,0) / 20;
                if (curr > localMean * 1.1) {
                    isPick = true;
                    confidence = Math.min(0.95, (curr - localMean) / localMean);
                }
            }
        } else if (patternType === 'trough') {
            if (curr < prev && curr < next) {
                const localMean = smoothed.slice(i-10, i+10).reduce((a,b)=>a+b,0) / 20;
                if (curr < localMean * 0.9) {
                    isPick = true;
                    confidence = Math.min(0.95, (localMean - curr) / localMean);
                }
            }
        } else if (patternType === 'inflection') {
            // Simple derivative change (zero crossing of 2nd derivative approx)
            const d1_prev = smoothed[i] - smoothed[i-1];
            const d1_next = smoothed[i+1] - smoothed[i];
            if (Math.sign(d1_prev) !== Math.sign(d1_next)) {
                isPick = true;
                confidence = 0.6; // Lower confidence for simple inflection
            }
        }

        if (isPick) {
            // Debounce close picks
            if (picks.length > 0 && (depths[i] - picks[picks.length-1].depth) < 5) {
                if (confidence > picks[picks.length-1].confidence) {
                    picks[picks.length-1] = { depth: depths[i], confidence, type: patternType };
                }
            } else {
                picks.push({ depth: depths[i], confidence, type: patternType });
            }
        }
    }

    return picks;
};

/**
 * Calculates a correlation quality score between two curve segments.
 * Using simplified Cross-Correlation logic.
 */
export const calculateCorrelationQuality = (curveA, curveB) => {
    if (!curveA || !curveB || curveA.length === 0 || curveB.length === 0) return 0;

    // Resample to same depth step if needed (omitted for brevity, assuming visual alignment)
    // Calculate Pearson Correlation Coefficient
    const n = Math.min(curveA.length, curveB.length);
    if (n < 2) return 0;

    let sumA = 0, sumB = 0;
    for(let i=0; i<n; i++) {
        sumA += curveA[i].value;
        sumB += curveB[i].value;
    }
    const meanA = sumA / n;
    const meanB = sumB / n;

    let num = 0, denA = 0, denB = 0;
    for(let i=0; i<n; i++) {
        const dA = curveA[i].value - meanA;
        const dB = curveB[i].value - meanB;
        num += dA * dB;
        denA += dA * dA;
        denB += dB * dB;
    }

    const r = num / Math.sqrt(denA * denB);
    return isNaN(r) ? 0 : Math.abs(r); // Return absolute correlation (0 to 1)
};