/**
 * Validates data availability for PPFG Prognosis
 */
export const validatePrognosisData = (data) => {
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    if (!data) {
        return { isValid: false, errors: ['No data object provided'], warnings: [] };
    }

    // 1. Check Depth
    if (!data.depths || data.depths.length === 0) {
        validation.isValid = false;
        validation.errors.push("Critical: No depth channel found in dataset.");
    }

    // 2. Check Phase 4 (PP)
    if (!data.pp) {
        // It's possible Phase 4 hasn't run, but we might have Phase 2 deterministic.
        // But specifically user asked to ensure P50 etc from Phase 4 are checked.
        validation.warnings.push("Missing Phase 4 Results: Pore Pressure (P50) curve is missing. Using deterministic PP if available.");
        // We don't fail invalid because we might want to show just logs
    } else if (data.pp.every(v => v === null || v === undefined)) {
        validation.warnings.push("Phase 4 Pore Pressure curve contains no valid data.");
    }

    // 3. Check Phase 5 (FG)
    if (!data.fg) {
        validation.warnings.push("Missing Phase 5 Results: Fracture Gradient curve is missing.");
    }

    // 4. Check OBG
    if (!data.obg) {
        validation.warnings.push("Missing Overburden Gradient. Calculation might be incomplete.");
    }

    // 5. Check Logs for Lithology
    if (!data.GR) {
        validation.warnings.push("Missing Gamma Ray log. Lithology detection will be inaccurate.");
    }

    return validation;
};