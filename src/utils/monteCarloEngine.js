/**
 * Optimized Monte Carlo Simulation Engine
 * Designed for high-performance client-side simulation.
 */

/**
 * Distribution Functions for Monte Carlo Simulation
 */

function normalDistribution(mean = 0, stdDev = 1) {
  let u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + stdDev * z0;
}

function uniformDistribution(min = 0, max = 1) {
  return min + Math.random() * (max - min);
}

function lognormalDistribution(mean = 0, stdDev = 1) {
  return Math.exp(normalDistribution(mean, stdDev));
}

function triangularDistribution(min, mode, max) {
  const u = Math.random();
  const fc = (mode - min) / (max - min);
  
  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

function betaDistribution(alpha = 1, beta = 1) {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.pow(u1, 1 / alpha) / (Math.pow(u1, 1 / alpha) + Math.pow(u2, 1 / beta));
}

function exponentialDistribution(lambda = 1) {
  return -Math.log(Math.random()) / lambda;
}

function weibullDistribution(shape = 1, scale = 1) {
  return scale * Math.pow(-Math.log(Math.random()), 1 / shape);
}

// Aliases for compatibility with existing internal logic
const generateNormal = normalDistribution;
const generateLognormal = lognormalDistribution;
const generateTriangular = triangularDistribution;
const generateUniform = uniformDistribution;

// Cache for preventing repetitive object creation
const CACHE_SIZE = 100;
const resultsCache = new Map();

/**
 * Runs a Monte Carlo simulation for a single variable.
 * @param {Object} config - Simulation configuration
 * @param {string} config.distribution - Distribution type ('normal', 'lognormal', 'triangular', 'uniform')
 * @param {Object} config.params - Distribution parameters
 * @param {number} iterations - Number of iterations (default 1000)
 * @returns {Object} - Statistics { p10, p50, p90, mean, min, max, samples }
 */
export const runSimulation = (config, iterations = 1000) => {
  const { distribution, params } = config;
  const samples = new Float64Array(iterations); // TypedArray for performance

  // Generate samples
  for (let i = 0; i < iterations; i++) {
    let val = 0;
    switch (distribution) {
      case 'normal':
        val = generateNormal(params.mean, params.stdDev);
        break;
      case 'lognormal':
        val = generateLognormal(params.mean, params.stdDev);
        break;
      case 'triangular':
        val = generateTriangular(params.min, params.mode, params.max);
        break;
      case 'uniform':
        val = generateUniform(params.min, params.max);
        break;
      default:
        val = params.mean || 0;
    }
    samples[i] = val;
  }

  // Sort for percentiles (Optimized sort)
  samples.sort();

  // Calculate stats
  const p10 = samples[Math.floor(iterations * 0.1)];
  const p50 = samples[Math.floor(iterations * 0.5)];
  const p90 = samples[Math.floor(iterations * 0.9)];
  
  let sum = 0;
  for(let i = 0; i < iterations; i++) sum += samples[i];
  const mean = sum / iterations;

  return {
    p10,
    p50,
    p90,
    mean,
    min: samples[0],
    max: samples[iterations - 1],
    samples: Array.from(samples)
  };
};

/**
 * Runs a multi-variable Monte Carlo simulation using a formula.
 * @param {string} formula - The formula string (e.g., "a * b + c")
 * @param {Object} variables - Map of variable names to distribution configs
 * @param {number} iterations - Number of iterations
 */
export const runMultiVariableSimulation = (formula, variables, iterations = 1000) => {
  const results = new Float64Array(iterations);
  const varNames = Object.keys(variables);
  const varSamples = {};

  // Pre-generate all variable samples
  varNames.forEach(name => {
    varSamples[name] = runSimulation(variables[name], iterations).samples;
  });

  // Create a function from the formula for fast execution
  const compute = new Function(...varNames, `return ${formula};`);

  for (let i = 0; i < iterations; i++) {
    const args = varNames.map(name => varSamples[name][i]);
    results[i] = compute(...args);
  }

  results.sort();

  return {
    p10: results[Math.floor(iterations * 0.1)],
    p50: results[Math.floor(iterations * 0.5)],
    p90: results[Math.floor(iterations * 0.9)],
    mean: results.reduce((a, b) => a + b, 0) / iterations,
    samples: Array.from(results)
  };
};

/**
 * Domain-specific Monte Carlo Simulation for PPFG (Phase 4)
 * Restored to resolve build errors in usePhase4State.js
 * 
 * @param {Array} depths - Array of depth values
 * @param {Object} inputData - Object containing log arrays (obg, porePressure, etc.)
 * @param {Object} baseParams - Model parameters
 * @param {Object} uncertaintyConfig - Uncertainty settings (logNoise, modelVariance)
 * @param {number} iterations - Number of iterations
 * @param {Function} onProgress - Callback for progress updates
 */
export const runMonteCarloSimulation = (depths, inputData, baseParams, uncertaintyConfig, iterations = 1000, onProgress) => {
  const count = depths.length;
  const results = {
    pp: new Array(iterations),
    fg: new Array(iterations),
    obg: new Array(iterations)
  };

  // Use Float32Array for memory efficiency during calculation
  for (let i = 0; i < iterations; i++) {
    if (onProgress && i % 50 === 0) onProgress(i / iterations);

    const iterPP = new Float32Array(count);
    const iterFG = new Float32Array(count);
    const iterOBG = new Float32Array(count);

    // Generate iteration-specific perturbation factors
    const obgShift = generateNormal(0, uncertaintyConfig.modelVariance || 0.05);
    const ppShift = generateNormal(0, uncertaintyConfig.modelVariance || 0.05);
    const fgShift = generateNormal(0, uncertaintyConfig.modelVariance || 0.05);
    const noiseLevel = uncertaintyConfig.logNoise || 0.02;

    for (let d = 0; d < count; d++) {
      // 1. OBG Calculation with perturbation
      // Default to 2.3 SG (approx lithostatic) if missing
      let obgVal = (inputData.obg && inputData.obg[d]) ? inputData.obg[d] : 2.3;
      obgVal = obgVal * (1 + obgShift + generateNormal(0, noiseLevel));
      iterOBG[d] = obgVal;

      // 2. PP Calculation with perturbation
      // Default to 1.03 SG (hydrostatic) if missing
      let ppVal = (inputData.porePressure && inputData.porePressure[d]) ? inputData.porePressure[d] : 1.03;
      
      // If deterministic PP is missing, simulate a basic trend for robustness
      if (!inputData.porePressure && depths[d] > 3000) {
          ppVal += (depths[d] - 3000) * 0.0001; 
      }
      
      ppVal = ppVal * (1 + ppShift + generateNormal(0, noiseLevel));
      
      // Physical constraints
      if (ppVal > obgVal) ppVal = obgVal - 0.01;
      if (ppVal < 1.03) ppVal = 1.03;
      iterPP[d] = ppVal;

      // 3. FG Calculation (Simplified Eaton/Matthews-Kelly)
      // FG = k * (OBG - PP) + PP
      // k is effective stress ratio, typically 0.7-0.9, perturbed here
      const k = 0.8 + generateNormal(0, 0.05); 
      let fgVal = k * (obgVal - ppVal) + ppVal;
      
      fgVal = fgVal * (1 + fgShift + generateNormal(0, noiseLevel));
      iterFG[d] = fgVal;
    }

    results.pp[i] = iterPP;
    results.fg[i] = iterFG;
    results.obg[i] = iterOBG;
  }

  if (onProgress) onProgress(1);
  return results;
};