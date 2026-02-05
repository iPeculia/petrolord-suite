import { linearRegression, linearRegressionLine, mean } from 'simple-statistics';

/**
 * Calculates Normal Compaction Trend (NCT) from well log data.
 * Uses exponential decay model: DT = a * exp(-b * Depth)
 * Linearized form: ln(DT) = ln(a) - b * Depth
 * 
 * @param {Object} data - Object containing { depths: [], GR: [], dt: [] }
 * @param {number} shaleThreshold - Gamma Ray cutoff for shale (API)
 * @returns {Object} Result object with parameters and validation status
 */
export const calculateNCT = (data, shaleThreshold = 75) => {
    // 1. Data Validation
    if (!data || !data.depths || !data.GR || !data.dt) {
        return { 
            valid: false, 
            message: "Missing required log curves (Depth, GR, DT)",
            shalePointsCount: 0 
        };
    }

    const { depths, GR, dt } = data;
    const shalePoints = [];
    const regressionData = []; // [x, y] = [depth, ln(dt)]

    // 2. Shale Point Identification & Data Prep
    for (let i = 0; i < depths.length; i++) {
        const d = depths[i];
        const g = GR[i];
        const t = dt[i];

        // Filter valid data and shale cutoff
        // Ignore shallow hole (< 500ft) and nulls
        if (
            d > 500 && 
            g !== null && g !== undefined && 
            t !== null && t !== undefined && t > 0 &&
            g >= shaleThreshold
        ) {
            // Additional outlier filter for DT (typical range 40-200 us/ft)
            if (t > 40 && t < 200) {
                shalePoints.push({ depth: d, gr: g, dt: t });
                regressionData.push([d, Math.log(t)]);
            }
        }
    }

    const count = shalePoints.length;

    // 3. Minimum Points Check
    if (count < 5) {
        return {
            valid: false,
            message: `Insufficient shale points found (${count}). Lower the Vshale cutoff.`,
            shalePointsCount: count,
            intercept: 0,
            slope: 0,
            rSquared: 0
        };
    }

    // 4. Linear Regression (ln(DT) vs Depth)
    const result = linearRegression(regressionData); 
    // result.m = slope (-b)
    // result.b = intercept (ln(a))

    const b_param = -result.m; 
    const a_param = Math.exp(result.b);

    // 5. R-Squared Calculation
    const predict = linearRegressionLine(result);
    const yValues = regressionData.map(p => p[1]);
    const yMean = mean(yValues);
    const ssTot = yValues.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
    const ssRes = regressionData.reduce((acc, p) => {
        const yPred = predict(p[0]);
        return acc + Math.pow(p[1] - yPred, 2);
    }, 0);
    
    // Handle perfect fit or single point edge case (though count < 5 handles single point)
    const rSquared = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    // 6. Validation Logic
    let valid = true;
    let message = "Trend calculated successfully";

    // Sanity checks for Gulf of Mexico / Typical Basins
    // Surface DT (a) usually 140-200 us/ft
    // Decay (b) usually 1e-5 to 1e-4
    if (a_param < 50 || a_param > 250) {
        valid = false;
        message = `Intercept (a=${a_param.toFixed(0)}) is out of typical range (50-250).`;
    } else if (b_param < 0) {
        valid = false; // Negative decay means velocity decreases with depth (undercompaction or bad data)
        message = "Calculated negative compaction (velocity decreases with depth). Check data.";
    } else if (rSquared < 0.2) {
        // Warning but maybe allow manual override? For now, flag as questionable
        message = `Poor trend fit (R²=${rSquared.toFixed(2)}). Scatter is high.`;
        // We keep valid=true to allow user to see it, but UI will show warning
    }

    return {
        valid,
        message,
        shalePointsCount: count,
        intercept: a_param,
        slope: b_param,
        rSquared: rSquared,
        shalePoints: shalePoints // Optional: return points for visualization if needed
    };
};