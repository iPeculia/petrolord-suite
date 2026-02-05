export const dataValidationService = {
    validateLogData: (logData) => {
        if (!logData || !Array.isArray(logData.data) || logData.data.length === 0) {
            return { isValid: false, message: 'Log data is missing or empty.' };
        }
        if (!logData.curves || logData.curves.length === 0) {
            return { isValid: false, message: 'Curve information is missing.' };
        }
        return { isValid: true, message: 'Log data is valid.' };
    },
    validatePressurePoints: (points) => {
        if (!Array.isArray(points)) {
            return { isValid: false, message: 'Pressure data must be an array.' };
        }
        return { isValid: true, message: 'Pressure data is valid.' };
    },
};