import * as Engine from './MaterialBalanceEngine';

/**
 * Calculates diagnostic terms (F, Eo, Eg, etc.) for each pressure data point.
 */
export const calculateDiagnosticData = (
  productionHistory,
  pressureData,
  pvtData,
  reservoirMetadata
) => {
  if (!pressureData.dates || pressureData.dates.length === 0) return [];
  if (!pvtData.pressure || pvtData.pressure.length === 0) return [];

  // 1. Identify Initial Conditions (Pi)
  // Assuming first pressure point is Pi or metadata has it.
  // If metadata datum pressure is set, use it, otherwise use max pressure from data as approximation for Pi if not explicit.
  // Better: Find point with earliest date.
  const sortedPressure = pressureData.dates.map((d, i) => ({
    date: d,
    P: pressureData.Pr[i],
    timestamp: new Date(d).getTime()
  })).sort((a, b) => a.timestamp - b.timestamp);

  if (sortedPressure.length === 0) return [];

  const Pi = sortedPressure[0].P; // Use first measured pressure as Pi
  const initialPVT = Engine.interpolatePVT(Pi, pvtData);
  const Boi = initialPVT.Bo;
  const Bgi = initialPVT.Bg;
  const Rsi = initialPVT.Rs;
  const Bw = 1.0; // Approximate if not provided

  const { cf, cw, Swi } = reservoirMetadata;

  const diagnosticPoints = [];

  // 2. Iterate through pressure history
  sortedPressure.forEach(pt => {
    const { P, date, timestamp } = pt;
    
    // Find cumulative production at this date
    // Linear interpolate production if needed, or find nearest.
    // Production history dates might not align perfectly.
    // Let's find the prod record on or just before this date.
    const prodIdx = productionHistory.dates.findIndex(d => d === date);
    
    let Np = 0, Gp = 0, Wp = 0;

    if (prodIdx !== -1) {
      Np = productionHistory.Np[prodIdx];
      Gp = productionHistory.Gp[prodIdx];
      Wp = productionHistory.Wp[prodIdx];
    } else {
      // Simple approach: find nearest preceding date
      const prodData = productionHistory.dates.map((d, i) => ({
        ts: new Date(d).getTime(),
        Np: productionHistory.Np[i],
        Gp: productionHistory.Gp[i],
        Wp: productionHistory.Wp[i]
      })).sort((a,b) => a.ts - b.ts);

      // Find latest record <= timestamp
      const rec = prodData.filter(d => d.ts <= timestamp).pop();
      if (rec) {
        Np = rec.Np;
        Gp = rec.Gp;
        Wp = rec.Wp;
      }
    }

    // 3. Get PVT at current P
    const pvt = Engine.interpolatePVT(P, pvtData);
    const deltaP = Pi - P;

    // 4. Calculate Terms
    // Oil
    const F = Engine.calculateF_Oil(Np, Gp, Wp, pvt.Bo, pvt.Bg, Bw, pvt.Rs);
    const Eo = Engine.calculateEo(pvt.Bo, Boi, pvt.Rs, Rsi, pvt.Bg);
    const Eg = Engine.calculateEg(Boi, pvt.Bg, Bgi);
    const Efw = Engine.calculateEfw(Boi, cw, cf, Swi, deltaP);
    const Et = Eo + Eg + Efw;

    // Gas (if applicable)
    // Assuming Z is not directly in PVT data usually, derived from Bg if needed.
    // Bg = 0.02827 * Z * T / P. So Z ~ P * Bg.
    // Let's calculate a pseudo p/z based on Bg
    // p/z proportional to 1/(Bg) roughly for plotting trends
    // Real p/z: (Pi/Zi) * (1 - Gp/G).
    // Let's store F_gas and Eg_gas too
    const F_gas = Engine.calculateF_Gas(Gp, pvt.Bg, Wp, Bw);
    const Eg_gas = Engine.calculateEg_Gas(pvt.Bg, Bgi);
    const P_over_Z = P / ( (P * pvt.Bg) / (Pi * Bgi) ); // Crude approximation if Z not explicit, assumes T constant

    diagnosticPoints.push({
      date,
      P,
      Np, Gp, Wp,
      F, Eo, Eg, Efw, Et,
      F_gas, Eg_gas, P_over_Z,
      // Ratios for plotting
      F_over_Eo: Eo !== 0 ? F / Eo : 0,
      Eg_over_Eo: Eo !== 0 ? Eg / Eo : 0,
    });
  });

  return diagnosticPoints;
};

/**
 * Performs linear regression y = mx + c
 */
export const calculateLinearRegression = (data, xKey, yKey) => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

  data.forEach(pt => {
    const x = pt[xKey];
    const y = pt[yKey];
    sumX += x;
    sumY += y;
    sumXY += (x * y);
    sumXX += (x * x);
    sumYY += (y * y);
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const ssTot = sumYY - (sumY * sumY) / n;
  const ssRes = sumYY - intercept * sumY - slope * sumXY; // Simplified form check
  
  // Better R2 calc:
  // R2 = 1 - (SSres / SStot)
  let ssResReal = 0;
  data.forEach(pt => {
    const fi = intercept + slope * pt[xKey];
    ssResReal += (pt[yKey] - fi) ** 2;
  });
  
  const r2 = ssTot !== 0 ? 1 - (ssResReal / ssTot) : 0;

  return { slope, intercept, r2 };
};