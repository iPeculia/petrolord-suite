// Data Validation Engine for PP-FG Analyzer
import { mean, standardDeviation, min, max } from 'simple-statistics';

const CURVE_ALIASES = {
    DEPTH: ['DEPTH', 'DEPT', 'MD', 'TVD'],
    TVD: ['TVD', 'TVDSS', 'Z'],
    GR: ['GR', 'GAM', 'GAPI', 'GAMMA', 'CGR', 'SGR'],
    RES: ['RES', 'RT', 'RD', 'ILD', 'LLD', 'HDRS', 'RESISTIVITY'],
    DEN: ['RHOB', 'RHO', 'DEN', 'DENSITY', 'ZDEN'],
    DT: ['DT', 'DTCO', 'AC', 'DTC', 'SONIC', 'DT24', 'DT4P'],
    CAL: ['CAL', 'CALI', 'CALS', 'HCAL'],
    ROP: ['ROP', 'ROPA', 'DRILL_RATE'],
    MW: ['MW', 'ECD', 'ESD', 'MUDWEIGHT']
};

const LOG_RANGES = {
    GR: { min: 0, max: 200, unit: 'API' },
    RES: { min: 0.1, max: 2000, unit: 'ohm.m' }, // Log scale usually
    DEN: { min: 1.5, max: 3.0, unit: 'g/cc' },
    DT: { min: 40, max: 200, unit: 'us/ft' },
    CAL: { min: 4, max: 36, unit: 'in' }
};

export const identifyCurveType = (mnemonic) => {
    const upperMnem = mnemonic.toUpperCase();
    for (const [type, aliases] of Object.entries(CURVE_ALIASES)) {
        if (aliases.some(alias => upperMnem.includes(alias))) {
            // Confidence score logic could go here
            return { type, confidence: 0.9 }; 
        }
    }
    return { type: 'UNKNOWN', confidence: 0.0 };
};

export const checkQuality = (data, curveName, type) => {
    const values = data.map(d => d[curveName]).filter(v => v !== null && v !== undefined && !isNaN(v));
    
    if (values.length === 0) return { status: 'Critical', message: 'No valid data found' };

    const limits = LOG_RANGES[type];
    const stats = {
        min: min(values),
        max: max(values),
        mean: mean(values),
        std: standardDeviation(values),
        count: values.length,
        missing: data.length - values.length
    };

    const issues = [];
    
    // Range checks
    if (limits) {
        if (stats.min < limits.min || stats.max > limits.max) {
            issues.push(`Values outside typical range (${limits.min}-${limits.max} ${limits.unit})`);
        }
    }

    // Outlier check (Simple Z-score > 3)
    const outliers = values.filter(v => Math.abs((v - stats.mean) / stats.std) > 3).length;
    if (outliers > 0) {
        issues.push(`${outliers} potential outliers detected`);
    }

    // Monotonicity for Depth
    if (type === 'DEPTH') {
        let isMonotonic = true;
        for(let i=1; i<values.length; i++) {
            if (values[i] <= values[i-1]) {
                isMonotonic = false; 
                break;
            }
        }
        if (!isMonotonic) issues.push('Depth is not strictly increasing');
    }

    return {
        status: issues.length > 0 ? 'Warning' : 'Good',
        issues,
        stats
    };
};

export const detectGaps = (data, depthCol, threshold = 50) => {
    // Identifies depth gaps larger than threshold
    const gaps = [];
    for (let i = 1; i < data.length; i++) {
        const d1 = data[i-1][depthCol];
        const d2 = data[i][depthCol];
        if (d2 - d1 > threshold) {
            gaps.push({ start: d1, end: d2, size: d2-d1 });
        }
    }
    return gaps;
};

export const generateValidationReport = (data, curveMapping) => {
    const report = {};
    Object.entries(curveMapping).forEach(([type, curveName]) => {
        if(curveName) {
            report[curveName] = checkQuality(data, curveName, type);
        }
    });
    return report;
};