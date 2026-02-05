/**
 * Utility functions for Casing Wear Analyzer - Wear Calculations (Phase 3)
 */
import { convertUnits } from './unitConverter';

/**
 * Calculates wear volume based on the energy dissipation model.
 * Wear Volume = Wear Factor * Normal Force * Sliding Distance
 * @param {number} wearFactor - Wear factor (e.g., mm³/kN·m)
 * @param {number} normalContactForce - Normal contact force (kN)
 * @param {number} slidingDistance - Total sliding or rotary distance (m)
 * @returns {number} Wear volume (mm³)
 */
export const calculateWearVolume = (wearFactor, normalContactForce, slidingDistance) => {
  if (wearFactor < 0 || normalContactForce < 0 || slidingDistance < 0) {
    return 0;
  }
  return wearFactor * normalContactForce * slidingDistance;
};

/**
 * Calculates the depth of wear on the casing inner wall.
 * Wear Depth = Wear Volume / Surface Area
 * @param {number} wearVolume - Wear volume (mm³)
 * @param {number} casingID_in - Casing inner diameter (inches)
 * @param {number} depthInterval_m - Length of the interval over which wear occurs (m)
 * @returns {number} Wear depth (mm)
 */
export const calculateWearDepth = (wearVolume, casingID_in, depthInterval_m) => {
  if (wearVolume <= 0 || casingID_in <= 0 || depthInterval_m <= 0) {
    return 0;
  }
  const casingID_mm = convertUnits(casingID_in, 'in', 'mm');
  const depthInterval_mm = depthInterval_m * 1000;
  const surfaceArea = Math.PI * casingID_mm * depthInterval_mm;
  return wearVolume / surfaceArea;
};

/**
 * Scales wear depth by a safety multiplier for conservative analysis.
 * @param {number} wearDepth - Calculated wear depth (mm)
 * @param {number} safetyMultiplier - Safety multiplier (e.g., 1.0 to 2.0)
 * @returns {number} Scaled wear depth (mm)
 */
export const applyConservativeMode = (wearDepth, safetyMultiplier) => {
  return wearDepth * safetyMultiplier;
};

/**
 * Calculates the remaining wall thickness after wear.
 * @param {number} originalWallThickness_mm - Original casing wall thickness (mm)
 * @param {number} cumulativeWearDepth_mm - Cumulative wear depth at a point (mm)
 * @returns {number} Remaining wall thickness (mm)
 */
export const calculateRemainingWallThickness = (originalWallThickness_mm, cumulativeWearDepth_mm) => {
  return Math.max(0, originalWallThickness_mm - cumulativeWearDepth_mm);
};

/**
 * Recalculates burst capacity based on remaining wall thickness (Barlow's formula approximation).
 * @param {number} originalBurstRating_psi - Original burst rating (psi)
 * @param {number} remainingWallThickness_mm - Remaining wall thickness (mm)
 * @param {number} originalWallThickness_mm - Original wall thickness (mm)
 * @returns {number} New burst capacity (psi)
 */
export const calculateBurstCapacity = (originalBurstRating_psi, remainingWallThickness_mm, originalWallThickness_mm) => {
  if (originalWallThickness_mm <= 0) return 0;
  return originalBurstRating_psi * (remainingWallThickness_mm / originalWallThickness_mm);
};

/**
 * Recalculates collapse capacity based on remaining wall thickness (API formula approximation).
 * The relationship is more complex, but a squared ratio is a common simplification for initial estimates.
 * @param {number} originalCollapseRating_psi - Original collapse rating (psi)
 * @param {number} remainingWallThickness_mm - Remaining wall thickness (mm)
 * @param {number} originalWallThickness_mm - Original wall thickness (mm)
 * @returns {number} New collapse capacity (psi)
 */
export const calculateCollapseCapacity = (originalCollapseRating_psi, remainingWallThickness_mm, originalWallThickness_mm) => {
  if (originalWallThickness_mm <= 0) return 0;
  // A more realistic model would be more complex, but for this phase, (t/t0)^2 is a reasonable approximation.
  return originalCollapseRating_psi * Math.pow(remainingWallThickness_mm / originalWallThickness_mm, 2);
};

/**
 * Calculates the safety factor.
 * @param {number} capacity - The capacity of the component (e.g., burst psi)
 * @param {number} appliedLoad - The load applied to the component (e.g., pressure psi)
 * @returns {number} Safety factor
 */
export const calculateSafetyFactor = (capacity, appliedLoad) => {
  if (appliedLoad <= 0) return Infinity; // Avoid division by zero, SF is very high
  return capacity / appliedLoad;
};

/**
 * Identifies controlling depths where safety factors or wall thickness are lowest.
 * @param {Array} profile - The wear profile array
 * @param {Object} thresholds - Thresholds for identification
 * @returns {Array} Sorted array of critical points
 */
export const identifyControllingDepths = (profile, thresholds = { minSF: 1.25, minWT: 5.0 }) => {
  if (!profile || profile.length === 0) return [];
  
  return profile
    .filter(p => p.wornBurstSF < thresholds.minSF || p.wornCollapseSF < thresholds.minSF || p.remainingWT_mm < thresholds.minWT)
    .map(p => {
      let reasons = [];
      if (p.wornBurstSF < thresholds.minSF) reasons.push('Low Burst SF');
      if (p.wornCollapseSF < thresholds.minSF) reasons.push('Low Collapse SF');
      if (p.remainingWT_mm < thresholds.minWT) reasons.push('Low Wall Thickness');
      
      return {
        ...p,
        reason: reasons.join(', ') || 'Critical Zone',
        criticality: Math.min(p.wornBurstSF, p.wornCollapseSF) // Lower is more critical
      };
    })
    .sort((a, b) => a.criticality - b.criticality) // Sort by most critical first
    .slice(0, 10); // Return top 10
};

/**
 * Generates a comprehensive wear profile along the wellbore.
 * @param {object} params - All necessary input parameters.
 * @returns {object} A comprehensive wear profile object.
 */
export const generateWearProfile = ({
  casingData,
  contactForceProfile,
  mudParams,
  exposureParams,
  conservativeMultiplier = 1.0,
}) => {
  const originalWallThickness_mm = convertUnits((casingData.od - casingData.id_val) / 2, 'in', 'mm');
  const casingID_in = casingData.id_val;

  // Assuming contactForceProfile is an array of { depth, dls, contactForce }
  const profile = contactForceProfile.map((point, index) => {
    // For simplicity, assume uniform wear distribution over the interval.
    const depthInterval_m = index > 0 ? point.depth - contactForceProfile[index - 1].depth : 30;

    const rotaryWearVolume = calculateWearVolume(
      mudParams.wearFactorTJ, // Assume tool joint wear dominates
      point.contactForce,
      exposureParams.rotatingHours > 0 ? convertUnits(exposureParams.rpm * exposureParams.rotatingHours * 60 * Math.PI * casingData.od, 'in', 'm') / contactForceProfile.length : 0 // Simplified rotary distance at this point
    );
    const slidingWearVolume = calculateWearVolume(
      mudParams.wearFactorPB, // Assume pipe body wear for sliding
      point.contactForce,
      exposureParams.slidingHours > 0 ? convertUnits(exposureParams.ropSliding * exposureParams.slidingHours, 'ft', 'm') / contactForceProfile.length : 0 // Simplified sliding distance
    );

    const totalWearVolume = rotaryWearVolume + slidingWearVolume;
    let wearDepth_mm = calculateWearDepth(totalWearVolume, casingID_in, depthInterval_m);
    wearDepth_mm = applyConservativeMode(wearDepth_mm, conservativeMultiplier);

    const remainingWT_mm = calculateRemainingWallThickness(originalWallThickness_mm, wearDepth_mm);
    
    // Mock applied loads for SF calculation (linearly increasing with depth for demo)
    const appliedBurstLoad_psi = 3000 + point.depth * 0.5; 
    const appliedCollapseLoad_psi = 1500 + point.depth * 0.6;

    const originalBurstSF = calculateSafetyFactor(casingData.burst, appliedBurstLoad_psi);
    const originalCollapseSF = calculateSafetyFactor(casingData.collapse, appliedCollapseLoad_psi);
    
    const newBurstCapacity = calculateBurstCapacity(casingData.burst, remainingWT_mm, originalWallThickness_mm);
    const newCollapseCapacity = calculateCollapseCapacity(casingData.collapse, remainingWT_mm, originalWallThickness_mm);

    const wornBurstSF = calculateSafetyFactor(newBurstCapacity, appliedBurstLoad_psi);
    const wornCollapseSF = calculateSafetyFactor(newCollapseCapacity, appliedCollapseLoad_psi);

    return {
      depth: point.depth,
      wearDepth_mm,
      remainingWT_mm,
      originalBurstSF,
      originalCollapseSF,
      wornBurstSF,
      wornCollapseSF,
      newBurstCapacity,
      newCollapseCapacity
    };
  });
  
  // Find summary stats
  let maxWear = { depth: 0, wear: 0 };
  let minWT = { depth: 0, wt: originalWallThickness_mm };
  let minBurstSF = { depth: 0, sf: Infinity };
  let minCollapseSF = { depth: 0, sf: Infinity };

  profile.forEach(p => {
    if (p.wearDepth_mm > maxWear.wear) maxWear = { depth: p.depth, wear: p.wearDepth_mm };
    if (p.remainingWT_mm < minWT.wt) minWT = { depth: p.depth, wt: p.remainingWT_mm };
    if (p.wornBurstSF < minBurstSF.sf) minBurstSF = { depth: p.depth, sf: p.wornBurstSF };
    if (p.wornCollapseSF < minCollapseSF.sf) minCollapseSF = { depth: p.depth, sf: p.wornCollapseSF };
  });

  const controllingDepths = identifyControllingDepths(profile, { minSF: 1.25, minWT: originalWallThickness_mm * 0.8 });

  return {
    profile,
    originalWallThickness_mm,
    controllingDepths,
    summary: {
      maxWearDepth: maxWear,
      minRemainingWT: minWT,
      minBurstSF: minBurstSF,
      minCollapseSF: minCollapseSF,
    },
  };
};

/**
 * Identifies risk zones based on thresholds.
 * @param {Array} wearProfile - The generated wear profile.
 * @param {Object} thresholds - { wt_percent, sf_min, wear_mm }
 * @returns {Array} An array of risk zones.
 */
export const identifyRiskZones = (wearProfile, originalWallThickness_mm, thresholds) => {
    const riskZones = [];
    if (!wearProfile || !wearProfile.profile) return riskZones;

    wearProfile.profile.forEach(point => {
        const remainingWT_percent = (point.remainingWT_mm / originalWallThickness_mm) * 100;
        let riskLevel = 'Low';
        let reasons = [];

        if (remainingWT_percent < thresholds.wt_percent_critical || point.wornBurstSF < thresholds.sf_critical || point.wornCollapseSF < thresholds.sf_critical) {
            riskLevel = 'Critical';
        } else if (remainingWT_percent < thresholds.wt_percent_high || point.wornBurstSF < thresholds.sf_high || point.wornCollapseSF < thresholds.sf_high) {
            riskLevel = 'High';
        } else if (point.wearDepth_mm > thresholds.wear_mm_medium) {
            riskLevel = 'Medium';
        }
        
        if (remainingWT_percent < thresholds.wt_percent_high) reasons.push(`WT is ${remainingWT_percent.toFixed(1)}%`);
        if (point.wornBurstSF < thresholds.sf_high) reasons.push(`Burst SF is ${point.wornBurstSF.toFixed(2)}`);
        if (point.wornCollapseSF < thresholds.sf_high) reasons.push(`Collapse SF is ${point.wornCollapseSF.toFixed(2)}`);

        if (riskLevel !== 'Low') {
            riskZones.push({
                depth: point.depth,
                riskLevel,
                reason: reasons.join(', '),
                remainingWT_mm: point.remainingWT_mm,
                burstSF: point.wornBurstSF,
                collapseSF: point.wornCollapseSF,
            });
        }
    });

    // Consolidate contiguous zones
    if (riskZones.length === 0) return [];
    
    const consolidated = [riskZones[0]];
    for (let i = 1; i < riskZones.length; i++) {
        const last = consolidated[consolidated.length - 1];
        const current = riskZones[i];
        if (current.depth - last.depth < 31 && current.riskLevel === last.riskLevel) { // Assuming 30m intervals
            last.depth_end = current.depth;
            // update with worse values
            last.remainingWT_mm = Math.min(last.remainingWT_mm, current.remainingWT_mm);
            last.burstSF = Math.min(last.burstSF, current.burstSF);
            last.collapseSF = Math.min(last.collapseSF, current.collapseSF);
        } else {
            current.depth_end = current.depth;
            consolidated.push(current);
        }
    }
    
    return consolidated.map(z => ({ ...z, depth_start: z.depth, depth_end: z.depth_end || z.depth }));
};