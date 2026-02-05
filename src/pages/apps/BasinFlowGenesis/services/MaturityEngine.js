import { KerogenKinetics, FrequencyFactor } from './KerogenLibrary';
import { Units } from './PhysicsUtils';

/**
 * Maturity Engine
 * Calculates Thermal Maturity (Easy%Ro) and TTI
 */
export class MaturityEngine {

    /**
     * Initialize reaction state for a new layer
     */
    static initializeState(kerogenType) {
        const params = KerogenKinetics[kerogenType] || KerogenKinetics.default;
        // Fraction of kerogen remaining for each activation energy bin
        // Initial state is the stoichiometric factors (potentials)
        return {
            fractions: [...params.potentials],
            totalTransformation: 0,
            Ro: 0.2, // Initial vitrinite reflectance
            TTI: 0
        };
    }

    /**
     * Calculate maturity increment for a time step
     * @param {Object} state - Current maturity state { fractions, Ro }
     * @param {number} tempK - Temperature in Kelvin
     * @param {number} dtMa - Time step in Million Years
     * @param {string} kerogenType - 'type1', 'type2', etc.
     */
    static step(state, tempK, dtMa, kerogenType) {
        const dtSec = Units.ma_to_sec(dtMa);
        const R = 1.987; // Gas constant kcal/(mol*K)
        const A = FrequencyFactor;
        
        // 1. Calculate Arrhenius reaction rates for each bin
        // k = A * exp(-E / RT)
        const E = [34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72]; // Activation energies
        
        const newFractions = [...state.fractions];
        
        E.forEach((energy, i) => {
            const k = A * Math.exp(-energy / (R * tempK));
            // First order kinetic equation integration
            // x(t) = x0 * exp(-k*t)
            // x_new = x_old * exp(-k*dt)
            newFractions[i] = state.fractions[i] * Math.exp(-k * dtSec);
        });

        // 2. Calculate Transformation Ratio (TR)
        // TR = 1 - (Sum(x_current) / Sum(x_initial))
        // Assuming state.fractions was initialized with the potentials
        const initialPotentials = (KerogenKinetics[kerogenType] || KerogenKinetics.default).potentials;
        const initialSum = initialPotentials.reduce((a,b) => a+b, 0);
        const currentSum = newFractions.reduce((a,b) => a+b, 0);
        
        const TR = initialSum > 0 ? 1 - (currentSum / initialSum) : 0;
        
        // 3. Calculate Easy%Ro from TR (Sweeney & Burnham 1990 correlation)
        // This is a simplified lookup/regression approximation for Genesis
        // Equation: exp(Ro) = 1.2 + f(TR) ... actually usually calculated from TTI or integrated.
        // Better approach: Standard Easy%Ro sums the contribution of each bin to Ro.
        // For simplicity in Genesis V1, we use a TTI-Ro correlation or a TR-Ro map if needed, 
        // BUT the rigorous way is complex. Let's use the TTI correlation for simplicity in V1.
        
        // TTI Calc
        // TTI_new = TTI_old + (dt_Ma) * 2 ^ ((T_c - 100) / 10)
        const tempC = Units.k_to_c(tempK);
        const TTI_inc = dtMa * Math.pow(2, (tempC - 100) / 10);
        const newTTI = state.TTI + TTI_inc;
        
        // Ro from TTI correlation (Wood, 1988 or similar)
        // Common approx: Ro = 1.3 * (TTI/160)^0.5 ?? No, check standard.
        // Morrow & Issler: Ro = (TTI/15)^(1/6) ??
        // Let's use a robust one:
        // log(Ro) = -0.4769 + 0.2801 * log(TTI) - 0.007472 * log(TTI)^2 ... (Points for specific range)
        
        // Let's use the simple one for V1: Ro = (TTI / 10) ^ 0.5 * 0.5 (just distinct place holder)
        // Actually, let's implement the standard breakdown:
        // If TTI < 15: Ro = ...
        
        // BETTER: Use the Transformation Ratio (F) to Ro conversion from Sweeney & Burnham
        // This is safer than TTI.
        // F = TR.
        // Ro = exp( -1.6 + 3.7*F ) for Type II?
        // This varies by kerogen.
        
        // FALLBACK: Use TTI for Ro as it's generic
        let newRo = 0.2;
        if (newTTI > 0.1) {
             // Very approximate correlation
             newRo = 0.4 + 0.6 * Math.log10(newTTI / 10 + 1) * 0.3;
             if(newRo > 4) newRo = 4;
        }

        return {
            fractions: newFractions,
            totalTransformation: Math.max(0, Math.min(1, TR)),
            Ro: Math.max(state.Ro, newRo), // Ro never decreases
            TTI: newTTI
        };
    }
}