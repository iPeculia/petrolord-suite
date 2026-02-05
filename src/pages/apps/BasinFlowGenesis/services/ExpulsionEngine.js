/**
 * Expulsion Engine
 * Calculates primary migration from source rock
 */
export class ExpulsionEngine {
    
    /**
     * Calculate expelled mass
     * @param {number} generatedMass - Mass generated in this step
     * @param {number} existingSaturation - Current HC saturation in pores
     * @param {number} porosity - Current porosity
     * @param {number} thresholdSat - Critical saturation for expulsion (e.g., 0.2)
     * @returns {Object} { expelled, retained, newSaturation }
     */
    static calculateExpulsion(generatedMass, existingMass, porosity, volume, densityHC, thresholdSat = 0.1) {
        const totalMass = existingMass + generatedMass;
        
        // Convert mass to volume to check saturation
        // Vol_HC = Mass / Density
        const volHC = totalMass / densityHC;
        const poreVolume = volume * porosity;
        const saturation = volHC / poreVolume;
        
        let expelledMass = 0;
        let retainedMass = totalMass;
        let newSaturation = saturation;
        
        if (saturation > thresholdSat) {
            // Expel excess
            // Keep saturation at threshold (simplified 'bucket' model)
            // In reality, permeability limits flow, but for Genesis V1 bucket is fine.
            const retainedVol = poreVolume * thresholdSat;
            retainedMass = retainedVol * densityHC;
            expelledMass = totalMass - retainedMass;
            newSaturation = thresholdSat;
        }
        
        return {
            expelledMass,
            retainedMass,
            newSaturation
        };
    }
}