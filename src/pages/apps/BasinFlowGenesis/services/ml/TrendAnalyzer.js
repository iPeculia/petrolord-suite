import * as ss from 'simple-statistics';

export class TrendAnalyzer {
    
    /**
     * Analyze trend of Y vs X
     */
    static analyze(xData, yData) {
        if (xData.length !== yData.length || xData.length < 2) return null;
        
        const points = xData.map((x, i) => [x, yData[i]]);
        const regression = ss.linearRegression(points);
        const line = ss.linearRegressionLine(regression);
        const r2 = ss.rSquared(points, line);
        
        return {
            slope: regression.m,
            intercept: regression.b,
            r2: r2,
            predict: line,
            description: this.describeTrend(regression.m, r2)
        };
    }

    static describeTrend(slope, r2) {
        let strength = r2 > 0.8 ? 'Strong' : r2 > 0.5 ? 'Moderate' : 'Weak';
        let direction = slope > 0 ? 'Increasing' : 'Decreasing';
        return `${strength} ${direction} Trend`;
    }
}