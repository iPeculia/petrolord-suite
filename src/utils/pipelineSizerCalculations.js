import { toast } from '@/components/ui/use-toast';

const G = 9.81; // m/s^2

const calculateFrictionFactor = (reynoldsNumber, relativeRoughness) => {
  if (reynoldsNumber < 2300) {
    return 64 / reynoldsNumber;
  }
  
  const term1 = relativeRoughness / 3.7;
  const term2 = 6.9 / reynoldsNumber;
  const f = Math.pow(-1.8 * Math.log10(Math.pow(term1, 1.11) + term2), -2);
  
  return f;
};

export const calculateSinglePhaseLiquidHydraulics = (inputs) => {
  const {
    flowRate, // bbl/day
    density, // kg/m3
    viscosity, // cP
    pipeDiameter, // inch
    pipeLength, // km
    inletPressure, // bara
    roughness, // mm
  } = inputs;

  const q_m3_s = flowRate * 0.158987 / 86400;
  const D_m = pipeDiameter * 0.0254;
  const L_m = pipeLength * 1000;
  const mu_pa_s = viscosity * 0.001;
  const e_m = roughness * 0.001;

  const area = Math.PI * Math.pow(D_m, 2) / 4;
  const velocity = q_m3_s / area;

  if (velocity === 0) {
    return {
      pressureDrop: 0,
      outletPressure: inletPressure,
      velocity: 0,
      reynoldsNumber: 0,
      flowRegime: 'No Flow',
      pressureProfile: [{ distance: 0, pressure: inletPressure }, { distance: pipeLength, pressure: inletPressure }],
    };
  }

  const reynoldsNumber = (density * velocity * D_m) / mu_pa_s;
  
  let flowRegime = 'Turbulent';
  if (reynoldsNumber < 2300) {
    flowRegime = 'Laminar';
  } else if (reynoldsNumber < 4000) {
    flowRegime = 'Transitional';
  }

  const relativeRoughness = e_m / D_m;
  const frictionFactor = calculateFrictionFactor(reynoldsNumber, relativeRoughness);

  const pressureDrop_pa = (frictionFactor * L_m * density * Math.pow(velocity, 2)) / (2 * D_m);
  const pressureDrop_bar = pressureDrop_pa / 100000;
  const outletPressure_bar = inletPressure - pressureDrop_bar;

  if (outletPressure_bar < 0) {
    toast({
        title: "Warning: High Pressure Drop",
        description: "Calculated outlet pressure is below zero. Check inputs.",
        variant: "destructive",
    });
  }

  const pressureProfile = [];
  const segments = 20;
  for (let i = 0; i <= segments; i++) {
      const dist = (pipeLength / segments) * i;
      const pDrop = (pressureDrop_bar / segments) * i;
      pressureProfile.push({ distance: dist.toFixed(2), pressure: (inletPressure - pDrop).toFixed(2) });
  }

  return {
    pressureDrop: pressureDrop_bar,
    outletPressure: outletPressure_bar > 0 ? outletPressure_bar : 0,
    velocity: velocity,
    reynoldsNumber: reynoldsNumber,
    flowRegime: flowRegime,
    frictionFactor: frictionFactor,
    pressureProfile: pressureProfile,
  };
};

export const calculateMultiphaseHydraulics = (inputs) => {
    const {
        flowRate, gasOilRatio, waterCut,
        oilDensity, waterDensity, gasGravity,
        oilViscosity, waterViscosity, gasViscosity,
        pipeDiameter, pipeLength, inletPressure, inletTemperature, roughness
    } = inputs;

    // --- Unit Conversions & Initial Calcs ---
    const D_m = pipeDiameter * 0.0254;
    const L_m = pipeLength * 1000;
    const e_m = roughness * 0.001;
    const P_avg_bara = inletPressure; // Simplification: use inlet P for initial properties
    const T_avg_K = inletTemperature + 273.15;

    const wc_frac = waterCut / 100;
    const oil_flow_bpd = flowRate * (1 - wc_frac);
    const water_flow_bpd = flowRate * wc_frac;
    const gas_flow_scfd = oil_flow_bpd * gasOilRatio;

    const q_oil_m3s = oil_flow_bpd * 0.158987 / 86400;
    const q_water_m3s = water_flow_bpd * 0.158987 / 86400;
    const q_gas_scmsd = gas_flow_scfd * 0.0283168;
    
    // Simplified Z-factor and gas density
    const Z = 0.9; 
    const R = 8314.4; // J/kmol.K
    const M_air = 28.97; // kg/kmol
    const M_gas = gasGravity * M_air;
    const rho_gas = (P_avg_bara * 1e5 * M_gas) / (Z * R * T_avg_K);

    const q_gas_m3s = q_gas_scmsd / 86400 * (1.01325 / P_avg_bara) * (T_avg_K / 288.15) * Z;

    const q_liquid_m3s = q_oil_m3s + q_water_m3s;
    const area = Math.PI * Math.pow(D_m, 2) / 4;

    const v_sl = q_liquid_m3s / area; // Superficial liquid velocity
    const v_sg = q_gas_m3s / area; // Superficial gas velocity
    const v_m = v_sl + v_sg; // Mixture velocity

    const lambda_l = q_liquid_m3s / (q_liquid_m3s + q_gas_m3s); // No-slip liquid holdup

    // Mixture properties
    const rho_l = oilDensity * (1 - wc_frac) + waterDensity * wc_frac;
    const mu_l_pas = (oilViscosity * (1 - wc_frac) + waterViscosity * wc_frac) * 0.001;
    const mu_g_pas = gasViscosity * 0.001;

    const rho_ns = rho_l * lambda_l + rho_gas * (1 - lambda_l); // No-slip density
    const mu_ns = mu_l_pas * lambda_l + mu_g_pas * (1 - lambda_l); // No-slip viscosity

    // --- Beggs & Brill Flow Pattern ---
    const Fr_m = Math.pow(v_m, 2) / (G * D_m);
    const L1 = 316 * Math.pow(lambda_l, 0.302);
    const L2 = 0.0009252 * Math.pow(lambda_l, -2.4684);
    const L3 = 0.10 * Math.pow(lambda_l, -1.4516);
    const L4 = 0.5 * Math.pow(lambda_l, -6.738);

    let flowPattern;
    if ((lambda_l < 0.01 && Fr_m < L1) || (lambda_l >= 0.01 && Fr_m < L2)) {
        flowPattern = 'Segregated';
    } else if ((lambda_l >= 0.01 && lambda_l < 0.4 && Fr_m > L3 && Fr_m <= L1) || (lambda_l >= 0.4 && Fr_m > L3 && Fr_m <= L4)) {
        flowPattern = 'Intermittent';
    } else if ((lambda_l >= 0.4 && Fr_m > L4) || (lambda_l < 0.4 && Fr_m > L1)) {
        flowPattern = 'Distributed';
    } else {
        flowPattern = 'Transition';
    }

    // --- Beggs & Brill Holdup ---
    let a, b, c;
    if (flowPattern === 'Segregated') { a = 0.98; b = 0.4846; c = 0.0868; }
    else if (flowPattern === 'Intermittent') { a = 0.845; b = 0.5351; c = 0.0173; }
    else if (flowPattern === 'Distributed') { a = 1.065; b = 0.5824; c = 0.0609; }
    else { a = 0.845; b = 0.5351; c = 0.0173; } // Transition as Intermittent

    const N_vl = v_sl * Math.sqrt(rho_l / (G * 0.072)); // Liquid velocity number (sigma=0.072 N/m)
    const H_L0 = a * Math.pow(lambda_l, b) / Math.pow(Fr_m, c);
    const C = (1 - lambda_l) * Math.log(0.011 * Math.pow(N_vl, 3.539) / Math.pow(lambda_l, 3.768) * Math.pow(Fr_m, 1.614));
    const psi = Math.max(1, C);
    const H_L = H_L0 * psi; // Liquid Holdup

    // --- Pressure Gradient Calculation ---
    const rho_s = rho_l * H_L + rho_gas * (1 - H_L); // Slip density
    const Re_ns = (rho_ns * v_m * D_m) / mu_ns;
    const f_ns = calculateFrictionFactor(Re_ns, e_m / D_m);
    const y = lambda_l / Math.pow(H_L, 2);
    const s = Math.log(y) / (-0.0523 + 3.182 * Math.log(y) - 0.8725 * Math.pow(Math.log(y), 2) + 0.01853 * Math.pow(Math.log(y), 4));
    const f_tp = f_ns * Math.exp(s);

    const dp_dl_friction = (f_tp * rho_ns * Math.pow(v_m, 2)) / (2 * D_m);
    const dp_dl_gravity = rho_s * G * 0; // Assuming horizontal pipe
    const dp_dl_total = dp_dl_friction + dp_dl_gravity;

    const pressureDrop_pa = dp_dl_total * L_m;
    const pressureDrop_bar = pressureDrop_pa / 100000;
    const outletPressure_bar = inletPressure - pressureDrop_bar;

    if (outletPressure_bar < 0) {
        toast({
            title: "Warning: High Pressure Drop",
            description: "Calculated outlet pressure is below zero. Check inputs.",
            variant: "destructive",
        });
    }
    
    const pressureProfile = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
        const dist = (pipeLength / segments) * i;
        const pDrop = (pressureDrop_bar / segments) * i;
        pressureProfile.push({ distance: dist.toFixed(2), pressure: (inletPressure - pDrop).toFixed(2) });
    }

    return {
        pressureDrop: pressureDrop_bar,
        outletPressure: outletPressure_bar > 0 ? outletPressure_bar : 0,
        liquidHoldup: H_L,
        mixtureVelocity: v_m,
        flowPattern: flowPattern,
        pressureProfile: pressureProfile,
    };
};

export const calculatePiggingAnalysis = (inputs, lineSizingResults) => {
  const {
    pipeDiameter, // inch
    pipeLength, // km
    roughness, // mm
    pigVelocity, // m/s
    initialSlugLength, // m
    waterCut,
    oilDensity,
    waterDensity,
    oilViscosity,
    waterViscosity,
  } = inputs;

  if (!lineSizingResults || typeof lineSizingResults.liquidHoldup === 'undefined') {
    throw new Error("Please run a Line Sizing calculation for multiphase flow first.");
  }

  const { liquidHoldup } = lineSizingResults;

  // --- Unit Conversions ---
  const L_m = pipeLength * 1000;
  const D_m = pipeDiameter * 0.0254;
  const e_m = roughness * 0.001;

  // --- Travel Time ---
  const travelTimeSeconds = L_m / pigVelocity;
  const travelTimeHours = travelTimeSeconds / 3600;

  // --- Slug Volume ---
  const area = Math.PI * Math.pow(D_m, 2) / 4;
  const accumulatedLiquidVolume = area * L_m * liquidHoldup;
  const initialSlugVolume = area * initialSlugLength;
  const totalSlugVolume_m3 = accumulatedLiquidVolume + initialSlugVolume;
  const slugVolumeBbl = totalSlugVolume_m3 * 6.28981;

  // --- Driving Pressure ---
  // Simplified model: pressure drop to move a liquid slug
  const wc_frac = waterCut / 100;
  const rho_l = oilDensity * (1 - wc_frac) + waterDensity * wc_frac;
  const mu_l_pas = (oilViscosity * (1 - wc_frac) + waterViscosity * wc_frac) * 0.001;

  const reynoldsNumber = (rho_l * pigVelocity * D_m) / mu_l_pas;
  const relativeRoughness = e_m / D_m;
  const frictionFactor = calculateFrictionFactor(reynoldsNumber, relativeRoughness);

  // Pressure drop over the total slug length
  const totalSlugLength = L_m * liquidHoldup + initialSlugLength;
  const pressureDrop_pa = (frictionFactor * totalSlugLength * rho_l * Math.pow(pigVelocity, 2)) / (2 * D_m);
  const drivingPressure_bar = pressureDrop_pa / 100000;

  return {
    travelTimeHours,
    slugVolumeBbl,
    drivingPressure: drivingPressure_bar,
  };
};

export const calculateSurgeAnalysis = (inputs, lineSizingResults) => {
    const {
        pipeDiameter, // inch
        pipeLength, // km
        pipeWallThickness, // mm
        pipeYoungsModulus, // GPa
        liquidBulkModulus, // GPa
        valveClosureTime, // s
        waterCut,
        oilDensity,
        waterDensity,
    } = inputs;

    if (!lineSizingResults || (typeof lineSizingResults.velocity === 'undefined' && typeof lineSizingResults.mixtureVelocity === 'undefined')) {
        throw new Error("Please run a Line Sizing calculation first to determine fluid velocity.");
    }

    const velocity = lineSizingResults.velocity ?? lineSizingResults.mixtureVelocity;

    // --- Unit Conversions ---
    const D_m = pipeDiameter * 0.0254;
    const t_m = pipeWallThickness * 0.001;
    const E_pa = pipeYoungsModulus * 1e9;
    const K_pa = liquidBulkModulus * 1e9;
    const L_m = pipeLength * 1000;

    // --- Liquid Density ---
    const wc_frac = waterCut / 100;
    const rho_l = oilDensity * (1 - wc_frac) + waterDensity * wc_frac;

    // --- Wave Speed Calculation ---
    const term1 = K_pa / rho_l;
    const term2 = 1 + (K_pa * D_m) / (E_pa * t_m);
    const waveSpeed = Math.sqrt(term1 / term2);

    // --- Joukowsky Equation ---
    const criticalTime = (2 * L_m) / waveSpeed;
    let maxSurgePressure_pa;

    if (valveClosureTime <= criticalTime) {
        // Instantaneous closure
        maxSurgePressure_pa = rho_l * waveSpeed * velocity;
    } else {
        // Slow closure (simplified)
        maxSurgePressure_pa = (rho_l * waveSpeed * velocity) * (criticalTime / valveClosureTime);
    }
    
    const maxSurgePressure_bar = maxSurgePressure_pa / 1e5;

    return {
        waveSpeed,
        maxSurgePressure: maxSurgePressure_bar,
        criticalTime,
    };
};