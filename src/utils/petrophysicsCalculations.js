import { simplify } from 'simplify-js'; 

// --- LAS Parsing (Preserved) ---
export const parseLAS = (text) => {
  const lines = text.split('\n');
  const wellParams = {};
  const curves = [];
  const data = [];
  
  let section = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('~')) {
      if (trimmed.includes('Well')) section = 'WELL';
      else if (trimmed.includes('Curve')) section = 'CURVE';
      else if (trimmed.includes('Ascii') || trimmed.includes('A')) section = 'DATA';
      else section = null;
      return;
    }
    
    if (trimmed.startsWith('#') || !trimmed) return;

    if (section === 'WELL') {
      const match = trimmed.match(/^([^.]*)\.([^\s]*)\s+(.*):(.*)$/);
      if (match) {
        wellParams[match[1].trim()] = {
          unit: match[2],
          value: match[3].trim(),
          description: match[4].trim()
        };
      }
    } else if (section === 'CURVE') {
      const match = trimmed.match(/^([^.]*)\.([^\s]*)\s+(.*):(.*)$/);
      if (match) {
        curves.push({
          mnemonic: match[1].trim(),
          unit: match[2],
          value: match[3].trim(),
          description: match[4].trim()
        });
      }
    } else if (section === 'DATA') {
      const values = trimmed.split(/\s+/).map(Number);
      if (values.length === curves.length) {
        const row = {};
        curves.forEach((curve, index) => {
          row[curve.mnemonic] = values[index];
        });
        data.push(row);
      }
    }
  });

  return { wellParams, curves, data };
};

// --- Auto Mapping ---
export const autoMapCurves = (curves) => {
  const map = {
    DEPTH: null,
    GR: null,
    CALI: null,
    RES_DEEP: null,
    RES_MED: null,
    RES_SHALLOW: null,
    NPHI: null,
    RHOB: null,
    DT: null,
    SP: null,
    DRHO: null,
    PEF: null
  };

  const mnemonics = curves.map(c => c.mnemonic.toUpperCase());

  const find = (patterns) => mnemonics.find(m => patterns.some(p => m === p || m.startsWith(p)));

  map.DEPTH = find(['DEPT', 'DEPTH', 'MD']);
  map.GR = find(['GR', 'GAMMA', 'CGR']);
  map.CALI = find(['CAL', 'CALI', 'CL']);
  map.RES_DEEP = find(['RT', 'RES_DEEP', 'RDEP', 'ILD', 'LLD', 'RD']);
  map.RES_MED = find(['RM', 'RES_MED', 'ILM', 'LLS', 'RMED']);
  map.RES_SHALLOW = find(['RXO', 'RES_SHALLOW', 'MSFL', 'SFL', 'RS']);
  map.NPHI = find(['NPHI', 'TNPH', 'NPOR']);
  map.RHOB = find(['RHOB', 'DEN', 'ZDEN']);
  map.DT = find(['DT', 'AC', 'DTCO']);
  map.SP = find(['SP']);
  map.DRHO = find(['DRHO', 'PE', 'PEF']);
  map.PEF = find(['PEF', 'PE', 'PEFZ']);

  Object.keys(map).forEach(k => {
      if (!map[k]) delete map[k];
  });

  return map;
};

// --- Deterministic Calculations ---

export const calculateVshale = (gr, grClean, grShale, method = 'linear') => {
    if (gr === null || isNaN(gr)) return null;
    const safeGr = Math.max(0, gr);
    const safeClean = Math.max(0, grClean);
    const safeShale = Math.max(safeClean + 1, grShale); 
    let ish = (safeGr - safeClean) / (safeShale - safeClean);
    ish = Math.max(0, Math.min(1, ish)); 

    switch (method) {
        case 'linear': return ish;
        case 'larionov-older': return 0.33 * (Math.pow(2, 2 * ish) - 1);
        case 'larionov-tertiary': return 0.083 * (Math.pow(2, 3.7 * ish) - 1);
        case 'steiber': return 0.5 * ish / (1.5 - ish);
        case 'clavier': return 1.7 - Math.sqrt(3.38 - Math.pow(ish + 0.7, 2));
        default: return ish;
    }
};

export const calculatePorosityDensity = (rhob, rhoMatrix, rhoFluid) => {
    if (rhob === null || isNaN(rhob) || rhob < 1.0) return null;
    const phi = (rhoMatrix - rhob) / (rhoMatrix - rhoFluid);
    return Math.max(0, Math.min(0.5, phi));
};

export const calculatePorositySonic = (dt, dtMatrix, dtFluid) => {
    if (dt === null || isNaN(dt)) return null;
    const phi = (dt - dtMatrix) / (dtFluid - dtMatrix);
    return Math.max(0, Math.min(0.5, phi));
};

export const calculatePorosityND = (phiD, phiN, method = 'rms') => {
    if (phiD === null || phiN === null) return null;
    let safePhiN = phiN;
    if (safePhiN > 1) safePhiN = safePhiN / 100; 
    if (method === 'rms') return Math.sqrt((Math.pow(phiD, 2) + Math.pow(safePhiN, 2)) / 2);
    else return (phiD + safePhiN) / 2;
};

// --- Saturation Models ---
const clampSw = (sw) => Math.max(0, Math.min(1, sw));

export const calculateSwArchie = (rt, phi, rw, a, m, n) => {
    if (!rt || !phi || !rw || phi <= 0 || rt <= 0) return 1;
    const f = a / Math.pow(phi, m);
    return clampSw(Math.pow((f * rw) / rt, 1 / n));
};

export const calculateSwSimandoux = (rt, phi, rw, vsh, rsh, a, m, n) => {
    if (!rt || !phi || !rw || !rsh || phi <= 0) return 1;
    const C = Math.pow(phi, m) / (a * rw);
    const D = vsh / rsh;
    const E = 1 / rt;
    const term = Math.sqrt(Math.pow(D, 2) + 4 * C * E);
    return clampSw((-D + term) / (2 * C));
};

export const calculateSwIndonesian = (rt, phi, rw, vsh, rsh, a, m, n) => {
    if (!rt || !phi || !rw || !rsh || phi <= 0) return 1;
    const termVsh = Math.pow(vsh, (1 - 0.5 * vsh)) / Math.sqrt(rsh);
    const termPhi = Math.pow(phi, m / 2) / Math.sqrt(a * rw);
    const termRt = 1 / Math.sqrt(rt);
    const sw = termRt / (termVsh + termPhi);
    if (n !== 2) return clampSw(Math.pow(sw, 2/n));
    return clampSw(sw);
};

export const calculateSwWaxmanSmits = (rt, phi, rw, tempC, qv, m, n) => {
    if (!rt || !phi || !rw || phi <= 0) return 1;
    const B = 4.6 * (1 - 0.6 * Math.exp(-0.77 / rw)); 
    const F = 1 / Math.pow(phi, m);
    const bTerm = rw * B * qv;
    const cTerm = -(F * rw / rt);
    const sw = (-bTerm + Math.sqrt(Math.pow(bTerm, 2) - 4 * 1 * cTerm)) / 2;
    return clampSw(sw);
};

// --- Permeability Models ---
export const calculatePermTimur = (phi, swi) => {
    if (!phi || !swi || swi <= 0) return 0.01;
    const p = phi * 100;
    const s = swi * 100;
    const k = 0.136 * (Math.pow(p, 4.4) / Math.pow(s, 2));
    return Math.max(0.01, Math.min(10000, k));
};

export const calculatePermCoates = (phi, swi) => {
    if (!phi || !swi || swi <= 0) return 0.01;
    if (swi >= 1) return 0.01;
    const term = 100 * Math.pow(phi, 2) * ((1 - swi) / swi);
    return Math.max(0.01, Math.min(10000, Math.pow(term, 2)));
};

export const calculatePermWyllieRose = (phi, swi, p=250, q=3, r=1) => {
    if (!phi || !swi || swi <= 0) return 0.01;
    const term = p * Math.pow(phi, q) / Math.pow(swi, r);
    return Math.max(0.01, Math.min(10000, Math.pow(term, 2))); 
};

// --- Lithology Classification ---
export const determineLithology = (rhob, nphi, pef, vsh) => {
    if (vsh > 0.5) return { code: 4, name: 'Shale' }; 
    
    if (rhob && nphi) {
        if (rhob < 2.68 && nphi < 0.15) return { code: 1, name: 'Sandstone' };
        if (rhob >= 2.68 && rhob < 2.8 && nphi < 0.15) return { code: 2, name: 'Limestone' };
        if (rhob >= 2.8) return { code: 3, name: 'Dolomite' };
    }
    
    return { code: 0, name: 'Unknown' };
};

// --- Fluid Type ---
export const determineFluid = (sw, phi, rhob, nphi, vsh) => {
    if (vsh > 0.6) return { code: 0, name: 'Water' }; 
    if (sw > 0.7) return { code: 0, name: 'Water' }; 
    
    if (rhob && nphi) {
        const phiD = (2.65 - rhob) / 1.65;
        if ((phiD - nphi) > 0.04) return { code: 2, name: 'Gas' };
    }
    
    return { code: 1, name: 'Oil' };
};

// --- Zonal Statistics & Volumetrics ---
export const calculateZonalStats = (data, curveMap, top, base, cutoffs, step = 0.5) => {
    const depthKey = curveMap['DEPTH'];
    const vshKey = curveMap['VSH'];
    const phiKey = curveMap['PHIE'];
    const swKey = curveMap['SW'];

    if (!depthKey || !phiKey || !swKey) return null; 

    const zoneData = data.filter(row => row[depthKey] >= top && row[depthKey] <= base);
    if (zoneData.length === 0) return null;

    let grossCount = zoneData.length;
    let netCount = 0;
    let payCount = 0;
    
    let sumPhi = 0;
    let sumSw = 0;
    let sumVsh = 0;

    zoneData.forEach(row => {
        const vsh = row[vshKey] || 0;
        const phi = row[phiKey] || 0;
        const sw = row[swKey] || 1;

        const isReservoir = vsh <= cutoffs.vshMax && phi >= cutoffs.phiMin;
        const isPay = isReservoir && sw <= cutoffs.swMax;

        if (isReservoir) netCount++;
        if (isPay) {
            payCount++;
            sumPhi += phi;
            sumSw += sw;
            sumVsh += vsh;
        }
    });

    const avgPhi = payCount > 0 ? sumPhi / payCount : 0;
    const avgSw = payCount > 0 ? sumSw / payCount : 0;
    const avgVsh = payCount > 0 ? sumVsh / payCount : 0;

    const grossThickness = grossCount * step;
    const netThickness = netCount * step;
    const payThickness = payCount * step;
    const ntg = grossThickness > 0 ? netThickness / grossThickness : 0;

    return {
        grossThickness,
        netThickness,
        payThickness,
        ntg,
        avgPhi,
        avgSw,
        avgVsh
    };
};

export const calculateVolumetrics = (stats, parameters) => {
    if (!stats || !parameters) return null;

    const { area, bo, bg, rf, fluidType } = parameters;
    const grv = area * stats.grossThickness; 
    const nrv = area * stats.netThickness; 
    const hcpv = area * stats.payThickness * stats.avgPhi * (1 - stats.avgSw); 

    let ooip = 0; 
    let ogip = 0; 
    let reserves = 0; 

    if (fluidType === 'oil') {
        ooip = (7758 * hcpv) / (bo || 1.2); 
        reserves = ooip * (rf || 0.3);
    } else if (fluidType === 'gas') {
        ogip = (43560 * hcpv) / (bg || 0.005);
        reserves = ogip * (rf || 0.7);
    }

    return { grv, nrv, hcpv, ooip, ogip, reserves, fluidType };
};

// --- Probabilistic Calculations ---

// Random Generators
const randomTriangular = (min, mode, max) => {
    const u = Math.random();
    const F = (mode - min) / (max - min);
    if (u <= F) return min + Math.sqrt(u * (max - min) * (mode - min));
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
};

const randomNormal = (mean, stdDev) => {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
};

const randomUniform = (min, max) => {
    return min + Math.random() * (max - min);
};

const sampleValue = (dist) => {
    switch (dist.type) {
        case 'triangular': return randomTriangular(dist.min, dist.mode, dist.max);
        case 'normal': return Math.max(0, randomNormal(dist.mean, dist.stdDev)); // Clamp to 0
        case 'uniform': return randomUniform(dist.min, dist.max);
        case 'constant': return dist.value;
        default: return dist.value || 0;
    }
};

// Monte Carlo Engine
export const runMonteCarloSimulation = (inputs, iterations = 1000) => {
    // inputs: { area: {type, ...}, thickness: {type, ...}, ntg: {type, ...}, phi: {type, ...}, sw: {type, ...}, fvf: {type, ...}, rf: {type, ...}, fluidType: 'oil'/'gas' }
    
    const results = [];
    const variableKeys = ['area', 'thickness', 'ntg', 'phi', 'sw', 'fvf', 'rf'];

    for (let i = 0; i < iterations; i++) {
        const iter = {};
        variableKeys.forEach(key => {
            iter[key] = sampleValue(inputs[key]);
        });
        
        // Calculation
        // Pay Thickness = Thickness * NTG
        // HCPV = Area * PayThickness * Phi * (1 - Sw)
        const payThickness = iter.thickness * iter.ntg;
        const hcpv = iter.area * payThickness * iter.phi * (1 - iter.sw);
        
        let inplace = 0;
        let recoverable = 0;

        if (inputs.fluidType === 'oil') {
            inplace = (7758 * hcpv) / (iter.fvf || 1.2);
        } else {
            inplace = (43560 * hcpv) / (iter.fvf || 0.005);
        }
        
        recoverable = inplace * iter.rf;

        results.push({ ...iter, inplace, recoverable });
    }

    // Calculate Stats
    results.sort((a, b) => a.recoverable - b.recoverable);
    const p10Index = Math.floor(iterations * 0.9); // Reverse for reserves (P90 is conservative/low, P10 is upside/high in some conventions, but usually P90 is 90% prob of exceeding => Low Value)
    
    const getP = (pct) => results[Math.floor(iterations * (pct / 100))];

    const p90 = getP(10);
    const p50 = getP(50);
    const p10 = getP(90);
    const mean = results.reduce((sum, r) => sum + r.recoverable, 0) / iterations;

    // Sensitivity (Simple Tornado approximation)
    const sensitivity = [];
    const baseInputs = {};
    variableKeys.forEach(key => {
        // Estimate base as P50 of distribution
        if (inputs[key].type === 'triangular') baseInputs[key] = inputs[key].mode; // Approx
        else if (inputs[key].type === 'normal') baseInputs[key] = inputs[key].mean;
        else if (inputs[key].type === 'uniform') baseInputs[key] = (inputs[key].min + inputs[key].max) / 2;
        else baseInputs[key] = inputs[key].value;
    });

    // Helper to calc single deterministic
    const calcDet = (p) => {
        const hcpv = p.area * (p.thickness * p.ntg) * p.phi * (1 - p.sw);
        const ip = inputs.fluidType === 'oil' ? (7758 * hcpv) / p.fvf : (43560 * hcpv) / p.fvf;
        return ip * p.rf;
    };

    const baseReserves = calcDet(baseInputs);

    variableKeys.forEach(key => {
        const dist = inputs[key];
        if (dist.type === 'constant') return;

        // Determine low/high values for this input
        let lowVal, highVal;
        if (dist.type === 'triangular') { lowVal = dist.min + 0.1*(dist.max-dist.min); highVal = dist.max - 0.1*(dist.max-dist.min); } // Rough approx
        else if (dist.type === 'normal') { lowVal = dist.mean - 1.28*dist.stdDev; highVal = dist.mean + 1.28*dist.stdDev; }
        else if (dist.type === 'uniform') { lowVal = dist.min + 0.1*(dist.max-dist.min); highVal = dist.max - 0.1*(dist.max-dist.min); }
        
        const lowParams = { ...baseInputs, [key]: lowVal };
        const highParams = { ...baseInputs, [key]: highVal };
        
        const lowRes = calcDet(lowParams);
        const highRes = calcDet(highParams);
        
        sensitivity.push({
            variable: key,
            swing: Math.abs(highRes - lowRes),
            low: Math.min(lowRes, highRes),
            high: Math.max(lowRes, highRes),
            base: baseReserves
        });
    });

    sensitivity.sort((a, b) => b.swing - a.swing);

    return {
        stats: { p90: p90.recoverable, p50: p50.recoverable, p10: p10.recoverable, mean },
        sensitivity,
        histogram: results.map(r => r.recoverable), // Full data for histogram binning on frontend
        rawData: results // optional, heavy
    };
};

// --- Build 10: Statistical & Regression Helpers ---

export const calculateLinearRegression = (xData, yData) => {
    if (!xData || !yData || xData.length !== yData.length || xData.length === 0) return null;

    const n = xData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        const x = xData[i];
        const y = yData[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
        sumY2 += y * y;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared
    const ssTotal = sumY2 - (sumY * sumY) / n;
    const ssRes = sumY2 - intercept * sumY - slope * sumXY;
    const rSquared = 1 - (ssRes / ssTotal);

    return { slope, intercept, rSquared };
};

export const calculatePowerLawRegression = (xData, yData) => {
    // y = a * x^b  => ln(y) = ln(a) + b * ln(x)
    // Linear regression on ln(y) vs ln(x)
    if (!xData || !yData || xData.length === 0) return null;
    
    const logX = [];
    const logY = [];
    
    for(let i=0; i<xData.length; i++) {
        if(xData[i] > 0 && yData[i] > 0) {
            logX.push(Math.log(xData[i]));
            logY.push(Math.log(yData[i]));
        }
    }
    
    if (logX.length < 2) return null;
    
    const lin = calculateLinearRegression(logX, logY);
    const a = Math.exp(lin.intercept);
    const b = lin.slope;
    
    return { a, b, rSquared: lin.rSquared };
};

export const calculateExponentialRegression = (xData, yData) => {
    // y = a * e^(b*x) => ln(y) = ln(a) + b * x
    // Linear regression on ln(y) vs x
    if (!xData || !yData || xData.length === 0) return null;
    
    const X = [];
    const logY = [];
    
    for(let i=0; i<xData.length; i++) {
        if(yData[i] > 0) {
            X.push(xData[i]);
            logY.push(Math.log(yData[i]));
        }
    }
    
    if (X.length < 2) return null;
    
    const lin = calculateLinearRegression(X, logY);
    const a = Math.exp(lin.intercept);
    const b = lin.slope;
    
    return { a, b, rSquared: lin.rSquared };
};