const triangularRandom = (p10, p50, p90) => {
  const F_p50 = (p90 - p10) > 0 ? (p50 - p10) / (p90 - p10) : 0.5;
  const rand = Math.random();

  if (rand < F_p50) {
    return p10 + Math.sqrt(rand * (p90 - p10) * (p50 - p10));
  }
  return p90 - Math.sqrt((1 - rand) * (p90 - p10) * (p90 - p50));
};

const calculateSingleNPV = (params, settings) => {
  const { discountRate, taxRate, royaltyRate, projectLife } = settings;
  const dr = discountRate / 100;
  const tr = taxRate / 100;
  const rr = royaltyRate / 100;

  const reserves = params['Oil Reserves (MMSTB)'] * 1e6;
  const price = params['Initial Oil Price ($/STB)'];
  const capex = params['CAPEX ($MM)'] * 1e6;
  const opexPerBoe = params['OPEX ($/boe)'];
  const declineRate = params['Decline Rate (%/yr)'] / 100;

  let npv = -capex;
  let remainingReserves = reserves;
  
  const initialProduction = reserves * (declineRate / (1 - Math.pow(1 - declineRate, projectLife)));

  for (let year = 1; year <= projectLife; year++) {
    const production = initialProduction * Math.pow(1 - declineRate, year - 1);
    if (remainingReserves - production < 0) {
        // production = remainingReserves; // This logic can be improved
    }
    remainingReserves -= production;

    const revenue = production * price;
    const royalty = revenue * rr;
    const opex = production * opexPerBoe;
    
    const profitBeforeTax = revenue - royalty - opex;
    const tax = profitBeforeTax > 0 ? profitBeforeTax * tr : 0;
    const cashFlow = profitBeforeTax - tax;
    
    npv += cashFlow / Math.pow(1 + dr, year);
  }

  return npv / 1e6; // Return in $MM
};

const runSensitivityAnalysis = (baseParams, variables, settings) => {
    const baseNpv = calculateSingleNPV(baseParams, settings);
    const sensitivityData = [];

    variables.forEach(variable => {
        const lowParams = { ...baseParams, [variable.name]: variable.p10 };
        const highParams = { ...baseParams, [variable.name]: variable.p90 };

        const lowNpv = calculateSingleNPV(lowParams, settings);
        const highNpv = calculateSingleNPV(highParams, settings);
        
        const swing = Math.abs(highNpv - lowNpv);
        sensitivityData.push({
            variable: variable.name.replace(/\s\(.*\)/, ''), // Clean up name for display
            swing: swing,
        });
    });

    return sensitivityData.sort((a, b) => b.swing - a.swing);
};


export const runMonteCarloSimulation = async (inputs) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { variables, simulationSettings, economicSettings } = inputs;
  const iterations = simulationSettings.iterations;
  const npvResults = [];

  for (let i = 0; i < iterations; i++) {
    const iterationParams = {};
    variables.forEach(v => {
      iterationParams[v.name] = triangularRandom(v.p10, v.p50, v.p90);
    });
    
    const npv = calculateSingleNPV(iterationParams, economicSettings);
    npvResults.push(npv);
  }

  npvResults.sort((a, b) => a - b);

  const p10Index = Math.floor(iterations * 0.1);
  const p50Index = Math.floor(iterations * 0.5);
  const p90Index = Math.floor(iterations * 0.9);

  const summary = {
    p90: npvResults[p10Index],
    p50: npvResults[p50Index],
    p10: npvResults[p90Index],
    chanceOfSuccess: (npvResults.filter(n => n > 0).length / iterations) * 100,
  };

  const cdfData = npvResults.map((npv, index) => ({
    npv,
    prob: ((index + 1) / iterations) * 100,
  }));

  const minNpv = Math.min(...npvResults);
  const maxNpv = Math.max(...npvResults);
  const binCount = 20;
  const binSize = (maxNpv - minNpv) / binCount;
  const histogramData = [];
  for (let i = 0; i < binCount; i++) {
    const binStart = minNpv + i * binSize;
    const binEnd = binStart + binSize;
    histogramData.push({
      binStart: binStart.toFixed(0),
      binEnd: binEnd.toFixed(0),
      count: npvResults.filter(n => n >= binStart && n < binEnd).length,
    });
  }

  const baseParams = {};
  variables.forEach(v => { baseParams[v.name] = v.p50; });
  const tornadoData = runSensitivityAnalysis(baseParams, variables, economicSettings);

  return {
    summary,
    cdfData,
    histogramData,
    tornadoData,
  };
};