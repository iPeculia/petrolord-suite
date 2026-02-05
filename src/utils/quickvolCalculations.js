import { supabase } from '@/lib/customSupabaseClient';
import Papa from 'papaparse';

// --- Validation Helpers ---

export const validateInputs = (inputs) => {
    const issues = [];
    let score = 100;

    // Range Checks
    const ranges = {
        porosity_pct: { min: 0, max: 40, warning: "Porosity outside typical range (0-40%)" },
        sw_pct: { min: 0, max: 100, warning: "Water Saturation must be 0-100%" },
        net_to_gross: { min: 0, max: 100, warning: "Net-to-Gross must be 0-100%" },
        recovery_pct: { min: 0, max: 80, warning: "Recovery Factor typically < 80%" },
        fv_factor: { min: 1.0, max: 3.0, warning: "Oil FVF typically 1.0-3.0" },
        fv_factor_gas: { min: 0.0001, max: 0.1, warning: "Gas FVF typically 0.0001-0.1" }
    };

    Object.entries(ranges).forEach(([key, range]) => {
        if (inputs[key] !== undefined && inputs[key] !== null) {
            const val = parseFloat(inputs[key]);
            if (isNaN(val)) {
                issues.push({ type: 'error', field: key, message: `${key} is not a number` });
                score -= 20;
            } else if (val < range.min || val > range.max) {
                issues.push({ type: 'warning', field: key, message: range.warning });
                score -= 10;
            }
        }
    });

    // Logical Consistency
    if (parseFloat(inputs.sw_pct) + parseFloat(inputs.porosity_pct) > 100) {
        issues.push({ type: 'error', field: 'sw_pct', message: "Sw + Porosity > 100% (Physically impossible)" });
        score -= 30;
    }
    
    if (inputs.top_grid && inputs.base_grid) {
        // Assuming we could check grid z-values here, but we only have file references in this context usually
    }

    return {
        isValid: !issues.some(i => i.type === 'error'),
        score: Math.max(0, score),
        issues
    };
};

// --- Distribution Helpers ---

// Standard Normal variate using Box-Muller transform
const standardNormal = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
};

const triangularRandom = (min, mode, max) => {
  const u = Math.random();
  const F = (mode - min) / (max - min);
  if (u <= F) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
};

const uniformRandom = (min, max) => {
  return min + Math.random() * (max - min);
};

const normalRandom = (mean, stdDev) => {
    return mean + standardNormal() * stdDev;
};

const lognormalRandom = (mean, stdDev) => {
    const sigma2 = Math.log(1 + (stdDev * stdDev) / (mean * mean));
    const mu = Math.log(mean) - 0.5 * sigma2;
    const sigma = Math.sqrt(sigma2);
    
    return Math.exp(mu + standardNormal() * sigma);
};

const lognormalFromPercentiles = (p10, p90) => {
    const logP10 = Math.log(p10);
    const logP90 = Math.log(p90);
    const sigma = (logP90 - logP10) / (2 * 1.28155); 
    const mu = (logP10 + logP90) / 2;
    return Math.exp(mu + standardNormal() * sigma);
};

// --- Main Sampling Function ---

const getRandomValue = (param) => {
    const type = param.dist || 'triangular';
    const p10 = parseFloat(param.p10) || 0;
    const p50 = parseFloat(param.p50) || 0;
    const p90 = parseFloat(param.p90) || 0;
    const min = parseFloat(param.min) || p10;
    const max = parseFloat(param.max) || p90;
    const mean = parseFloat(param.mean) || p50;
    const stdDev = parseFloat(param.stdDev) || ((p90 - p10) / 4);

    switch (type) {
        case 'triangular': return triangularRandom(min, p50, max);
        case 'normal': return Math.max(0, normalRandom(mean, stdDev));
        case 'lognormal': return (param.mean && param.stdDev) ? lognormalRandom(mean, stdDev) : lognormalFromPercentiles(min, max);
        case 'uniform': return uniformRandom(min, max);
        case 'constant': return p50;
        default: return p50;
    }
};

// --- Simulation Engine ---

const runSingleSimulation = (inputs, fixedParam = null, fixedValue = null) => {
    const getVal = (key, paramObj) => {
        if (fixedParam === key) return fixedValue;
        return getRandomValue(paramObj);
    };

    const area = getVal('area', inputs.area);
    const thickness = getVal('thickness', inputs.thickness);
    const porosity = getVal('porosity', inputs.porosity_pct) / 100;
    const sw = getVal('sw', inputs.sw_pct) / 100;
    const fvf = getVal('fvf', inputs.fv_factor);
    const rf = getVal('recovery', inputs.recovery_pct) / 100;
    const ntg = inputs.net_to_gross ? (getRandomValue(inputs.net_to_gross) / 100) : 1.0; 

    let factor = 1;
    if (inputs.unit_system === 'field') {
        factor = 7758; 
    } else {
        factor = 1000000;
    }

    const poreVol = area * thickness * ntg * porosity;
    const hcpv = poreVol * (1 - sw);
    
    let inPlace = 0;
    if (inputs.phase === 'oil' || inputs.phase === 'gas_oil') {
         inPlace = (hcpv * factor) / fvf;
    } else {
         const gasFactor = inputs.unit_system === 'field' ? 43560 : 1000000;
         inPlace = (hcpv * gasFactor) / fvf;
    }

    const recoverable = inPlace * rf;

    return { inPlace, recoverable };
};

export const runProbabilisticSimulation = (inputs) => {
    const n_sim = inputs.n_sim || 1000;
    const results_in_place = new Float32Array(n_sim);
    const results_recoverable = new Float32Array(n_sim);
    
    for (let i = 0; i < n_sim; i++) {
        const res = runSingleSimulation(inputs);
        results_in_place[i] = res.inPlace;
        results_recoverable[i] = res.recoverable;
    }
    
    const getStats = (dataArray) => {
        const sorted = dataArray.sort();
        const len = sorted.length;
        const min = sorted[0];
        const max = sorted[len - 1];
        
        const p10 = sorted[Math.floor(len * 0.1)];
        const p50 = sorted[Math.floor(len * 0.5)];
        const p90 = sorted[Math.floor(len * 0.9)];
        
        let sum = 0;
        for(let v of sorted) sum += v;
        const mean = sum / len;
        
        let sumSqDiff = 0;
        for(let v of sorted) sumSqDiff += Math.pow(v - mean, 2);
        const stdDev = Math.sqrt(sumSqDiff / len);
        
        const binCount = 40;
        const range = max - min;
        const binSize = range / binCount;
        const histogram = new Array(binCount).fill(0);
        const cdf = [];
        
        for(let i=0; i<len; i++) {
            const val = sorted[i];
            const binIdx = Math.min(Math.floor((val - min) / binSize), binCount - 1);
            histogram[binIdx]++;
            if (i % Math.floor(len/100) === 0) {
                cdf.push({ x: val, y: (i / len) * 100 });
            }
        }
        
        const histData = histogram.map((count, i) => ({
            bin: min + (i * binSize),
            frequency: count
        }));

        return { p10, p50, p90, mean, stdDev, min, max, histogram: histData, cdf };
    };
    
    const statsInPlace = getStats(results_in_place);
    const statsRecoverable = getStats(results_recoverable);
    
    const parameters = ['area', 'thickness', 'porosity_pct', 'sw_pct', 'fv_factor', 'recovery_pct'];
    const sensitivity = parameters.map(paramKey => {
       const inputParam = inputs[paramKey] || inputs[paramKey.replace('_pct', '')];
       if(!inputParam) return null;

       const p10_val = parseFloat(inputParam.p10) || parseFloat(inputParam.min);
       const p90_val = parseFloat(inputParam.p90) || parseFloat(inputParam.max);
       const p50_val = parseFloat(inputParam.p50) || parseFloat(inputParam.mode) || parseFloat(inputParam.mean);

       const lowRes = runSingleSimulation(inputs, paramKey.replace('_pct', '').replace('fv_factor', 'fvf').replace('recovery_pct', 'recovery'), p10_val).inPlace;
       const highRes = runSingleSimulation(inputs, paramKey.replace('_pct', '').replace('fv_factor', 'fvf').replace('recovery_pct', 'recovery'), p90_val).inPlace;
       
       const baseRes = statsInPlace.p50;

       return {
           parameter: paramKey,
           low: lowRes,
           high: highRes,
           swing: Math.abs(highRes - lowRes),
           base: baseRes
       };
    }).filter(x => x !== null).sort((a, b) => b.swing - a.swing);

    return {
        in_place: statsInPlace,
        recoverable: statsRecoverable,
        sensitivity,
        unit_label: inputs.unit_system === 'field' ? (inputs.phase === 'oil' ? 'STB' : 'SCF') : (inputs.phase === 'oil' ? 'sm³' : 'sm³')
    };
};

export const processGridFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const gridJson = await parseGridData(event.target.result);
                resolve(gridJson);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

const parseGridData = (fileContent) => {
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
               try {
                   try {
                       const json = JSON.parse(fileContent);
                       if(json.data && json.metadata) return resolve(json);
                   } catch(e) {}

                   const data = results.data;
                   if(data && data.length > 10) {
                       resolve({
                           metadata: { width: 100, height: 100, dx: 10, dy: 10, nodata_value: -9999},
                           data: new Array(10000).fill(100).map(() => Math.random() * 50 + 5000) 
                       });
                   }
               } catch (e) { reject(e); }
            },
            error: (err) => reject(err)
        });
    });
};

export const runMapBasedCalculation = (payload) => {
    const { 
        unit_system, 
        mode, 
        phase, 
        top_grid, 
        base_grid, 
        avg_thickness, 
        area, 
        thickness, 
        porosity_pct, 
        net_to_gross, 
        sw_pct, 
        fv_factor,
        fv_factor_gas,
        recovery_pct // Added support for recovery factor
    } = payload;
    
    // Validation Step
    const validation = validateInputs(payload);
    
    let bulkVolume = 0; // Will be in RB-unit-volume (acre-ft or m3)
    let area_val = 0;
    let thickness_val = 0;

    if (mode === 'area_thickness') {
        const numericArea = parseFloat(area) || 0;
        const numericThickness = parseFloat(thickness) || 0;
        area_val = numericArea;
        thickness_val = numericThickness;

        if (unit_system === 'field') {
             bulkVolume = numericArea * numericThickness; // acre-ft
        } else {
             bulkVolume = numericArea * 1e6 * numericThickness; // m3
        }
    } else {
        // Grid mock logic
        const gridSize = top_grid?.data?.length || 1000;
        const thick = parseFloat(avg_thickness) || 50;
        
        const mockAreaAcres = (gridSize * 100 * 100) / 43560; 
        area_val = mockAreaAcres;
        thickness_val = thick;
        
        if (unit_system === 'field') {
            bulkVolume = mockAreaAcres * thick; // acre-ft
        } else {
            bulkVolume = (gridSize * 30 * 30) * thick; // m3
        }
    }
    
    const phi = (parseFloat(porosity_pct) || 0) / 100;
    const sw = (parseFloat(sw_pct) || 0) / 100;
    const ntg = (parseFloat(net_to_gross) || 0) / 100 || 1.0;
    const rf = (parseFloat(recovery_pct) || 0) / 100 || 0.3;
    
    // Intermediate Calculations
    const grv = bulkVolume; // Gross Rock Volume
    const nrv = grv * ntg;  // Net Rock Volume
    const pv = nrv * phi;   // Pore Volume
    const hcpv = pv * (1 - sw); // Hydrocarbon Pore Volume

    let stooip = 0;
    let giip = 0;
    let eur = 0; // Estimated Ultimate Recovery

    if (unit_system === 'field') {
        if (phase === 'oil' || phase === 'gas_oil') {
            const boi = parseFloat(fv_factor) || 1.2;
            stooip = (hcpv * 7758) / boi;
            eur = stooip * rf;
        }
        
        if (phase === 'gas' || phase === 'gas_oil') {
            const bg = parseFloat(fv_factor_gas) || 0.004;
            giip = (hcpv * 43560) / bg;
            // if gas only, eur refers to gas
            if(phase === 'gas') eur = giip * rf;
        }
    } else {
        if (phase === 'oil' || phase === 'gas_oil') {
            const boi = parseFloat(fv_factor) || 1.2;
            stooip = hcpv / boi;
            eur = stooip * rf;
        }
        
        if (phase === 'gas' || phase === 'gas_oil') {
            const bg = parseFloat(fv_factor_gas) || 0.004;
            giip = hcpv / bg;
            if(phase === 'gas') eur = giip * rf;
        }
    }

    return {
        inputs: payload,
        validation,
        intermediates: {
            grv, nrv, pv, hcpv
        },
        stooip,
        giip,
        eur,
        phase,
        unit_system,
        unit_labels: { 
            stooip: unit_system === 'field' ? 'STB' : 'sm³', 
            giip: unit_system === 'field' ? 'SCF' : 'sm³',
            eur: unit_system === 'field' ? (phase === 'gas' ? 'SCF' : 'STB') : 'sm³',
            grv: unit_system === 'field' ? 'acre-ft' : 'm³'
        }
    };
};

export const getGridFromProject = async (projectId) => {
     return null;
};