const STANDARD_PIPE_ODS = [2.375, 2.875, 3.5, 4.5, 5.5, 6.625, 8.625, 10.75, 12.75, 14, 16, 18, 20, 24, 30, 36];

const calculateFrictionFactor = (reynoldsNumber, roughness, diameter) => {
  if (reynoldsNumber < 2300) {
    return 64 / reynoldsNumber;
  }
  
  let f = 0.02;
  for (let i = 0; i < 10; i++) {
    const term1 = roughness / (3.7 * diameter);
    const term2 = 2.51 / (reynoldsNumber * Math.sqrt(f));
    f = 1 / Math.pow(-2 * Math.log10(term1 + term2), 2);
  }
  return f;
};

export const calculateLineSizing = (inputs) => {
  const {
    flowRate, // BPD
    liquidDensity, // lb/ft^3
    liquidViscosity, // cP
    pipeLength, // ft
    allowablePressureDrop, // psi
    minVelocity, // ft/s
    maxVelocity, // ft/s
    pipeRoughness, // ft
  } = inputs;

  const flowRateCfs = flowRate * 5.61458 / 86400; // BPD to ft^3/s

  let bestOD = null;
  let bestResult = {};

  for (const od of STANDARD_PIPE_ODS) {
    const id = od - 2 * 0.25; // Assuming a standard wall thickness for initial check
    const area = Math.PI * Math.pow(id / 12, 2) / 4; // in^2 to ft^2
    const velocity = flowRateCfs / area;

    if (velocity >= minVelocity && velocity <= maxVelocity) {
      const reynoldsNumber = (liquidDensity * velocity * (id / 12)) / (liquidViscosity * 0.000672);
      const frictionFactor = calculateFrictionFactor(reynoldsNumber, pipeRoughness, id / 12);
      
      const pressureDrop = (frictionFactor * pipeLength * liquidDensity * Math.pow(velocity, 2)) / ((id / 12) * 2 * 32.2 * 144);

      if (pressureDrop <= allowablePressureDrop) {
        if (!bestOD || od < bestOD) {
          bestOD = od;
          bestResult = {
            recommendedOD: od,
            internalDiameter: id,
            velocity,
            pressureDrop,
            reynoldsNumber,
            frictionFactor,
          };
        }
      }
    }
  }

  // If no pipe meets criteria, select smallest that meets velocity and show DP fail
  if (!bestOD) {
      for (const od of STANDARD_PIPE_ODS) {
        const id = od - 2 * 0.25;
        const area = Math.PI * Math.pow(id / 12, 2) / 4;
        const velocity = flowRateCfs / area;

        if (velocity <= maxVelocity) {
          const reynoldsNumber = (liquidDensity * velocity * (id/12)) / (liquidViscosity * 0.000672);
          const frictionFactor = calculateFrictionFactor(reynoldsNumber, pipeRoughness, id/12);
          const pressureDrop = (frictionFactor * pipeLength * liquidDensity * Math.pow(velocity, 2)) / ((id/12) * 2 * 32.2 * 144);
          
          return {
             recommendedOD: od,
             internalDiameter: id,
             velocity,
             pressureDrop,
             reynoldsNumber,
             frictionFactor,
          };
        }
      }
  }
  
  return bestResult.recommendedOD ? bestResult : {
    recommendedOD: 0,
    velocity: 0,
    pressureDrop: 0,
    message: "No suitable pipe size found. Adjust constraints."
  };
};

export const calculateMultiphaseHydraulics = (inputs) => {
    const { oilRate, waterCut, gor, pipeID, angle, pressure, temperature, oilDensity, waterDensity, gasDensity, oilViscosity, waterViscosity, gasViscosity, surfaceTension, pipeRoughness } = inputs;
    const g = 32.2; // ft/s^2
    const D = pipeID / 12; // ft
    const A = Math.PI * D * D / 4; // ft^2

    // Rates in ft^3/s
    const qo_stb_s = oilRate / 86400;
    const qg_scf_s = (oilRate * gor) / 86400;
    
    // For simplicity, using placeholder B-factors. A real model would calculate this from PVT.
    const Bo = 1.2; // rb/stb
    const Bg = 0.01; // rb/scf

    const qo = qo_stb_s * Bo * 5.61458; // oil flowrate in ft^3/s
    const qw = qo * waterCut / (1 - waterCut); // water flowrate in ft^3/s
    const qg = qg_scf_s * Bg * 5.61458; // gas flowrate in ft^3/s
    const ql = qo + qw; // liquid flowrate in ft^3/s

    // Superficial velocities (ft/s)
    const Vsl = ql / A;
    const Vsg = qg / A;
    const Vm = Vsl + Vsg; // Mixture velocity

    // Liquid properties
    const liquidFraction = qo / ql;
    const rho_l = oilDensity * liquidFraction + waterDensity * (1-liquidFraction);
    const mu_l = (oilViscosity * liquidFraction + waterViscosity * (1-liquidFraction)) * 0.000672; // convert cP to lb/ft-s

    // No-slip liquid holdup
    const lambda_l = ql / (ql + qg);

    // Beggs-Brill dimensionless numbers
    const Fr = Vm * Vm / (g * D);
    
    // Flow Pattern Map (Simplified Beggs-Brill Horizontal)
    const L1 = 316 * Math.pow(lambda_l, 0.302);
    const L2 = 0.000925 * Math.pow(lambda_l, -2.468);
    const L3 = 0.10 * Math.pow(lambda_l, -1.452);
    const L4 = 0.5 * Math.pow(lambda_l, -6.738);

    let flowRegime = '';
    if ((lambda_l < 0.01 && Fr < L1) || (lambda_l >= 0.01 && Fr < L2)) {
        flowRegime = 'Segregated';
    } else if ((lambda_l >= 0.01 && lambda_l < 0.4 && Fr > L3 && Fr <= L1) || (lambda_l >= 0.4 && Fr > L3 && Fr <= L4)) {
        flowRegime = 'Intermittent';
    } else if ((lambda_l < 0.4 && Fr >= L1) || (lambda_l >= 0.4 && Fr > L4)) {
        flowRegime = 'Distributed';
    } else {
        flowRegime = 'Transition';
    }

    // Liquid Holdup Calculation (Beggs-Brill)
    const a = { 'Segregated': 0.98, 'Intermittent': 0.845, 'Distributed': 1.065 }[flowRegime] || 1.0;
    const b = { 'Segregated': 0.4846, 'Intermittent': 0.5351, 'Distributed': 0.5824 }[flowRegime] || 1.0;
    const c = { 'Segregated': 0.0868, 'Intermittent': 0.0173, 'Distributed': 0.0609 }[flowRegime] || 1.0;
    
    const H_L0 = a * Math.pow(lambda_l, b) / Math.pow(Fr, c);

    // Inclination correction
    const C = (1 - lambda_l) * Math.log(0.011 * Math.pow(lambda_l, -3.768) * Math.pow(Vsl / Math.sqrt(g*D), 3.539) * Math.pow(1/(Vsg/Math.sqrt(g*D)), 1.614));
    const psi = 1 + C * (Math.sin(angle * Math.PI / 180) - 0.333 * Math.pow(Math.sin(angle * Math.PI / 180), 3));
    const H_L = H_L0 * psi;

    // Two-phase properties
    const rho_m = rho_l * H_L + gasDensity * (1-H_L); // mixture density
    const mu_m = mu_l * H_L + (gasViscosity * 0.000672) * (1-H_L);
    
    // Friction factor
    const Re_m = rho_m * Vm * D / mu_m;
    const f_m = calculateFrictionFactor(Re_m, pipeRoughness, D);

    // Pressure Gradient (psi/ft)
    const dP_f = (f_m * rho_m * Vm * Vm) / (2 * g * D * 144);
    const dP_h = rho_m * Math.sin(angle * Math.PI / 180) / 144;
    // Ignoring acceleration component for steady state
    const dP_total = dP_f + dP_h;

    return {
        flowRegime: flowRegime,
        liquidHoldup: H_L,
        totalGradient: dP_total,
        frictionalGradient: dP_f,
        hydrostaticGradient: dP_h,
        mixtureVelocity: Vm,
        froudeNumber: Fr,
        reynoldsNumber: Re_m,
    };
};

export const calculateWallThickness = (inputs) => {
    const { pipeOD, maop, smys, designFactor, jointFactor, tempDeratingFactor, corrosionAllowance } = inputs;
    
    // Barlow's formula for required thickness (ASME B31.4 / B31.8)
    const requiredThickness = (maop * pipeOD) / (2 * smys * designFactor * jointFactor * tempDeratingFactor);

    // Add corrosion allowance to get nominal thickness
    const nominalThickness = requiredThickness + corrosionAllowance;
    
    // Recalculate MAOP with the nominal thickness (minus corrosion allowance)
    const pressureContainingThickness = nominalThickness - corrosionAllowance;
    const maopWithNominal = (2 * smys * pressureContainingThickness * designFactor * jointFactor * tempDeratingFactor) / pipeOD;

    return {
        requiredThickness,
        nominalThickness,
        maopWithNominal
    };
};

export const calculatePiggingAnalysis = (inputs) => {
    const { pipeOD, bendRadius, pigVelocity, bendMultiplier } = inputs;

    // Bend radius check
    const minRadius = pipeOD * bendMultiplier;
    const bendRadiusCheck = {
        pass: bendRadius >= minRadius,
        minRadius: minRadius,
    };

    // Velocity check (typical range is 3-15 ft/s)
    let velocityMessage = 'Velocity is within the ideal range for effective pigging.';
    let velocityPass = true;
    if (pigVelocity < 3) {
        velocityMessage = 'Velocity is too low; may lead to poor cleaning and debris pickup.';
        velocityPass = false;
    } else if (pigVelocity > 15) {
        velocityMessage = 'Velocity is high; risk of pig damage and excessive wear.';
        velocityPass = false;
    }
    const velocityCheck = {
        pass: velocityPass,
        message: velocityMessage,
    };

    // Trap sizing hints
    // Rule of thumb: pig length is ~1.5 to 2.0 times OD. Let's use 1.75.
    // Handling length is ~1.0 times OD.
    const pigLengthFt = (1.75 * pipeOD) / 12;
    const handlingLengthFt = (1.0 * pipeOD) / 12;
    const trapSizing = {
        pigLength: pigLengthFt,
        handlingLength: handlingLengthFt,
    };

    return {
        bendRadiusCheck,
        velocityCheck,
        trapSizing
    };
};