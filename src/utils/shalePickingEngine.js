import { mean, linearRegression, linearRegressionLine } from 'simple-statistics';

/**
 * Filters well log data to identify shale points based on Gamma Ray (GR) cutoff.
 * @param {Object} data - Object containing arrays: depths, GR, dt, etc.
 * @param {Object} options - Options object, e.g., { vshaleCutoff: 75 }
 * @returns {Array} Array of point objects { depth, dt, gr, isShale }
 */
export const pickShalePoints = (data, options = { vshaleCutoff: 75 }) => {
    if (!data || !data.depths || !data.GR || !data.dt) {
        console.warn("pickShalePoints: Missing required data channels (depths, GR, or dt)");
        return [];
    }

    const { depths, GR, dt } = data;
    const cutoff = options.vshaleCutoff;
    const points = [];

    for (let i = 0; i < depths.length; i++) {
        const depth = depths[i];
        const grVal = GR[i];
        const dtVal = dt[i];

        // Validate data points (ignore nulls/NaNs)
        if (
            depth !== null && depth !== undefined &&
            grVal !== null && grVal !== undefined &&
            dtVal !== null && dtVal !== undefined &&
            !isNaN(grVal) && !isNaN(dtVal)
        ) {
            const isShale = grVal >= cutoff;
            
            // Optional: Filter unreasonable DT values (e.g., casing spikes or cycle skipping)
            // DT normally between 40 (Matrix) and 200 (Fluid/Mud)
            if (dtVal > 40 && dtVal < 200) {
                points.push({
                    depth,
                    dt: dtVal,
                    gr: grVal,
                    isShale
                });
            }
        }
    }

    return points;
};

/**
 * Fits a Normal Compaction Trend (NCT) to shale points using linear regression on log(DT).
 * Model: DT = a * exp(-b * Depth)
 * Linearized: ln(DT) = ln(a) - b * Depth
 * Y = ln(DT), X = Depth
 * Intercept = ln(a) => a = exp(Intercept)
 * Slope = -b => b = -Slope
 * 
 * @param {Array} points - Array of point objects from pickShalePoints
 * @returns {Object} { a, b, r2, count, valid } parameters for NCT equation
 */
export const fitNCT = (points) => {
    const shalePoints = points.filter(p => p.isShale && p.depth > 500); // Filter shallow noise if needed

    if (shalePoints.length < 10) {
        console.warn("fitNCT: Not enough shale points to fit trend.");
        return { a: 180, b: 0.00005, r2: 0, count: 0, valid: false }; 
    }

    // Prepare data for simple-statistics
    // We fit ln(DT) vs Depth
    const regressionData = shalePoints.map(p => [p.depth, Math.log(p.dt)]);

    // Calculate linear regression
    const result = linearRegression(regressionData); 
    const predict = linearRegressionLine(result);
    // result.m is slope, result.b is intercept (y-intercept of ln(dt))

    const b_param = -result.m; // b is positive decay constant usually
    const a_param = Math.exp(result.b);

    // Calculate R-squared
    const yValues = regressionData.map(d => d[1]);
    const yMean = mean(yValues);
    const ssTot = yValues.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
    const ssRes = regressionData.reduce((acc, d) => {
        const yPred = predict(d[0]); // Predicted ln(DT)
        return acc + Math.pow(d[1] - yPred, 2);
    }, 0);
    
    const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    // Sanity check values
    const safeA = (isNaN(a_param) || a_param < 40 || a_param > 300) ? 180 : a_param;
    const safeB = (isNaN(b_param)) ? 0.00005 : b_param; // Allow negative b for undercompaction zones, but warn?

    console.log(`NCT Fit: a=${safeA.toFixed(1)}, b=${safeB.toExponential(5)}, r2=${r2.toFixed(2)} from ${shalePoints.length} points`);

    return {
        a: safeA,
        b: safeB,
        r2: r2,
        count: shalePoints.length,
        valid: shalePoints.length > 10 && !isNaN(a_param)
    };
};