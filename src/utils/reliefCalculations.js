const API_ORIFICES = [
  { orifice: 'D', area: 0.110 }, { orifice: 'E', area: 0.196 },
  { orifice: 'F', area: 0.307 }, { orifice: 'G', area: 0.503 },
  { orifice: 'H', area: 0.785 }, { orifice: 'J', area: 1.287 },
  { orifice: 'K', area: 1.838 }, { orifice: 'L', area: 2.853 },
  { orifice: 'M', area: 3.600 }, { orifice: 'N', area: 4.340 },
  { orifice: 'P', area: 6.380 }, { orifice: 'Q', area: 11.050 },
  { orifice: 'R', area: 16.000 }, { orifice: 'T', area: 26.000 },
];

const findOrifice = (requiredArea) => {
  const selected = API_ORIFICES.find(o => o.area >= requiredArea);
  if (!selected) {
    return API_ORIFICES[API_ORIFICES.length - 1];
  }
  return selected;
};

const gasVaporSizing = (inputs) => {
  const { flowRate, pressure, temperature, mw, z, k } = inputs;
  
  if (flowRate <= 0 || pressure <= 0 || temperature <= -460 || mw <= 0 || z <= 0 || k <= 0) {
    throw new Error("Invalid input for Gas/Vapor sizing. All values must be positive.");
  }

  const P1 = pressure + 14.7; // Convert psig to psia
  const T_abs = temperature + 460; // Convert F to Rankine

  const C = 520 * Math.sqrt(k * Math.pow(2 / (k + 1), (k + 1) / (k - 1)));
  if (isNaN(C) || C <= 0) throw new Error("Could not calculate constant C. Check k value.");
  
  const Kd = 0.975; // Discharge coefficient for vapor
  const Kb = 1.0;   // Back pressure correction factor (assumed for simplicity)
  const Kc = 1.0;   // Combination correction factor

  const requiredArea = (flowRate * Math.sqrt(T_abs * z)) / (C * Kd * P1 * Kb * Kc * Math.sqrt(mw));
  
  const massFlux = (C * P1 * Math.sqrt(mw / (T_abs * z))) / 3600;

  return { 
    requiredArea,
    massFlux,
    reliefLoad: flowRate,
    relievingPressure: P1,
    scenario: "Gas / Vapor"
  };
};

const liquidSizing = (inputs) => {
  const { flowRate, inletPressure, outletPressure, density } = inputs;
  if(flowRate <= 0 || inletPressure <= 0 || density <=0) {
      throw new Error("Invalid input for Liquid sizing. Flow rate, pressure, and density must be positive.");
  }

  const P1 = inletPressure;
  const P2 = outletPressure;
  const G = density / 62.4; // specific gravity
  const Kd = 0.62; // Discharge coefficient for liquids
  const Kw = 1.0; // Back pressure correction factor
  const Kc = 1.0; // Combination correction factor
  const Kv = 1.0; // Viscosity correction factor (simplified)

  const requiredArea = (flowRate * Math.sqrt(G)) / (38 * Kd * Kw * Kc * Kv * Math.sqrt(P1 - P2));
  
  return { 
      requiredArea,
      massFlux: null,
      reliefLoad: flowRate * 500 * G, // Approximate conversion to lb/hr
      relievingPressure: P1 + 14.7,
      scenario: "Liquid"
  };
};

const fireVaporSizing = (inputs) => {
    const { heatInput, latentHeat, temperature, mw, k, z } = inputs;
    if(heatInput <= 0 || latentHeat <= 0 || temperature <= -460 || mw <= 0 || k <= 0 || z <= 0) {
        throw new Error("Invalid input for Fire case. All values must be positive.");
    }
    const W = heatInput / latentHeat;
    
    const gasInputs = {
        flowRate: W,
        pressure: 100,
        temperature,
        mw,
        k,
        z
    };
    
    const result = gasVaporSizing(gasInputs);
    result.scenario = "Fire (Vapor Generation)";
    result.reliefLoad = W;
    return result;
}

export const calculatePsvSizing = (inputs) => {
  let result;
  switch (inputs.scenario) {
    case 'gasVapor':
      result = gasVaporSizing(inputs);
      break;
    case 'liquid':
      result = liquidSizing(inputs);
      break;
    case 'fireVapor':
        result = fireVaporSizing(inputs);
        break;
    default:
      throw new Error('Invalid or unsupported scenario selected.');
  }

  if (isNaN(result.requiredArea) || result.requiredArea <= 0) {
    throw new Error('Calculation resulted in an invalid area. Please check your inputs.');
  }

  const selectedOrifice = findOrifice(result.requiredArea);

  return {
    ...result,
    selectedOrifice,
  };
};

export const calculateDepressuring = (inputs) => {
    const { vesselVolume, initialPressure, initialTemperature, finalPressure, fluidMW, fluidK, fluidZ, orificeDiameter } = inputs;

    if (vesselVolume <= 0 || initialPressure <= 0 || initialTemperature <= -460 || finalPressure < 0 || fluidMW <= 0 || fluidK <= 0 || fluidZ <= 0 || orificeDiameter <= 0) {
        throw new Error("Invalid input for Depressuring simulation. All values must be positive.");
    }

    const R = 1545.349 / fluidMW; // Specific gas constant, ft·lbf/(lb·°R)
    let p = initialPressure + 14.7; // current pressure, psia
    let T = initialTemperature + 460; // current temperature, Rankine
    const pFinal = finalPressure + 14.7;
    const orificeArea = (Math.PI / 4) * Math.pow(orificeDiameter / 12, 2); // orifice area in ft^2
    const Cd = 0.85;
    const A_eff = Cd * orificeArea;
    let time = 0;
    const timeStep = 0.1;
    const maxTime = 3600;
    const timeData = [0];
    const pressureData = [p];
    const temperatureData = [T];
    const initialMoles = (p * 144 * vesselVolume) / (fluidZ * R * T * fluidMW);
    let moles = initialMoles;

    while (p > pFinal && time < maxTime) {
        const C = 520 * Math.sqrt(fluidK * Math.pow(2 / (fluidK + 1), (fluidK + 1) / (fluidK - 1)));
        const flowRateLbsHr = (C * 0.975 * p * A_eff * 144) * Math.sqrt(fluidMW / (T * fluidZ));
        const flowRateLbsSec = flowRateLbsHr / 3600;
        const molesOut = (flowRateLbsSec * timeStep) / fluidMW;
        if (moles - molesOut <= 0) break;
        moles -= molesOut;
        const newT = T * Math.pow(moles / (moles + molesOut), fluidK - 1);
        const newP = (moles * fluidZ * R * newT * fluidMW) / (vesselVolume * 144);
        p = newP;
        T = newT;
        time += timeStep;
        if (timeData.length % 10 === 0) {
            timeData.push(time);
            pressureData.push(p);
            temperatureData.push(T);
        }
    }
    
    if (time >= maxTime) {
        throw new Error("Simulation timed out. Check inputs, final pressure may be too low.");
    }

    return { timeToFinalPressure: time, timeData, pressureData, temperatureData };
};

export const calculateRadiation = (inputs) => {
    const { heatRelease, distance, fractionRadiated, transmissivity } = inputs;
    if (heatRelease <= 0 || distance <= 0 || fractionRadiated <= 0 || transmissivity <= 0) {
        throw new Error("Invalid input for Radiation check. All values must be positive.");
    }

    const Q = heatRelease * 1000; // Convert MW to kW
    const R = distance; // Distance in meters

    // API 521 Point Source Model
    const radiationIntensity = (transmissivity * fractionRadiated * Q) / (4 * Math.PI * Math.pow(R, 2));

    let level, description, levelColor;
    if (radiationIntensity <= 1.58) {
        level = "SAFE";
        description = "Safe for continuous exposure. No time limit for personnel.";
        levelColor = "border-green-500 text-green-400";
    } else if (radiationIntensity <= 4.73) {
        level = "LOW RISK";
        description = "Permissible for emergency actions of several minutes.";
        levelColor = "border-yellow-500 text-yellow-400";
    } else if (radiationIntensity <= 6.31) {
        level = "MODERATE RISK";
        description = "Sufficient to cause pain in 15-20 seconds. Escape is critical.";
        levelColor = "border-orange-500 text-orange-400";
    } else if (radiationIntensity <= 9.46) {
        level = "HIGH RISK";
        description = "Causes second-degree burns in seconds. Immediate escape required.";
        levelColor = "border-red-500 text-red-400";
    } else {
        level = "EXTREME DANGER";
        description = "Potentially lethal within a short time. Unsurvivable without protection.";
        levelColor = "border-red-700 text-red-500";
    }

    return { radiationIntensity, level, description, levelColor };
};