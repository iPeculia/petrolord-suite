/**
 * Utility functions for Casing Wear Analyzer - Scenario Engine (Phase 4)
 */
import { generateWearProfile } from './wearCalculations';
import { calculateBHAProperties } from './contactForceCalculations';

/**
 * Creates a new scenario by applying modifications to a base case.
 * @param {string} name - The name for the new scenario.
 * @param {object} baseCase - The full base case state.
 * @param {object} modifications - The changes to apply.
 * @returns {object} A new scenario object with recalculated profiles.
 */
export const createScenario = (name, baseCase, modifications) => {
  const newScenario = {
    ...JSON.parse(JSON.stringify(baseCase)), // Deep clone
    name,
    id: `scenario-${Date.now()}`,
    modifications,
  };

  // Apply modifications
  if (modifications.operationParams) {
    newScenario.operationParams = { ...newScenario.operationParams, ...modifications.operationParams };
  }
  if (modifications.exposureParams) {
    newScenario.exposureParams = { ...newScenario.exposureParams, ...modifications.exposureParams };
  }
  if (modifications.mudParams) {
    newScenario.mudParams = { ...newScenario.mudParams, ...modifications.mudParams };
  }
  if (modifications.casingData) {
     newScenario.selectedCasingString = { ...newScenario.selectedCasingString, ...modifications.casingData };
  }

  // Recalculate derived loads and wear profile
  newScenario.derivedLoads.bhaSummary = calculateBHAProperties(newScenario.operationParams);
  
  const wearProfile = generateWearProfile({
      casingData: newScenario.selectedCasingString,
      contactForceProfile: newScenario.derivedLoads.profileData, // Assume this doesn't change for now
      mudParams: newScenario.mudParams,
      exposureParams: newScenario.exposureParams,
      conservativeMultiplier: newScenario.conservativeMultiplier,
  });

  newScenario.wearProfile = wearProfile;

  return newScenario;
};

/**
 * Compares multiple scenarios and returns a summary.
 * @param {Array} scenarios - An array of scenario objects to compare.
 * @returns {object} A comparison object.
 */
export const compareScenarios = (scenarios) => {
  if (!scenarios || scenarios.length === 0) return null;

  const comparison = scenarios.map(scenario => {
    const summary = scenario.wearProfile?.summary;
    const riskZones = scenario.riskZones || [];
    const highestRisk = Math.max(0, ...riskZones.map(z => z.maxRiskScore));

    return {
      id: scenario.id,
      name: scenario.name,
      maxWearDepth: summary?.maxWearDepth?.wear || 0,
      minRemainingWT: summary?.minRemainingWT?.wt || 0,
      minBurstSF: summary?.minBurstSF?.sf || 0,
      minCollapseSF: summary?.minCollapseSF?.sf || 0,
      riskScore: highestRisk,
      highRiskZoneCount: riskZones.length,
    };
  });

  return comparison;
};

/**
 * Placeholder for cost impact calculation.
 */
export const calculateCostImpact = (scenario, baseCase) => {
  // Dummy implementation for Phase 4
  let costImpact = 0;
  if (scenario.modifications.casingData?.grade !== baseCase.selectedCasingString.grade) {
    costImpact += 50000; // Arbitrary cost for casing upgrade
  }
   if (scenario.modifications.exposureParams?.rpm < baseCase.exposureParams.rpm) {
    costImpact += 5000; // Arbitrary cost for rig time / operational change
  }
  return costImpact;
};