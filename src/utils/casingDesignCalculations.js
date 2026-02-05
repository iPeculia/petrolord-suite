const API_GRADES = {
  'J-55': { yieldStrength: 55000 },
  'K-55': { yieldStrength: 55000 },
  'N-80': { yieldStrength: 80000 },
  'L-80': { yieldStrength: 80000 },
  'P-110': { yieldStrength: 110000 },
};

const calculatePressures = (depth, mudWeight, poreGradient) => {
  const hydrostatic = 0.052 * mudWeight * depth;
  const formationPressure = poreGradient * depth;
  return { hydrostatic, formationPressure };
};

const calculateCasingPerformance = (casing, grade) => {
  const yieldStrength = API_GRADES[grade]?.yieldStrength || 80000;
  // This is a simplified wall thickness calculation. A real one would come from a catalog.
  const wallThickness = (casing.od - Math.sqrt(casing.od**2 - (4 * casing.weight) / (0.7854 * 0.2833))) / 2;
  if(isNaN(wallThickness) || wallThickness <= 0) return { burstPressure: 0, collapsePressure: 0, tensionYield: 0};

  const burstPressure = 0.875 * (2 * yieldStrength * wallThickness) / casing.od;
  const collapsePressure = yieldStrength * (((casing.od / wallThickness - 1)**2) / (casing.od / wallThickness)**2);
  const tensionYield = 0.7854 * (casing.od**2 - (casing.od - 2 * wallThickness)**2) * yieldStrength;

  return { burstPressure, collapsePressure, tensionYield };
};

export const runCasingDesignCheck = async (inputs) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { md, casingStrings, loadCases, poreGradient } = inputs;
  let maxBurst = 0, maxCollapse = 0, maxTension = 0;

  const casingResults = casingStrings.map(cs => {
    const performance = calculateCasingPerformance(cs, cs.grade);
    const utilizationData = [];
    
    // Check for invalid performance calculations
    if(performance.burstPressure <= 0 || performance.collapsePressure <= 0 || performance.tensionYield <= 0) {
        console.error(`Invalid performance calculation for casing string: ${cs.name}`);
        return { name: cs.name, settingDepth: cs.settingDepth, utilizationData: [] };
    }

    for (let depth = 0; depth <= cs.settingDepth; depth += 250) {
      const { hydrostatic, formationPressure } = calculatePressures(depth, loadCases.drillingMudWeight, poreGradient);
      
      const internalPressure = hydrostatic + (Math.random() * 500); // Kick pressure simulation
      const externalPressure = formationPressure + (Math.random() * 300); // Annular pressure
      
      const burstUtilization = ((internalPressure - externalPressure) / performance.burstPressure) * 100 * 1.1; // Safety factor
      const collapseUtilization = ((externalPressure - internalPressure) / performance.collapsePressure) * 100 * 1.0; // Safety factor
      const tensionLoad = cs.weight * depth * (1 + Math.random() * 0.1); // Buoyancy and drag simulation
      const tensionUtilization = (tensionLoad / performance.tensionYield) * 100 * 1.25; // Safety factor

      if (burstUtilization > maxBurst) maxBurst = burstUtilization;
      if (collapseUtilization > maxCollapse) maxCollapse = collapseUtilization;
      if (tensionUtilization > maxTension) maxTension = tensionUtilization;

      utilizationData.push({
        depth,
        internalPressure,
        externalPressure,
        burstUtilization: Math.max(0, burstUtilization),
        collapseUtilization: Math.max(0, collapseUtilization),
        tensionUtilization: Math.max(0, tensionUtilization),
      });
    }
    return { name: cs.name, settingDepth: cs.settingDepth, utilizationData };
  });

  let overallStatus = 'OK';
  if (maxBurst > 100 || maxCollapse > 100 || maxTension > 100) {
    overallStatus = 'Fail';
  } else if (maxBurst > 85 || maxCollapse > 85 || maxTension > 80) {
    overallStatus = 'Warning';
  }

  return {
    summary: {
      overallStatus,
      maxBurst,
      maxCollapse,
      maxTension,
    },
    casingResults,
    wellDepth: md,
  };
};