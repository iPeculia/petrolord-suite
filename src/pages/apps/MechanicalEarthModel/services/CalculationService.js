import { calculateVerticalStress, calculateHorizontalStresses } from './StressCalculationEngine';
import { calculatePorePressure, calculateFractureGradient } from './PressureCalculationEngine';
import { assessQuality } from './QualityAssessmentEngine';

/**
 * Orchestrates the entire 1D MEM calculation process.
 * @param {object} inputs - The user-provided inputs from the context.
 * @param {function} onProgress - Callback function to report progress updates.
 * @returns {Promise<object>} - A promise that resolves with the full calculation results.
 */
export const runCalculation = async (inputs, onProgress) => {
    try {
        onProgress({ percentage: 0, message: 'Starting calculation...' });
        
        // Ensure we have log data and mechanical properties
        if (!inputs.logData?.depth || !inputs.mechanicalProperties) {
            throw new Error("Log data or mechanical properties are missing.");
        }
        
        // Destructure necessary inputs
        const { logData, mechanicalProperties, pressureData } = inputs;
        const { depth, curves } = logData;
        const { poissonRatio, frictionAngle, stressRegime } = mechanicalProperties;
        const { porePressureMethod, fractureGradientMethod, eatonExponent, matthewsKellyCoeff } = pressureData;

        // Step 1: Vertical Stress (Sv)
        onProgress({ percentage: 10, message: 'Calculating Vertical Stress (Sv)...' });
        await new Promise(resolve => setTimeout(resolve, 200)); // simulate work
        const densityCurve = curves.find(c => c.name.toUpperCase() === 'RHOB' || c.name.toUpperCase() === 'DEN');
        if (!densityCurve) throw new Error("Density (RHOB/DEN) curve not found in log data.");
        const verticalStressResults = calculateVerticalStress(depth, densityCurve.values);

        // Step 2: Pore Pressure (Pp)
        onProgress({ percentage: 30, message: 'Calculating Pore Pressure (Pp)...' });
        await new Promise(resolve => setTimeout(resolve, 200));
        const sonicCurve = curves.find(c => c.name.toUpperCase() === 'DT' || c.name.toUpperCase() === 'DTCO');
        const porePressureResults = calculatePorePressure(
            porePressureMethod,
            { depth, Sv: verticalStressResults.sv, sonic: sonicCurve?.values, eatonExponent }
        );

        // Step 3: Horizontal Stresses (Shmin, SHmax)
        onProgress({ percentage: 50, message: 'Calculating Horizontal Stresses (SHmax, Shmin)...' });
        await new Promise(resolve => setTimeout(resolve, 200));
        const horizontalStressResults = calculateHorizontalStresses(
            stressRegime,
            { sv: verticalStressResults.sv, pp: porePressureResults.pp, poissonRatio, frictionAngle }
        );
        
        // Step 4: Fracture Gradient (Fg)
        onProgress({ percentage: 70, message: 'Calculating Fracture Gradient (Fg)...' });
        await new Promise(resolve => setTimeout(resolve, 200));
        const fractureGradientResults = calculateFractureGradient(
            fractureGradientMethod,
            { 
                sv: verticalStressResults.sv, 
                pp: porePressureResults.pp, 
                poissonRatio, 
                matthewsKellyCoeff,
                frictionAngle,
                depth
            }
        );

        const results = {
            depth: depth,
            Sv: verticalStressResults.sv,
            Sv_gradient: verticalStressResults.gradient,
            Pp: porePressureResults.pp,
            Pp_gradient: porePressureResults.gradient,
            Shmin: horizontalStressResults.shmin,
            SHmax: horizontalStressResults.shmax,
            Fg: fractureGradientResults.fg,
            Fg_gradient: fractureGradientResults.gradient,
            ratios: horizontalStressResults.ratios,
            stressRegimeProfile: horizontalStressResults.stressRegimeProfile
        };

        // Step 5: Quality Assessment
        onProgress({ percentage: 90, message: 'Assessing calculation quality...' });
        await new Promise(resolve => setTimeout(resolve, 200));
        const qualityReport = assessQuality(results);

        onProgress({ percentage: 100, message: 'Calculation complete!' });
        
        return {
            success: true,
            results,
            qualityReport,
            summary: {
                ...qualityReport.summary
            },
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        console.error("Calculation failed:", error);
        onProgress({ percentage: 100, message: `Error: ${error.message}` });
        return {
            success: false,
            error: error.message,
            results: null,
            qualityReport: null,
            summary: null,
        };
    }
};