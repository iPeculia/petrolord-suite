// Utilities to convert internal state to exportable formats

export const formatResultsForExport = (results) => {
    // Flattens nested PPFG results into a simple array for CSV/Excel
    if (!results || !results.depths) return [];
    
    return results.depths.map((depth, i) => ({
        Depth: depth,
        PorePressure: results.pp ? (results.pp.p50 ? results.pp.p50[i] : results.pp[i]) : null,
        FractureGradient: results.fg ? (results.fg.p50 ? results.fg.p50[i] : results.fg[i]) : null,
        Overburden: results.obg ? results.obg[i] : null
    }));
};