// New utility file for QC specific calculations to avoid bloating the main calculation file further
import { calculateLinearRegression } from './petrophysicsCalculations';

export const calculateStatistics = (values) => {
    if (!values || values.length === 0) return null;
    
    const validValues = values.filter(v => v !== null && !isNaN(v));
    if (validValues.length === 0) return null;

    validValues.sort((a, b) => a - b);
    const min = validValues[0];
    const max = validValues[validValues.length - 1];
    const sum = validValues.reduce((a, b) => a + b, 0);
    const mean = sum / validValues.length;
    
    const q1 = validValues[Math.floor(validValues.length * 0.25)];
    const q3 = validValues[Math.floor(validValues.length * 0.75)];
    const median = validValues[Math.floor(validValues.length * 0.5)];
    const iqr = q3 - q1;
    
    // Outliers via IQR
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = validValues.filter(v => v < lowerBound || v > upperBound).length;

    // Std Dev
    const variance = validValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validValues.length;
    const stdDev = Math.sqrt(variance);

    return { min, max, mean, median, stdDev, q1, q3, iqr, outliers, count: validValues.length, total: values.length };
};

export const checkPhysicsBounds = (mnemonic, value) => {
    // Returns: null (ok), 'warning', 'critical'
    if (value === null || isNaN(value)) return null;

    const rules = {
        'GR': { min: 0, max: 200, critMin: -10, critMax: 500 },
        'NPHI': { min: -0.05, max: 0.6, critMin: -0.15, critMax: 1.0 }, // Neutron can be slightly negative in gas or tight rock corrections
        'RHOB': { min: 1.5, max: 3.0, critMin: 1.0, critMax: 3.5 },
        'DT': { min: 40, max: 140, critMin: 30, critMax: 200 },
        'PHIE': { min: 0, max: 0.4, critMin: -0.05, critMax: 0.6 },
        'SW': { min: 0, max: 1, critMin: -0.1, critMax: 1.1 },
        'VSH': { min: 0, max: 1, critMin: -0.1, critMax: 1.1 },
        'CALI': { min: 4, max: 24, critMin: 0, critMax: 36 }
    };

    const m = mnemonic.toUpperCase();
    const rule = Object.keys(rules).find(k => m.includes(k));
    
    if (!rule) return null;
    
    const r = rules[rule];
    if (value < r.critMin || value > r.critMax) return 'critical';
    if (value < r.min || value > r.max) return 'warning';
    
    return null;
};

export const runQCAnalysis = (well) => {
    const report = {
        wellId: well.id,
        wellName: well.name,
        timestamp: new Date().toISOString(),
        flags: [],
        stats: {},
        score: 100,
        gaps: []
    };

    if (!well.data || well.data.length === 0) {
        report.flags.push({ severity: 'Critical', message: 'Well has no data records.', section: 'General' });
        report.score = 0;
        return report;
    }

    // 1. Depth Continuity Check
    const depthKey = well.curveMap['DEPTH'];
    const depths = well.data.map(d => d[depthKey]).filter(d => d !== null);
    
    if (depths.length > 1) {
        let gapCount = 0;
        const nominalStep = well.statistics.step || Math.abs(depths[1] - depths[0]);
        const gapThreshold = nominalStep * 1.5; // Tolerance for gap

        for (let i = 1; i < depths.length; i++) {
            const diff = Math.abs(depths[i] - depths[i-1]);
            if (diff > gapThreshold) {
                gapCount++;
                if (gapCount <= 5) { // Limit explicit flags
                    report.gaps.push({ top: Math.min(depths[i-1], depths[i]), base: Math.max(depths[i-1], depths[i]), size: diff });
                }
            }
        }
        if (gapCount > 0) {
            report.flags.push({ severity: 'Warning', message: `Detected ${gapCount} depth gaps > ${gapThreshold.toFixed(2)} units.`, section: 'Depth' });
            report.score -= Math.min(20, gapCount * 2);
        }
    } else {
        report.flags.push({ severity: 'Critical', message: 'Insufficient depth points.', section: 'Depth' });
        report.score = 0;
        return report;
    }

    // 2. Curve Statistics & Outliers
    const mnemonics = Object.keys(well.curveMap).filter(k => k !== 'DEPTH' && well.curveMap[k]);
    
    let totalOutliers = 0;
    let totalWarnings = 0;
    let totalCriticals = 0;

    mnemonics.forEach(curveType => {
        const curveName = well.curveMap[curveType];
        const values = well.data.map(d => d[curveName]);
        const stats = calculateStatistics(values);
        
        if (stats) {
            report.stats[curveType] = stats;
            
            // Outlier penalty
            if (stats.outliers > 0) {
                const outlierPct = (stats.outliers / stats.count) * 100;
                if (outlierPct > 5) {
                    report.flags.push({ severity: 'Warning', message: `${curveType} has ${outlierPct.toFixed(1)}% statistical outliers.`, section: 'Statistics' });
                    totalOutliers += outlierPct;
                }
            }

            // Missing Data Check
            const missingPct = ((stats.total - stats.count) / stats.total) * 100;
            if (missingPct > 10) {
                report.flags.push({ severity: 'Info', message: `${curveType} missing ${missingPct.toFixed(1)}% of interval.`, section: 'Completeness' });
            }

            // Physics Bounds Check
            let physWarnings = 0;
            let physCriticals = 0;
            values.forEach(v => {
                const check = checkPhysicsBounds(curveType, v);
                if (check === 'warning') physWarnings++;
                if (check === 'critical') physCriticals++;
            });

            if (physCriticals > 0) {
                report.flags.push({ severity: 'Critical', message: `${curveType} has ${physCriticals} values with physically impossible values.`, section: 'Physics' });
                totalCriticals++;
            } else if (physWarnings > (stats.count * 0.05)) {
                report.flags.push({ severity: 'Warning', message: `${curveType} has values outside typical range.`, section: 'Physics' });
                totalWarnings++;
            }
        }
    });

    // 3. Cross-Property Validation (e.g., Density-Porosity correlation check)
    // If PHIE and RHOB exist, check correlation. High PHIE should map to Low RHOB.
    if (report.stats['PHIE'] && report.stats['RHOB']) {
        const phie = well.data.map(d => d[well.curveMap['PHIE']]);
        const rhob = well.data.map(d => d[well.curveMap['RHOB']]);
        // Filter valid pairs
        const pairsX = [];
        const pairsY = [];
        for(let i=0; i<phie.length; i++) {
            if (phie[i] != null && rhob[i] != null) {
                pairsX.push(phie[i]);
                pairsY.push(rhob[i]);
            }
        }
        if (pairsX.length > 10) {
            const reg = calculateLinearRegression(pairsX, pairsY);
            // Slope should be negative (approx density = matrix - phi*(matrix-fluid))
            // matrix ~ 2.65, fluid ~ 1.0. Slope approx -1.65.
            if (reg.slope > 0) {
                report.flags.push({ severity: 'Warning', message: 'Positive correlation found between PHIE and RHOB. Possible data mismatch or bad calculation.', section: 'Correlation' });
                totalWarnings += 5;
            }
        }
    }

    // Scoring Logic
    // Deduct points for issues
    report.score -= (totalCriticals * 10);
    report.score -= (totalWarnings * 2);
    report.score -= (totalOutliers * 0.5);
    
    report.score = Math.max(0, Math.min(100, report.score));

    return report;
};