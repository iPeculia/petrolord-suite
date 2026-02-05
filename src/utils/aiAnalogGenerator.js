import { calculateDistance } from './analogfinderCalculations';

export const generateAIAnalogs = async (searchCriteria, existingCount = 0) => {
  const targetCount = Math.max(8, 12 - existingCount);
  
  const aiAnalogs = [];
  
  const fieldTemplates = [
    { name: 'Thunder Horse', country: 'USA', region: 'Gulf of Mexico', lat: 28.2, lng: -88.5 },
    { name: 'Kashagan', country: 'Kazakhstan', region: 'Caspian Sea', lat: 46.3, lng: 51.8 },
    { name: 'Prudhoe Bay', country: 'USA', region: 'Alaska', lat: 70.3, lng: -148.7 },
    { name: 'Cantarell', country: 'Mexico', region: 'Gulf of Mexico', lat: 19.3, lng: -92.3 },
    { name: 'Burgan', country: 'Kuwait', region: 'Middle East', lat: 29.1, lng: 48.1 },
    { name: 'Safaniya', country: 'Saudi Arabia', region: 'Persian Gulf', lat: 27.7, lng: 48.7 },
    { name: 'Zakum', country: 'UAE', region: 'Persian Gulf', lat: 24.9, lng: 53.0 },
    { name: 'Daqing', country: 'China', region: 'Songliao Basin', lat: 46.6, lng: 125.0 },
    { name: 'Samotlor', country: 'Russia', region: 'West Siberia', lat: 60.8, lng: 76.7 },
    { name: 'Kirkuk', country: 'Iraq', region: 'Kurdistan', lat: 35.5, lng: 44.4 },
    { name: 'Hassi Messaoud', country: 'Algeria', region: 'Sahara', lat: 31.7, lng: 6.1 },
    { name: 'Tengiz', country: 'Kazakhstan', region: 'Caspian Basin', lat: 45.3, lng: 54.8 },
    { name: 'Hibernia', country: 'Canada', region: 'Grand Banks', lat: 46.8, lng: -48.8 },
    { name: 'Buzzard', country: 'UK', region: 'North Sea', lat: 57.2, lng: 1.8 },
    { name: 'Johan Sverdrup', country: 'Norway', region: 'North Sea', lat: 56.1, lng: 2.9 },
    { name: 'Lula', country: 'Brazil', region: 'Santos Basin', lat: -25.5, lng: -43.2 },
    { name: 'Jubarte', country: 'Brazil', region: 'Campos Basin', lat: -21.8, lng: -39.9 },
    { name: 'Azeri', country: 'Azerbaijan', region: 'Caspian Sea', lat: 40.5, lng: 50.8 },
    { name: 'Statfjord', country: 'Norway', region: 'North Sea', lat: 61.2, lng: 1.8 },
    { name: 'Ekofisk', country: 'Norway', region: 'North Sea', lat: 56.5, lng: 3.2 }
  ];
  
  const lithologyFactors = {
    'sandstone': { porosity: 1.0, thickness: 1.0, recovery: 1.0 },
    'carbonate-limestone-dolomite': { porosity: 0.8, thickness: 1.2, recovery: 1.1 },
    'shale-mudstone': { porosity: 0.6, thickness: 0.8, recovery: 0.7 },
    'mixed-clastic-carbonate': { porosity: 0.9, thickness: 1.1, recovery: 0.95 },
    'carbonate-clastic-interbedded': { porosity: 0.85, thickness: 1.15, recovery: 1.05 },
    'volcanic-igneous': { porosity: 0.4, thickness: 0.6, recovery: 0.8 },
    'coal-bearing': { porosity: 0.3, thickness: 0.5, recovery: 0.6 },
    'evaporite-anhydrite-gypsum': { porosity: 0.2, thickness: 0.4, recovery: 0.5 }
  };
  
  const driveFactors = {
    'water-drive': { recovery: 1.2, eur: 1.3 },
    'gas-cap-drive': { recovery: 1.1, eur: 1.2 },
    'solution-gas-drive': { recovery: 0.9, eur: 0.8 },
    'gravity-drainage': { recovery: 1.0, eur: 1.0 },
    'gas-injection-eor': { recovery: 1.4, eur: 1.5 },
    'water-injection-eor': { recovery: 1.3, eur: 1.4 },
    'depletion-volumetric-drive': { recovery: 0.7, eur: 0.6 },
    'compaction-drive': { recovery: 0.8, eur: 0.7 }
  };
  
  const shuffledTemplates = [...fieldTemplates].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < targetCount && i < shuffledTemplates.length; i++) {
    const template = shuffledTemplates[i];
    const lithoFactor = lithologyFactors[searchCriteria.lithologyType] || lithologyFactors['sandstone'];
    const driveFactor = driveFactors[searchCriteria.driveMethod] || driveFactors['water-drive'];
    
    const baseThickness = parseFloat(searchCriteria.netPayThickness);
    const basePorosity = parseFloat(searchCriteria.meanPorosity);
    const baseSaturation = parseFloat(searchCriteria.meanSaturation);
    
    const thicknessVariation = 0.7 + Math.random() * 0.6;
    const porosityVariation = 0.8 + Math.random() * 0.4;
    const saturationVariation = 0.9 + Math.random() * 0.2;
    
    const avgThickness = baseThickness * lithoFactor.thickness * thicknessVariation;
    const avgPorosity = basePorosity * lithoFactor.porosity * porosityVariation;
    const avgSaturation = baseSaturation * saturationVariation;
    
    const baseRecovery = 30 + Math.random() * 25;
    const recoveryFactor = baseRecovery * lithoFactor.recovery * driveFactor.recovery;
    
    const baseEUR = 200 + Math.random() * 600;
    const eur = baseEUR * driveFactor.eur;
    
    const thicknessSimilarity = Math.max(0, 100 - Math.abs(avgThickness - baseThickness) / baseThickness * 100);
    const porositySimilarity = Math.max(0, 100 - Math.abs(avgPorosity - basePorosity) / basePorosity * 100);
    const saturationSimilarity = Math.max(0, 100 - Math.abs(avgSaturation - baseSaturation) / baseSaturation * 100);
    
    const lithologyMatch = searchCriteria.lithologyType === 'sandstone' ? 20 : 
                          searchCriteria.lithologyType.includes('carbonate') ? 15 : 10;
    const driveMatch = 15;
    
    const similarityScore = Math.round(
      (thicknessSimilarity * 0.25 + 
       porositySimilarity * 0.30 + 
       saturationSimilarity * 0.20 + 
       lithologyMatch + 
       driveMatch) * (0.85 + Math.random() * 0.15)
    );
    
    let distance = null;
    if (searchCriteria.latitude && searchCriteria.longitude) {
      distance = calculateDistance(
        parseFloat(searchCriteria.latitude),
        parseFloat(searchCriteria.longitude),
        template.lat,
        template.lng
      );
      
      if (searchCriteria.maxSearchDistance !== 'global') {
        const maxDistance = parseFloat(searchCriteria.maxSearchDistance);
        if (distance > maxDistance) continue;
      }
    }
    
    const productionHistories = [
      'Mature field with extensive production data and EOR programs',
      'Recent discovery with promising initial production rates',
      'Long-term producer with proven reserves and stable decline',
      'Enhanced recovery operations showing improved performance',
      'Horizontal drilling program increased recovery significantly',
      'Waterflood implementation improved ultimate recovery',
      'Gas injection project enhanced oil recovery rates',
      'Advanced completion techniques optimized production'
    ];
    
    const analog = {
      rank: existingCount + i + 1,
      fieldName: `${template.name} ${['Field', 'Block', 'Area', 'Zone'][Math.floor(Math.random() * 4)]}`,
      country: template.country,
      region: template.region,
      similarityScore: Math.min(95, Math.max(75, similarityScore)),
      avgThickness: Math.round(avgThickness * 10) / 10,
      avgPorosity: Math.round(avgPorosity * 10) / 10,
      avgSaturation: Math.round(avgSaturation * 10) / 10,
      driveMethod: searchCriteria.driveMethod,
      recoveryFactor: Math.round(recoveryFactor * 10) / 10,
      eur: Math.round(eur),
      adjustmentFactor: Math.round((0.85 + Math.random() * 0.3) * 100) / 100,
      distance: distance,
      location: { lat: template.lat, lng: template.lng },
      productionHistory: productionHistories[Math.floor(Math.random() * productionHistories.length)],
      keyMetrics: {
        thickness: avgThickness,
        porosity: avgPorosity,
        saturation: avgSaturation,
        recoveryFactor: recoveryFactor
      },
      aiGenerated: true,
      generatedDate: new Date().toISOString()
    };
    
    aiAnalogs.push(analog);
  }
  
  return aiAnalogs.sort((a, b) => b.similarityScore - a.similarityScore);
};

export const enhanceAnalogWithAI = (analog, searchCriteria) => {
  const enhancements = {
    geologicalInsights: generateGeologicalInsights(analog, searchCriteria),
    productionForecast: generateProductionForecast(analog),
    riskAssessment: generateRiskAssessment(analog),
    developmentRecommendations: generateDevelopmentRecommendations(analog)
  };
  
  return { ...analog, aiEnhancements: enhancements };
};

const generateGeologicalInsights = (analog, criteria) => {
  const insights = [];
  
  if (analog.avgPorosity > parseFloat(criteria.meanPorosity) * 1.1) {
    insights.push('Higher porosity suggests better reservoir quality');
  }
  
  if (analog.avgThickness > parseFloat(criteria.netPayThickness) * 1.2) {
    insights.push('Thicker pay zone indicates larger hydrocarbon volume');
  }
  
  if (analog.recoveryFactor > 40) {
    insights.push('High recovery factor indicates efficient drive mechanism');
  }
  
  return insights;
};

const generateProductionForecast = (analog) => {
  const peakRate = analog.eur * 0.15;
  const plateauYears = 3 + Math.random() * 4;
  const declineRate = 8 + Math.random() * 12;
  
  return {
    peakProductionRate: Math.round(peakRate),
    plateauDuration: Math.round(plateauYears),
    declineRate: Math.round(declineRate * 10) / 10,
    economicLimit: Math.round(analog.eur * 0.85)
  };
};

const generateRiskAssessment = (analog) => {
  const risks = [];
  
  if (analog.avgPorosity < 8) {
    risks.push('Low porosity may impact production rates');
  }
  
  if (analog.driveMethod === 'depletion-volumetric-drive') {
    risks.push('Depletion drive may require pressure maintenance');
  }
  
  if (analog.distance && analog.distance > 5000) {
    risks.push('Geographic distance may limit direct applicability');
  }
  
  return risks;
};

const generateDevelopmentRecommendations = (analog) => {
  const recommendations = [];
  
  if (analog.recoveryFactor > 45) {
    recommendations.push('Consider similar completion techniques');
  }
  
  if (analog.driveMethod.includes('injection')) {
    recommendations.push('Evaluate EOR potential early in field life');
  }
  
  if (analog.avgThickness > 20) {
    recommendations.push('Multi-zone completion may optimize recovery');
  }
  
  return recommendations;
};