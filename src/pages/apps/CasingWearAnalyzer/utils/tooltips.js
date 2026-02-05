/**
 * Tooltip definitions for Casing Wear Analyzer
 */
export const TOOLTIPS = {
    wearFactor: {
        title: "Wear Factor",
        content: "Material removal rate per unit contact force and sliding distance. Units: mm³/kN·m or dimensionless. Higher values indicate more aggressive wear."
    },
    contactForce: {
        title: "Contact Force",
        content: "Normal force between BHA and casing wall. Increases with dogleg severity and BHA weight. Units: kN (kilonewtons)."
    },
    remainingWT: {
        title: "Remaining Wall Thickness",
        content: "Current casing wall thickness after wear. Calculated as: Original WT - Cumulative wear depth. Lower values indicate higher risk."
    },
    safetyFactor: {
        title: "Safety Factor",
        content: "Ratio of casing capacity to applied load. SF > 1.25 is generally considered safe. 1.0 < SF < 1.25 warrants caution."
    },
    doglegSeverity: {
        title: "Dogleg Severity (DLS)",
        content: "Rate of change of wellbore inclination. Units: degrees per 30 meters. Higher values drastically increase contact force."
    },
    toolJoint: {
        title: "Tool Joint",
        content: "Connection between drill pipe sections. Has a larger OD than pipe body, creating localized high contact force points."
    },
    conservativeMode: {
        title: "Conservative Mode",
        content: "Applies a safety multiplier (default 1.5x) to calculated wear depths to account for uncertainties in input data."
    },
    riskScore: {
        title: "Risk Score",
        content: "Composite score (0-100) assessing zone criticality based on wear depth, remaining wall thickness, and safety factors."
    },
    rotatingHours: {
        title: "Rotating Hours",
        content: "Total time the drill string is rotating at this depth. Major contributor to wear."
    },
    slidingHours: {
        title: "Sliding Hours",
        content: "Total time spent sliding (non-rotating) at this depth. Usually contributes less wear than rotation."
    }
};