import * as d3 from 'd3';

export const calculateGhostCurve = (sourceData, shift) => {
    if (!sourceData) return [];
    return sourceData.map(pt => ({
        depth: pt.depth + shift,
        value: pt.value
    }));
};

export const getCommonDepthRange = (wells) => {
    if (!wells || wells.length === 0) return [0, 1000];
    let min = Infinity;
    let max = -Infinity;
    wells.forEach(w => {
        const curves = Object.values(w.log_data || {});
        curves.forEach(data => {
            if (data && data.length) {
                const dMin = data[0].depth;
                const dMax = data[data.length - 1].depth;
                if (dMin < min) min = dMin;
                if (dMax > max) max = dMax;
            }
        });
    });
    // Add buffer
    return [min === Infinity ? 0 : Math.max(0, min - 100), max === -Infinity ? 1000 : max + 100];
};

export const calculateR2 = (curve1, curve2, shift) => {
    // Mock R-squared calculation for ghost matching
    // In reality, we would interpolate curve2 to curve1's depth steps and compute pearson
    // Here we simulate it based on shift proximity to "0" or some random noise for demo
    const noise = Math.random() * 0.1;
    const optimalShift = 0; // Assume 0 is best for this mock
    const distance = Math.abs(shift - optimalShift);
    const score = Math.max(0, 1 - (distance / 100)) - noise; 
    return Math.min(1, Math.max(0, score));
};

export const autoCorrelate = (curve1, curve2) => {
    // Mock auto-correlation finding the best shift
    // Returns best shift and confidence
    const bestShift = (Math.random() * 50) - 25; // Random shift between -25 and 25
    const confidence = 0.7 + (Math.random() * 0.3);
    return { shift: bestShift, confidence };
};

export const getFlatteningOffsets = (wells, datumName) => {
    const offsets = {};
    if (!datumName) {
        wells.forEach(w => offsets[w.id] = 0);
        return offsets;
    }

    let maxDatumDepth = 0;
    
    // First pass: find depths
    const wellDepths = {};
    wells.forEach(w => {
        const top = (w.meta?.tops || []).find(t => t.name === datumName);
        if (top) {
            wellDepths[w.id] = top.md;
            if (top.md > maxDatumDepth) maxDatumDepth = top.md;
        } else {
            wellDepths[w.id] = null;
        }
    });

    // Second pass: calc offsets to align to a flat line (e.g. at 0 relative, or at maxDatumDepth)
    // We want the datum to appear at the same Y screen coordinate.
    // If we shift so datum is at Y=0: offset = -datumDepth
    wells.forEach(w => {
        if (wellDepths[w.id] !== null) {
            offsets[w.id] = -wellDepths[w.id]; 
        } else {
            offsets[w.id] = 0; // No datum found, no shift (or maybe align by avg?)
        }
    });
    
    return offsets;
};

export const predictTops = (logData, existingTops) => {
    // Mock AI prediction
    const predictions = [];
    const depths = logData.GR?.map(d => d.depth) || [];
    if (depths.length > 0) {
        const count = 2; 
        for(let i=0; i<count; i++) {
            const randomIdx = Math.floor(0.2 * depths.length + Math.random() * 0.6 * depths.length);
            predictions.push({
                name: `Predicted Top ${String.fromCharCode(65+i)}`,
                md: depths[randomIdx],
                tvd: depths[randomIdx], // Assuming vertical for simple demo
                confidence: 0.7 + Math.random() * 0.25,
                source: 'AI'
            });
        }
    }
    return predictions;
};