/**
 * Utility functions for Casing Wear Analyzer - Risk Zone Analysis (Phase 4)
 */

/**
 * Calculates a risk score based on wear, remaining wall thickness, and safety factors.
 * @param {number} wearDepth_mm - The depth of wear.
 * @param {number} remainingWT_mm - Remaining wall thickness.
 * @param {number} originalWT_mm - Original wall thickness.
 * @param {number} burstSF - Worn burst safety factor.
 * @param {number} collapseSF - Worn collapse safety factor.
 * @returns {number} A risk score from 0 to 100.
 */
export const calculateRiskScore = (wearDepth_mm, remainingWT_mm, originalWT_mm, burstSF, collapseSF) => {
    let score = 0;

    // Wall thickness component (up to 40 points)
    const wt_percent_loss = (wearDepth_mm / originalWT_mm) * 100;
    if (wt_percent_loss > 50) score += 40;
    else if (wt_percent_loss > 25) score += 20 + (wt_percent_loss - 25) * 0.8;
    else if (wt_percent_loss > 10) score += 10 + (wt_percent_loss - 10) * 0.66;
    
    // Safety factor component (up to 50 points, 25 for each)
    if (burstSF < 1.0) score += 25;
    else if (burstSF < 1.25) score += 15 + (1.25 - burstSF) * 40;
    else if (burstSF < 1.5) score += 5 + (1.5 - burstSF) * 40;

    if (collapseSF < 1.0) score += 25;
    else if (collapseSF < 1.25) score += 15 + (1.25 - collapseSF) * 40;
    else if (collapseSF < 1.5) score += 5 + (1.5 - collapseSF) * 40;

    // Wear depth component (up to 10 points)
    if (wearDepth_mm > 5) score += 10;
    else if (wearDepth_mm > 2) score += (wearDepth_mm - 2) * 3.33;

    return Math.min(100, Math.round(score));
};

/**
 * Determines the probable cause of wear based on a set of rules.
 * @param {number} wearDepth - The depth of wear.
 * @param {number} doglegSeverity - DLS at the point of wear.
 * @param {object} operationData - Operation parameters.
 * @param {object} bhaSummary - BHA summary properties.
 * @returns {string} A description of the probable cause.
 */
export const determineProbableCause = (wearDepth, doglegSeverity, operationData, bhaSummary) => {
    const causes = [];
    
    if (doglegSeverity > 3) {
        causes.push("High Dogleg Severity");
    }
    if (operationData.rotatingHours > 100) {
        causes.push("Extended Rotary Drilling");
    }
    if (operationData.rpm > 150) {
        causes.push("High-Speed Rotation");
    }
    if (bhaSummary.totalWeight > 80) { // klbf
        causes.push("Heavy BHA");
    }
    if (wearDepth > 4) {
         causes.push("Aggressive Wear Factor");
    }

    if (causes.length === 0) return "General operational wear";
    if (causes.length > 2) return `Multiple factors: ${causes.slice(0, 2).join(', ')}, etc.`;
    return causes.join(' & ');
};

/**
 * Analyzes the entire wear profile to identify and detail high-risk zones.
 * @param {object} wearProfile - The full wear profile data.
 * @param {object} casingData - The selected casing string data.
 * @param {object} operationData - Operation parameters.
 * @param {object} derivedLoads - BHA summary and contact force profile.
 * @param {object} thresholds - User-defined or default thresholds.
 * @returns {Array} An array of high-risk zone objects.
 */
export const identifyHighRiskZones = (wearProfile, casingData, operationData, derivedLoads, thresholds) => {
    if (!wearProfile?.profile) return [];

    const highRiskPoints = wearProfile.profile.map((point, index) => {
        const riskScore = calculateRiskScore(
            point.wearDepth_mm,
            point.remainingWT_mm,
            wearProfile.originalWallThickness_mm,
            point.wornBurstSF,
            point.wornCollapseSF
        );

        if (riskScore < thresholds.riskScore) return null;

        const doglegSeverity = derivedLoads.profileData[index]?.dls || 0;
        const probableCause = determineProbableCause(point.wearDepth_mm, doglegSeverity, operationData, derivedLoads.bhaSummary);

        return {
            ...point,
            riskScore,
            probableCause,
            sectionName: casingData.name,
            tvd: derivedLoads.profileData[index]?.tvd || point.depth,
        };
    }).filter(Boolean);

    if (highRiskPoints.length === 0) return [];
    
    // Group contiguous high-risk points into zones
    const zones = [];
    let currentZone = null;

    for (const point of highRiskPoints) {
        if (!currentZone) {
            currentZone = {
                md_start: point.depth,
                md_end: point.depth,
                tvd_start: point.tvd,
                tvd_end: point.tvd,
                sectionName: point.sectionName,
                maxWear: point.wearDepth_mm,
                minWT: point.remainingWT_mm,
                minSF: Math.min(point.wornBurstSF, point.wornCollapseSF),
                maxRiskScore: point.riskScore,
                causes: new Set([point.probableCause]),
                points: [point]
            };
        } else if (point.depth - currentZone.md_end <= 60) { // Group if within 60m
            currentZone.md_end = point.depth;
            currentZone.tvd_end = point.tvd;
            currentZone.maxWear = Math.max(currentZone.maxWear, point.wearDepth_mm);
            currentZone.minWT = Math.min(currentZone.minWT, point.remainingWT_mm);
            currentZone.minSF = Math.min(currentZone.minSF, point.wornBurstSF, point.wornCollapseSF);
            currentZone.maxRiskScore = Math.max(currentZone.maxRiskScore, point.riskScore);
            currentZone.causes.add(point.probableCause);
            currentZone.points.push(point);
        } else {
            zones.push(currentZone);
            currentZone = {
                md_start: point.depth,
                md_end: point.depth,
                tvd_start: point.tvd,
                tvd_end: point.tvd,
                sectionName: point.sectionName,
                maxWear: point.wearDepth_mm,
                minWT: point.remainingWT_mm,
                minSF: Math.min(point.wornBurstSF, point.wornCollapseSF),
                maxRiskScore: point.riskScore,
                causes: new Set([point.probableCause]),
                points: [point]
            };
        }
    }
    if (currentZone) zones.push(currentZone);

    return zones.map(zone => ({
        ...zone,
        probableCause: Array.from(zone.causes).join('; '),
    })).sort((a,b) => b.maxRiskScore - a.maxRiskScore);
};