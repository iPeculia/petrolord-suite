import * as d3 from 'd3';
import { mean, median, standardDeviation as deviation, quantile } from 'simple-statistics';

// Generate synthetic well log data for demo
export const generateSyntheticLogs = (startDepth = 1000, endDepth = 1500, step = 0.5) => {
    const data = [];
    let previousLithology = 0; // 0 to 1 (shale to sand)

    for (let d = startDepth; d <= endDepth; d += step) {
        // Random walk for lithology to create beds
        const change = (Math.random() - 0.5) * 0.1;
        let lithology = Math.max(0, Math.min(1, previousLithology + change));
        
        // Occasionally jump (bed boundary)
        if (Math.random() < 0.02) lithology = Math.random();
        previousLithology = lithology;

        // Gamma Ray: Shale (0) -> High GR (120), Sand (1) -> Low GR (20)
        const gr = 120 - (lithology * 100) + (Math.random() * 5);
        
        // Resistivity: Sand (1) -> High Res (if HC), Shale (0) -> Low Res
        const fluid = d < 1300 ? 1 : 0; // 1 = Oil, 0 = Water
        const resMatrix = lithology > 0.7 ? (fluid ? 100 : 2) : 2;
        const res = resMatrix + (Math.random() * (resMatrix * 0.1));
        
        // Density (RHOB): Sand ~2.65, Shale ~2.45
        const rhob = 2.5 + (1 - lithology) * 0.15 + (Math.random() * 0.02);
        
        // Neutron (NPHI): Sand low, Shale high
        const nphi = 0.45 - (lithology * 0.3) + (Math.random() * 0.03);
        
        // Sonic (DT)
        const dt = 100 - (lithology * 40) + (Math.random() * 2);

        data.push({
            depth: d,
            GR: gr,
            RES: Math.max(0.2, res),
            RHOB: rhob,
            NPHI: nphi,
            DT: dt,
            // Placeholders
            PHI: null,
            SW: null
        });
    }
    return data;
};

export const calculateCurveStats = (data, curveName) => {
    const values = data.map(d => d[curveName]).filter(v => v != null && !isNaN(v) && v !== -999.25);
    if (!values.length) return { min: 0, max: 0, mean: 0, std: 0, p10: 0, p50: 0, p90: 0, count: 0 };

    values.sort((a, b) => a - b);
    
    return { 
        min: values[0], 
        max: values[values.length - 1], 
        mean: mean(values), 
        std: deviation(values), // 'deviation' is now an alias for 'standardDeviation'
        p10: quantile(values, 0.1),
        p25: quantile(values, 0.25), 
        p50: median(values), 
        p75: quantile(values, 0.75),
        p90: quantile(values, 0.9),
        count: values.length
    };
};

export const calculateCorrelationMatrix = (data, curveNames) => {
    const correlations = [];
    
    curveNames.forEach(c1 => {
        const row = { name: c1, values: {} };
        const v1 = data.map(d => d[c1]);
        
        curveNames.forEach(c2 => {
            if (c1 === c2) {
                row.values[c2] = 1;
            } else {
                const v2 = data.map(d => d[c2]);
                const pairs = v1.map((val, i) => [val, v2[i]]).filter(p => 
                    p[0] != null && !isNaN(p[0]) && p[0] !== -999.25 &&
                    p[1] != null && !isNaN(p[1]) && p[1] !== -999.25
                );
                
                if (pairs.length > 10) {
                    const x = pairs.map(p => p[0]);
                    const y = pairs.map(p => p[1]);
                    const xMean = mean(x);
                    const yMean = mean(y);
                    
                    let num = 0;
                    let den1 = 0;
                    let den2 = 0;
                    
                    for (let i = 0; i < x.length; i++) {
                        const dx = x[i] - xMean;
                        const dy = y[i] - yMean;
                        num += dx * dy;
                        den1 += dx * dx;
                        den2 += dy * dy;
                    }
                    
                    const r = num / Math.sqrt(den1 * den2);
                    row.values[c2] = r || 0;
                } else {
                    row.values[c2] = 0;
                }
            }
        });
        correlations.push(row);
    });
    return correlations;
};

export const detectAnomalies = (data, curveName, threshold = 3) => {
    const stats = calculateCurveStats(data, curveName);
    const anomalies = [];
    
    data.forEach(d => {
        const val = d[curveName];
        if (val == null || isNaN(val) || val === -999.25) {
             anomalies.push({ depth: d.depth, value: null, type: 'gap' });
             return;
        }
        
        if (stats.std > 0) {
            const zScore = (val - stats.mean) / stats.std;
            if (Math.abs(zScore) > threshold) {
                anomalies.push({ depth: d.depth, value: val, type: 'spike', zScore });
            }
        }
    });
    
    const gapCount = anomalies.filter(a => a.type === 'gap').length;
    const spikeCount = anomalies.filter(a => a.type === 'spike').length;
    const total = data.length;
    
    const score = Math.max(0, 100 - ((gapCount * 2 + spikeCount) / total * 100));
    
    return { anomalies, score, gapCount, spikeCount };
};

export const calculatePetrophysics = (data, params) => {
    const { m = 2, n = 2, a = 1, Rw = 0.05, matrixRho = 2.65, fluidRho = 1.0 } = params;
    
    return data.map(d => {
        // Porosity from Density
        let phi = null;
        if (d.RHOB != null && d.RHOB > 1.0) {
            phi = (matrixRho - d.RHOB) / (matrixRho - fluidRho);
            phi = Math.max(0.001, Math.min(0.45, phi));
        }
        
        // Archie's Water Saturation
        let sw = null;
        if (phi != null && d.RES != null && d.RES > 0) {
            const numerator = a * Rw;
            const denominator = Math.pow(phi, m) * d.RES;
            const swPower = numerator / denominator;
            sw = Math.pow(swPower, 1/n);
            sw = Math.max(0, Math.min(1, sw));
        }
        
        // Permeability (Timur-Coates approximation)
        let k = null;
        if (phi != null) {
             k = 10000 * Math.pow(phi, 4.5); 
        }

        return { ...d, PHI_CALC: phi, SW_CALC: sw, PERM_CALC: k };
    });
};