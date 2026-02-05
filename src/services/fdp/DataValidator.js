/**
 * Data Validation Service
 * Validates field data integrity and completeness.
 */

export class DataValidator {
    static validateFieldOverview(data) {
        const errors = [];
        const warnings = [];

        if (!data.fieldName) errors.push("Field Name is required");
        if (!data.country) errors.push("Region/Country is required");
        if (!data.operator) warnings.push("Operator not specified");
        
        if (data.dates) {
            const { discovery, firstOil } = data.dates;
            if (discovery && firstOil && new Date(discovery) > new Date(firstOil)) {
                errors.push("First Oil date cannot be before Discovery date");
            }
        }

        return { isValid: errors.length === 0, errors, warnings };
    }

    static validateReserves(data) {
        const errors = [];
        if (data.p90 > data.p50 || data.p50 > data.p10) { // Note: P90 (High Confidence/Low Vol) < P50 < P10 (Low Confidence/High Vol) usually, but depends on convention (Cumulative > vs Cumulative <). Assuming standard reserves: 1P < 2P < 3P
             // If using 1P, 2P, 3P notation where 1P is smallest
             if (data.p10 < data.p50 || data.p50 < data.p90) {
                 // warning for inconsistent distribution logic if P10 is high case
             }
        }
        return { isValid: errors.length === 0, errors };
    }

    static getCompletenessScore(data) {
        let filled = 0;
        let total = 0;

        const checkObj = (obj) => {
            for (let key in obj) {
                total++;
                if (obj[key] && (Array.isArray(obj[key]) ? obj[key].length > 0 : true)) {
                    filled++;
                }
            }
        };

        checkObj(data);
        return Math.round((filled / (total || 1)) * 100);
    }
}