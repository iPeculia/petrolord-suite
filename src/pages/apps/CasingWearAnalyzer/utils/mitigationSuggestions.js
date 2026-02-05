/**
 * Utility functions for Casing Wear Analyzer - Mitigation Suggestions (Phase 4)
 */

/**
 * Suggests RPM reduction based on wear depth.
 * @returns {object} Suggestion for RPM reduction.
 */
export const suggestRPMReduction = (currentRPM, wearDepth) => {
    if (wearDepth < 2) return null;
    const targetWear = wearDepth * 0.75; // Aim for 25% reduction
    const suggestedRPM = Math.round(currentRPM * (targetWear / wearDepth));
    return {
        title: "Reduce Rotary Speed",
        suggestion: `Consider reducing RPM from ${currentRPM} to ~${suggestedRPM} in this interval.`,
        details: `A reduction to ${suggestedRPM} RPM could decrease wear by approximately 25%.`,
        effectiveness: wearDepth > 3.5 ? 'High' : 'Medium',
    };
};

/**
 * Suggests wear protection measures.
 * @returns {object} Suggestion for wear protection.
 */
export const suggestWearProtection = (wearDepth, remainingWT, originalWT) => {
    if (wearDepth < 3) return null;
    const wtPercent = (remainingWT / originalWT) * 100;
    let suggestions = [];
    if (wearDepth > 5 || wtPercent < 60) {
        suggestions.push("Installation of wear-resistant hard-facing on tool joints is strongly recommended.");
    } else if (wearDepth > 3) {
        suggestions.push("Consider using non-rotating drill pipe protectors or hard-facing on tool joints.");
    }
    if (wtPercent < 75) {
        suggestions.push("Ensure adequate casing centralizer placement to minimize contact.");
    }

    return {
        title: "Install Wear Protection",
        suggestion: suggestions.join(' '),
        effectiveness: 'High',
    };
};

/**
 * Suggests modifications to the Bottom Hole Assembly.
 * @returns {object} Suggestion for BHA modification.
 */
export const suggestBHAModification = (probableCause) => {
    if (!probableCause.toLowerCase().includes('bha')) return null;
    return {
        title: "Modify BHA Design",
        suggestion: "Review BHA design to reduce contact forces. Consider lighter-weight drill collars or using HWDP in place of some collars.",
        effectiveness: 'Medium',
    };
};

/**
 * Suggests upgrading casing specifications.
 * @returns {object} Suggestion for casing upgrade.
 */
export const suggestCasingUpgrade = (safetyFactor, remainingWT, originalWT) => {
    if (safetyFactor > 1.25 && (remainingWT / originalWT) > 0.8) return null;
    
    let suggestions = [];
    if (safetyFactor < 1.1) {
        suggestions.push("Upgrade to a higher grade (e.g., L-80 to P-110) or thicker-walled casing for future wells.");
    } else if (safetyFactor < 1.25) {
         suggestions.push("Consider a thicker-walled casing section in this interval for future wells.");
    }

    if (suggestions.length === 0) return null;

    return {
        title: "Upgrade Casing Specification",
        suggestion: suggestions.join(' '),
        effectiveness: 'High (for future wells)',
    };
};

/**
 * Suggests changes to operating practices.
 * @returns {object} Suggestion for operating practice changes.
 */
export const suggestOperatingPracticeChanges = (probableCause) => {
    const suggestions = [];
    if (probableCause.includes('High Dogleg')) {
        suggestions.push("Reduce RPM and control ROP through high-DLS sections.");
    }
    if (probableCause.includes('Extended Rotary')) {
        suggestions.push("Consider sliding intermittently or using mud motors to reduce casing wear from rotation.");
    }
    if (probableCause.includes('High-Speed Rotation')) {
        suggestions.push("Limit RPM to operational minimums required for hole cleaning.")
    }
    if (suggestions.length === 0) return null;

    return {
        title: "Adjust Operating Practices",
        suggestion: suggestions.join(' '),
        effectiveness: 'Medium'
    };
};


/**
 * Main function to generate a ranked list of mitigation suggestions for a risk zone.
 * @param {object} riskZone - The high-risk zone object.
 * @param {object} casingData - Casing properties.
 * @param {object} operationData - Operation parameters.
 * @param {object} bhaSummary - BHA summary.
 * @param {number} originalWT - Original wall thickness.
 * @returns {Array} An array of suggestion objects.
 */
export const generateMitigationSuggestions = (riskZone, casingData, operationData, bhaSummary, originalWT) => {
    const suggestions = [
        suggestOperatingPracticeChanges(riskZone.probableCause),
        suggestRPMReduction(operationData.rpm, riskZone.maxWear),
        suggestWearProtection(riskZone.maxWear, riskZone.minWT, originalWT),
        suggestBHAModification(riskZone.probableCause),
        suggestCasingUpgrade(riskZone.minSF, riskZone.minWT, originalWT),
    ].filter(Boolean); // Remove nulls

    // Rank suggestions
    const rank = { 'High': 3, 'Medium': 2, 'Low': 1 };
    suggestions.sort((a, b) => (rank[b.effectiveness] || 0) - (rank[a.effectiveness] || 0));

    return suggestions;
};