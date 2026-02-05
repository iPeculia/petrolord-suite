export const validateInputs = (formData) => {
  const required = [
    'fieldName', 'reservoirArea', 'avgNetPayThickness', 'porosity', 
    'initialWaterSaturation', 'reservoirTemperature', 'reservoirPressure',
    'recoveryFactor', 'oilGravity', 'gasGravity', 'initialSolutionGOR',
    'wellCost', 'operatingExpense', 'minEconomicFlowRate', 'typicalWellDeclineRate',
    'oilPrice', 'gasPrice', 'discountRate', 'projectDuration', 'royaltiesTaxes',
    'minSpacing', 'maxSpacing', 'spacingIncrement'
  ];
  
  for (let field of required) {
    if (!formData[field] || (typeof formData[field] === 'string' && parseFloat(formData[field]) <= 0)) {
      return false;
    }
  }
  return true;
};

export const calculateOptimalSpacing = async (formData) => {
  const spacingResults = [];
  const minSpacing = parseFloat(formData.minSpacing);
  const maxSpacing = parseFloat(formData.maxSpacing);
  const increment = parseFloat(formData.spacingIncrement);
  
  const reservoirArea = parseFloat(formData.reservoirArea);
  const avgNetPay = parseFloat(formData.avgNetPayThickness);
  const porosity = parseFloat(formData.porosity) / 100;
  const swi = parseFloat(formData.initialWaterSaturation);
  const recoveryFactor = parseFloat(formData.recoveryFactor) / 100;
  const wellCost = parseFloat(formData.wellCost);
  const opex = parseFloat(formData.operatingExpense);
  const oilPrice = parseFloat(formData.oilPrice);
  const gasPrice = parseFloat(formData.gasPrice);
  const discountRate = parseFloat(formData.discountRate) / 100;
  const projectDuration = parseFloat(formData.projectDuration);
  const royaltiesTaxes = parseFloat(formData.royaltiesTaxes) / 100;
  const declineRate = parseFloat(formData.typicalWellDeclineRate) / 100;
  const minEconomicRate = parseFloat(formData.minEconomicFlowRate);
  const gor = parseFloat(formData.initialSolutionGOR);
  
  for (let spacing = minSpacing; spacing <= maxSpacing; spacing += increment) {
    const numberOfWells = Math.floor(reservoirArea / spacing);
    const drainageAreaPerWell = spacing;
    
    const oiipPerWell = drainageAreaPerWell * avgNetPay * porosity * (1 - swi) * 7758;
    const eurPerWell = oiipPerWell * recoveryFactor / 1000;
    
    const totalFieldRecovery = (numberOfWells * eurPerWell * 1000) / (reservoirArea * avgNetPay * porosity * (1 - swi) * 7758) * 100;
    
    const totalCapex = numberOfWells * wellCost / 1000000;
    
    const initialRate = eurPerWell * 1000 * 0.15;
    const economicLife = Math.log(minEconomicRate / initialRate) / Math.log(1 - declineRate);
    const actualLife = Math.min(economicLife, projectDuration);
    
    let totalRevenue = 0;
    let totalOpex = 0;
    let npv = 0;
    
    for (let year = 1; year <= actualLife; year++) {
      const yearlyRate = initialRate * Math.pow(1 - declineRate, year - 1);
      const yearlyOilProduction = yearlyRate * 365;
      const yearlyGasProduction = yearlyOilProduction * gor / 1000;
      
      const yearlyOilRevenue = yearlyOilProduction * oilPrice;
      const yearlyGasRevenue = yearlyGasProduction * gasPrice;
      const yearlyTotalRevenue = yearlyOilRevenue + yearlyGasRevenue;
      const yearlyNetRevenue = yearlyTotalRevenue * (1 - royaltiesTaxes);
      
      const yearlyOpexCost = opex;
      const yearlyNetCashFlow = yearlyNetRevenue - yearlyOpexCost;
      
      const discountFactor = Math.pow(1 + discountRate, -year);
      npv += yearlyNetCashFlow * discountFactor;
      
      totalRevenue += yearlyNetRevenue;
      totalOpex += yearlyOpexCost;
    }
    
    const wellNPV = npv - wellCost;
    const totalNPV = numberOfWells * wellNPV / 1000000;
    
    const totalProduction = numberOfWells * eurPerWell * 1000;
    const costPerBarrel = (totalCapex * 1000000 + numberOfWells * totalOpex * actualLife) / totalProduction;
    
    spacingResults.push({
      spacing: spacing,
      numberOfWells: numberOfWells,
      eurPerWell: eurPerWell,
      totalFieldRecovery: totalFieldRecovery,
      totalCapex: totalCapex,
      npv: totalNPV,
      costPerBarrel: costPerBarrel,
      economicLife: actualLife
    });
  }
  
  const optimalResult = spacingResults.reduce((max, current) => 
    current.npv > max.npv ? current : max
  );
  
  const justification = generateJustification(optimalResult, spacingResults, formData);
  
  return {
    spacingResults: spacingResults,
    optimalSpacing: {
      ...optimalResult,
      totalWells: optimalResult.numberOfWells,
      justification: justification
    }
  };
};

const generateJustification = (optimal, allResults, formData) => {
  const recoveryRank = allResults.sort((a, b) => b.totalFieldRecovery - a.totalFieldRecovery)
    .findIndex(r => r.spacing === optimal.spacing) + 1;
  
  const costRank = allResults.sort((a, b) => a.costPerBarrel - b.costPerBarrel)
    .findIndex(r => r.spacing === optimal.spacing) + 1;
  
  let justification = `This spacing maximizes NPV at $${optimal.npv.toFixed(1)}M with ${optimal.numberOfWells} wells. `;
  
  if (recoveryRank <= 3) {
    justification += `It also ranks #${recoveryRank} in field recovery (${optimal.totalFieldRecovery.toFixed(1)}%). `;
  }
  
  if (costRank <= 3) {
    justification += `Cost efficiency is excellent at $${optimal.costPerBarrel.toFixed(2)}/bbl. `;
  }
  
  if (optimal.spacing < 40) {
    justification += "Tight spacing maximizes reservoir contact and recovery.";
  } else if (optimal.spacing > 80) {
    justification += "Wider spacing optimizes capital efficiency while maintaining economic returns.";
  } else {
    justification += "Balanced spacing provides optimal trade-off between recovery and economics.";
  }
  
  return justification;
};

export const generateCSV = (results) => {
  const csvContent = [
    ['Well Spacing (acres/well)', 'Number of Wells', 'EUR per Well (Mbbl)', 'Total Field Recovery (%)', 'Total Capex ($M)', 'NPV ($M)', 'Cost per Barrel ($/bbl)', 'Economic Life (years)'],
    ...results.spacingResults.map(result => [
      result.spacing,
      result.numberOfWells,
      result.eurPerWell.toFixed(1),
      result.totalFieldRecovery.toFixed(1),
      result.totalCapex.toFixed(1),
      result.npv.toFixed(1),
      result.costPerBarrel.toFixed(2),
      result.economicLife.toFixed(1)
    ])
  ].map(row => row.join(',')).join('\n');

  return csvContent;
};

export const generateJSON = (formData, results) => {
  return {
    inputParameters: formData,
    optimizationResults: results.spacingResults,
    optimalSpacing: results.optimalSpacing,
    timestamp: new Date().toISOString(),
    metadata: {
      totalScenariosAnalyzed: results.spacingResults.length,
      optimalNPV: results.optimalSpacing.npv,
      optimalSpacing: results.optimalSpacing.spacing,
      optimalWellCount: results.optimalSpacing.numberOfWells,
      version: 'WellSpacingOptimizer v1.0'
    }
  };
};