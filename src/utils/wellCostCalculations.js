const regionsData = {
  "Gulf of Mexico": { rigRate: 450000, serviceSpread: 200000, daysFactor: 0.003, bestInClassFactor: 0.85 },
  "North Sea": { rigRate: 400000, serviceSpread: 220000, daysFactor: 0.0035, bestInClassFactor: 0.8 },
  "West Africa": { rigRate: 380000, serviceSpread: 180000, daysFactor: 0.004, bestInClassFactor: 0.9 },
  "Brazil": { rigRate: 420000, serviceSpread: 190000, daysFactor: 0.0038, bestInClassFactor: 0.88 },
  "Permian Basin": { rigRate: 35000, serviceSpread: 40000, daysFactor: 0.001, bestInClassFactor: 0.9 },
};

const wellTypeModifiers = {
  "Exploration": { rateMod: 1.2, daysMod: 1.3 },
  "Development - Vertical": { rateMod: 0.9, daysMod: 0.8 },
  "Development - Horizontal": { rateMod: 1.0, daysMod: 1.1 },
  "Deepwater": { rateMod: 1.5, daysMod: 1.5 },
  "Onshore": { rateMod: 0.2, daysMod: 0.3 },
  "Offshore Shelf": { rateMod: 1.0, daysMod: 1.0 },
};

export const getAiSuggestions = async (region, wellType, measuredDepth) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const baseData = regionsData[region] || regionsData["Gulf of Mexico"];
  const typeMod = wellTypeModifiers[wellType] || wellTypeModifiers["Offshore Shelf"];

  const suggestedRigRate = Math.round((baseData.rigRate * typeMod.rateMod) / 1000) * 1000;
  const suggestedServiceSpread = Math.round((baseData.serviceSpread * typeMod.rateMod) / 1000) * 1000;
  const suggestedDrillingDays = Math.round(measuredDepth * baseData.daysFactor * typeMod.daysMod);

  const bestInClassCost = (suggestedRigRate * baseData.bestInClassFactor + suggestedServiceSpread * baseData.bestInClassFactor) * (suggestedDrillingDays * baseData.bestInClassFactor);

  return {
    suggestedRigRate,
    suggestedServiceSpread,
    suggestedDrillingDays,
    bestInClassCost,
  };
};

export const calculateWellCost = (inputs) => {
  const {
    rigRate,
    serviceSpread,
    drillingDays,
    rigMoveCost,
    completionCost,
    contingency,
    bestInClassCost
  } = inputs;

  const dailyCost = rigRate + serviceSpread;
  const totalDrillingCost = dailyCost * drillingDays;
  const totalBaseCost = totalDrillingCost + rigMoveCost + completionCost;
  
  const p50Cost = totalBaseCost * (1 + contingency / 100);
  const p10Cost = p50Cost * 0.8; // simplified p10
  const p90Cost = p50Cost * 1.25; // simplified p90

  const dayByDayCurve = Array.from({ length: drillingDays + 1 }, (_, i) => {
    const cumulativeCost = (dailyCost * i) + rigMoveCost;
    return { day: i, cost: cumulativeCost };
  });
  dayByDayCurve[drillingDays] += completionCost;

  const costBreakdown = [
    { name: "Drilling (Rig + Services)", value: totalDrillingCost },
    { name: "Rig Move", value: rigMoveCost },
    { name: "Completion", value: completionCost },
    { name: "Contingency", value: totalBaseCost * (contingency / 100) },
  ];
  
  return {
    p10: p10Cost,
    p50: p50Cost,
    p90: p90Cost,
    bestInClass: bestInClassCost,
    dayByDayCurve,
    costBreakdown
  };
};