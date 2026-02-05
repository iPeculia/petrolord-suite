/**
 * Kerogen Kinetics Library for Easy%Ro (Burnham & Sweeney, 1989)
 * Arrhenius parameters: A (frequency factor) and E (activation energy)
 * Simplified for this implementation to standard Easy%Ro parameters which use a distribution of E.
 */

// Standard Easy%Ro Activation Energies (kcal/mol)
export const ActivationEnergies = [34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72];

// Frequency Factor A (s^-1) is typically constant for Easy%Ro
export const FrequencyFactor = 1.0e13; 

// Stoichiometric factors (Initial potentials) for different kerogen types
// Represents the fraction of kerogen that reacts at each activation energy
export const KerogenKinetics = {
  type1: {
    // Green River Shale type (Oil prone)
    potentials: [0, 0, 0, 0, 0, 0.01, 0.04, 0.09, 0.18, 0.25, 0.22, 0.13, 0.06, 0.02, 0.0, 0, 0, 0, 0, 0],
    description: "Type I (Lacustrine)"
  },
  type2: {
    // Standard Marine Shale (Oil/Gas prone) - Typical Easy%Ro standard
    potentials: [0, 0, 0, 0, 0, 0, 0.01, 0.05, 0.11, 0.17, 0.22, 0.19, 0.13, 0.07, 0.03, 0.02, 0, 0, 0, 0],
    description: "Type II (Marine)"
  },
  type3: {
    // Terrestrial (Gas prone)
    potentials: [0, 0, 0, 0, 0, 0, 0, 0, 0.01, 0.03, 0.06, 0.10, 0.14, 0.17, 0.18, 0.15, 0.10, 0.04, 0.02, 0],
    description: "Type III (Terrestrial)"
  },
  default: {
    // Defaults to Type II if unknown
    potentials: [0, 0, 0, 0, 0, 0, 0.01, 0.05, 0.11, 0.17, 0.22, 0.19, 0.13, 0.07, 0.03, 0.02, 0, 0, 0, 0],
    description: "Type II (Default)"
  }
};

export const getKerogenParams = (type) => {
    // Clean input string like "Type II" -> "type2"
    if(!type) return KerogenKinetics.default;
    const cleanType = type.toLowerCase().replace(/\s+/g, '');
    if (cleanType.includes('typei') && !cleanType.includes('typeii') && !cleanType.includes('typeiii')) return KerogenKinetics.type1;
    if (cleanType.includes('typeii') && !cleanType.includes('typeiii')) return KerogenKinetics.type2;
    if (cleanType.includes('typeiii')) return KerogenKinetics.type3;
    
    return KerogenKinetics[cleanType] || KerogenKinetics.default;
};