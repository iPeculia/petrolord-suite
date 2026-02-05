/**
 * Aggregates statistics across multiple wells at standard depth intervals.
 */
export const aggregateStatistics = (wells) => {
    if (!wells || wells.length === 0) return [];

    // Find common depth range
    // Simplified: assume all wells start near surface. Find max depth.
    const maxDepth = Math.max(...wells.map(w => Math.max(...w.depths)));
    const step = 50; // 50ft increments
    const stats = [];

    for (let d = 0; d <= maxDepth; d += step) {
        const ppValues = [];
        const fgValues = [];

        wells.forEach(w => {
            // Find closest index
            // Note: Assuming w.depths is sorted
            // Optimization: Could carry index forward instead of searching every time
            const idx = w.depths.findIndex(wd => Math.abs(wd - d) < step/2);
            
            if (idx !== -1) {
                if (w.results.pp[idx] != null) ppValues.push(w.results.pp[idx]);
                if (w.results.fg[idx] != null) fgValues.push(w.results.fg[idx]);
            }
        });

        if (ppValues.length > 0) {
            stats.push({
                depth: d,
                pp: {
                    min: Math.min(...ppValues),
                    max: Math.max(...ppValues),
                    mean: ppValues.reduce((a,b) => a + b, 0) / ppValues.length
                },
                fg: {
                    mean: fgValues.length > 0 ? fgValues.reduce((a,b) => a + b, 0) / fgValues.length : 0
                }
            });
        }
    }

    return stats;
};