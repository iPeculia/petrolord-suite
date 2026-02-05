/**
 * Unit Converter utilities for Material Balance Pro
 */

export const convertPressure = (value, fromUnit, toUnit) => {
  if (!value || fromUnit === toUnit) return value;
  
  let psiValue;
  
  // Convert to PSI
  switch (fromUnit) {
    case 'psia': psiValue = value; break;
    case 'psig': psiValue = value + 14.7; break;
    case 'bar': psiValue = value * 14.5038; break;
    case 'kPa': psiValue = value * 0.145038; break;
    case 'atm': psiValue = value * 14.6959; break;
    default: psiValue = value;
  }

  // Convert from PSI to target
  switch (toUnit) {
    case 'psia': return psiValue;
    case 'psig': return psiValue - 14.7;
    case 'bar': return psiValue / 14.5038;
    case 'kPa': return psiValue / 0.145038;
    case 'atm': return psiValue / 14.6959;
    default: return psiValue;
  }
};

export const convertVolume = (value, fromUnit, toUnit) => {
  if (!value || fromUnit === toUnit) return value;

  let bblValue;

  // Convert to bbl (or cubic ft, keep consistent base)
  // Using bbl as base
  switch (fromUnit) {
    case 'STB':
    case 'bbl':
    case 'RB': bblValue = value; break;
    case 'm3': bblValue = value * 6.28981; break;
    case 'scf': bblValue = value / 5.615; // Approximation for gas volume equivalent? usually gas is separate. 
    // For simplicity assuming liquid volume conversion here
    case 'cf': bblValue = value / 5.615; break; 
    default: bblValue = value;
  }

  switch (toUnit) {
    case 'STB':
    case 'bbl':
    case 'RB': return bblValue;
    case 'm3': return bblValue / 6.28981;
    case 'cf': return bblValue * 5.615;
    default: return bblValue;
  }
};

export const convertArea = (value, fromUnit, toUnit) => {
  if (!value || fromUnit === toUnit) return value;

  let acresValue;

  switch (fromUnit) {
    case 'acres': acresValue = value; break;
    case 'ft2': acresValue = value / 43560; break;
    case 'km2': acresValue = value * 247.105; break;
    case 'm2': acresValue = value * 0.000247105; break;
    default: acresValue = value;
  }

  switch (toUnit) {
    case 'acres': return acresValue;
    case 'ft2': return acresValue * 43560;
    case 'km2': return acresValue / 247.105;
    case 'm2': return acresValue / 0.000247105;
    default: return acresValue;
  }
};

export const convertDepth = (value, fromUnit, toUnit) => {
  if (!value || fromUnit === toUnit) return value;

  let ftValue;

  switch (fromUnit) {
    case 'ft': ftValue = value; break;
    case 'm': ftValue = value * 3.28084; break;
    default: ftValue = value;
  }

  switch (toUnit) {
    case 'ft': return ftValue;
    case 'm': return ftValue / 3.28084;
    default: return ftValue;
  }
};

export const convertViscosity = (value, fromUnit, toUnit) => {
  if (!value || fromUnit === toUnit) return value;
  // Base is cp
  let cpValue = value;
  if (fromUnit === 'Pa.s') cpValue = value * 1000;
  
  if (toUnit === 'Pa.s') return cpValue / 1000;
  return cpValue;
};