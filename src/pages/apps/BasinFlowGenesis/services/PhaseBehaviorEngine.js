/**
 * Hydrocarbon Phase Behavior Engine
 * Determines the fluid type generated based on maturity
 */
export class PhaseBehaviorEngine {
    
    static determinePhase(Ro, kerogenType) {
        // Simplified windows
        // Type I/II: Oil -> Wet Gas -> Dry Gas
        // Type III: Gas mostly
        
        if (Ro < 0.5) return 'immature';
        
        if (kerogenType === 'type3') {
            if (Ro >= 0.7 && Ro < 1.3) return 'gas'; // Early gas
            if (Ro >= 1.3) return 'dry_gas';
            return 'immature';
        }
        
        // Type I & II
        if (Ro >= 0.5 && Ro < 1.0) return 'oil'; // Peak Oil
        if (Ro >= 1.0 && Ro < 1.3) return 'condensate'; // Wet Gas / Condensate
        if (Ro >= 1.3 && Ro < 2.6) return 'dry_gas';
        if (Ro >= 2.6) return 'overmature';
        
        return 'immature';
    }
    
    static getExpulsionEfficiency(saturation, threshold) {
        // Simple threshold model
        if (saturation <= threshold) return 0;
        return (saturation - threshold) / (1 - threshold);
    }
}