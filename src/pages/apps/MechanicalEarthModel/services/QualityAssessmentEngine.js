/**
 * Assesses the quality of the calculation results.
 * @param {object} results - The calculated stress and pressure profiles.
 * @returns {object} - A quality report with a score, warnings, and summary.
 */
export const assessQuality = (results) => {
    const { depth, Sv, SHmax, Shmin, Pp, Fg } = results;
    let warnings = [];
    let score = 100;

    if (!depth || depth.length === 0) {
        return { score: 0, warnings: ["No data to assess."], summary: { qualityScore: 0, issues: 1 }};
    }

    // Check for physical feasibility of stresses
    let stressAnomalies = 0;
    for (let i = 0; i < depth.length; i++) {
        // Check for positive values
        if (Sv[i] < 0 || SHmax[i] < 0 || Shmin[i] < 0 || Pp[i] < 0 || Fg[i] < 0) {
            stressAnomalies++;
        }
        // Basic Andersonian check for NF/SS. TF will be different.
        if (Sv[i] < Shmin[i] || SHmax[i] < Shmin[i]) {
            stressAnomalies++;
        }
    }

    if (stressAnomalies > 0) {
        const percentage = ((stressAnomalies / depth.length) * 100).toFixed(1);
        warnings.push(`Stress relationship anomaly (e.g., Sv < Shmin) detected in ${percentage}% of the wellbore.`);
        score -= 20;
    }

    // Check for mud window inversion
    let mwInversions = 0;
    for (let i = 0; i < depth.length; i++) {
        if (Pp[i] > Fg[i]) {
            mwInversions++;
        }
    }

    if (mwInversions > 0) {
        const percentage = ((mwInversions / depth.length) * 100).toFixed(1);
        warnings.push(`Mud weight window is inverted (Pp > Fg) in ${percentage}% of the wellbore. This indicates severe overpressure or calculation issues.`);
        score -= 30;
    }

    // Check for NaN values
    const countNaN = (arr) => arr.filter(Number.isNaN).length;
    const nanCounts = {
        Sv: countNaN(Sv),
        SHmax: countNaN(SHmax),
        Shmin: countNaN(Shmin),
        Pp: countNaN(Pp),
        Fg: countNaN(Fg),
    };

    const totalPoints = depth.length * 5;
    const totalNaNs = Object.values(nanCounts).reduce((a, b) => a + b, 0);

    if (totalNaNs > 0) {
        const percentage = ((totalNaNs / totalPoints) * 100).toFixed(1);
        warnings.push(`Missing values (NaN) found in ${percentage}% of calculated data points. This may be due to gaps in input logs.`);
        score -= 15;
    }
    
    if (score < 0) score = 0;

    return {
        score: score,
        warnings: warnings,
        summary: {
            qualityScore: score.toFixed(0),
            issues: warnings.length,
            stressAnomalies,
            mwInversions,
            nanPoints: totalNaNs,
        }
    };
};