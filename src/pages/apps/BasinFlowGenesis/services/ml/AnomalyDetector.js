import * as ss from 'simple-statistics';

export class AnomalyDetector {
    
    /**
     * Detect outliers using Z-score method.
     * Robust for normally distributed data.
     * @param {Array} data - Array of numerical values
     * @param {Number} threshold - Z-score threshold (default 3)
     */
    static detectZScore(data, threshold = 3) {
        if (!data || data.length < 2) return [];
        
        const mean = ss.mean(data);
        const sd = ss.standardDeviation(data);
        
        if (sd === 0) return data.map(() => false);

        return data.map((val, idx) => {
            const z = Math.abs((val - mean) / sd);
            return {
                index: idx,
                value: val,
                zScore: z,
                isAnomaly: z > threshold
            };
        });
    }

    /**
     * Detect outliers using IQR method.
     * Better for non-normal distributions.
     */
    static detectIQR(data) {
        if (!data || data.length < 4) return [];
        
        const q1 = ss.quantile(data, 0.25);
        const q3 = ss.quantile(data, 0.75);
        const iqr = q3 - q1;
        
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        
        return data.map((val, idx) => ({
            index: idx,
            value: val,
            isAnomaly: val < lowerBound || val > upperBound,
            score: Math.abs(val - (q1+q3)/2) / iqr // pseudo score
        }));
    }
    
    /**
     * Detect depth-trend anomalies (e.g. Ro vs Depth).
     * Fits a linear trend and finds points with high residuals.
     */
    static detectTrendAnomalies(depths, values, threshold = 2) {
        if(depths.length !== values.length || depths.length < 3) return [];
        
        const points = depths.map((d, i) => [d, values[i]]);
        const line = ss.linearRegression(points);
        const lineFunc = ss.linearRegressionLine(line);
        
        const residuals = points.map(([x, y]) => Math.abs(y - lineFunc(x)));
        
        // Analyze residuals for outliers
        const residMean = ss.mean(residuals);
        const residStd = ss.standardDeviation(residuals);
        
        return points.map(([x, y], i) => {
            const res = residuals[i];
            const z = residStd > 0 ? (res - residMean) / residStd : 0;
            return {
                depth: x,
                value: y,
                predicted: lineFunc(x),
                residual: res,
                isAnomaly: z > threshold
            };
        });
    }
}