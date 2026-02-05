// Unit Conversion Utilities for PP-FG Analyzer

// Conversion Factors
const CONVERSIONS = {
    pressure: {
        psi_bar: 0.0689476,
        bar_psi: 14.5038,
        psi_pa: 6894.76,
        pa_psi: 0.000145038,
        // Note: PPG/SG conversion depends on depth, handled separately via Gradient fns
    },
    depth: {
        ft_m: 0.3048,
        m_ft: 3.28084,
    },
    velocity: {
        fts_ms: 0.3048,
        ms_fts: 3.28084,
        usft_ms: (us) => 1000000 / us * 0.3048, // Transit time (us/ft) to Velocity (m/s)
        ms_usft: (v) => 1000000 / (v * 3.28084) // Velocity (m/s) to Transit time (us/ft)
    },
    density: {
        gcc_kgm3: 1000,
        kgm3_gcc: 0.001,
        ppg_gcc: 0.119826,
        gcc_ppg: 8.3454,
        sg_ppg: 8.33, // SG (water=1) to PPG
        ppg_sg: 0.12  // PPG to SG
    }
};

export const convertValue = (value, fromUnit, toUnit) => {
    if (value === null || value === undefined || isNaN(value)) return null;
    if (fromUnit === toUnit) return value;

    const key = `${fromUnit.toLowerCase()}_${toUnit.toLowerCase()}`;
    
    // Direct Check
    if (CONVERSIONS.pressure[key]) return value * CONVERSIONS.pressure[key];
    if (CONVERSIONS.depth[key]) return value * CONVERSIONS.depth[key];
    if (CONVERSIONS.density[key]) return value * CONVERSIONS.density[key];
    
    // Velocity Special Cases (functions)
    if (CONVERSIONS.velocity[key]) {
         if (typeof CONVERSIONS.velocity[key] === 'function') {
             return CONVERSIONS.velocity[key](value);
         }
         return value * CONVERSIONS.velocity[key];
    }

    // Temperature
    if (fromUnit === 'C' && toUnit === 'F') return (value * 9/5) + 32;
    if (fromUnit === 'F' && toUnit === 'C') return (value - 32) * 5/9;

    // Fallback (Identity)
    return value;
};

export const convertGradientToPressure = (grad, depth, unit = 'psi') => {
    // grad in ppg, depth in ft -> output in psi
    if (unit === 'psi') return grad * 0.052 * depth;
    return grad; // placeholder
};

export const convertPressureToGradient = (pressure, depth, unit = 'ppg') => {
    // pressure in psi, depth in ft -> output in ppg
    if (depth === 0) return 0;
    if (unit === 'ppg') return pressure / (0.052 * depth);
    return pressure;
};

export const standardizeUnits = (data, curveMapping, currentUnits) => {
    // Converts entire dataset to standard field units: Depth(ft), Pressure(psi), Density(g/cc), Sonic(us/ft)
    const standardUnits = {
        DEPTH: 'ft',
        TVD: 'ft',
        GR: 'api',
        RES: 'ohm.m',
        DEN: 'g/cc',
        DT: 'us/ft',
        CAL: 'in'
    };

    return data.map(row => {
        const newRow = { ...row };
        Object.keys(curveMapping).forEach(type => {
            const curveName = curveMapping[type];
            if (curveName && row[curveName] !== undefined) {
                const currentUnit = currentUnits[curveName];
                const targetUnit = standardUnits[type];
                
                if (currentUnit && targetUnit && currentUnit !== targetUnit) {
                    newRow[curveName] = convertValue(row[curveName], currentUnit, targetUnit);
                }
            }
        });
        return newRow;
    });
};