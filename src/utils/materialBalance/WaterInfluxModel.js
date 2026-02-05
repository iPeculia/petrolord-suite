/**
 * Water Influx Models for Material Balance Analysis
 */

// --- Helper Functions ---

export const calculateDimensionlessTime = (t, phi, ct, mu, k, re) => {
  // t: time (days)
  // phi: porosity (fraction)
  // ct: total compressibility (1/psi)
  // mu: water viscosity (cp)
  // k: permeability (md)
  // re: aquifer radius (ft)
  
  // Constant 0.006328 for field units (t in days, k in md, mu in cp, ct in 1/psi, r in ft)
  // tD = 0.006328 * k * t / (phi * mu * ct * re^2)
  if (!phi || !ct || !mu || !re) return 0;
  return (0.006328 * k * t) / (phi * mu * ct * (re * re));
};

// --- Models ---

/**
 * Simple Linear Aquifer Model
 * We = U * (Pi - P) * t ? Or just rate?
 * Schilthuis Steady State: dWe/dt = J * (Pi - P)
 * We_cum = Sum(J * (Pi - P_avg) * dt)
 */
export const calculateSchilthuisInflux = (timeSteps, pressureHistory, J, Pi) => {
  // timeSteps: array of dates or time values
  // pressureHistory: array of pressures corresponding to timeSteps
  // J: aquifer productivity index (bbl/day/psi)
  
  if (!timeSteps || !pressureHistory || timeSteps.length !== pressureHistory.length) return [];

  let We_cum = 0;
  const We_profile = [0];

  for (let i = 1; i < timeSteps.length; i++) {
    const t_prev = new Date(timeSteps[i-1]).getTime();
    const t_curr = new Date(timeSteps[i]).getTime();
    const dt_days = (t_curr - t_prev) / (1000 * 60 * 60 * 24);
    
    const p_avg = (pressureHistory[i] + pressureHistory[i-1]) / 2;
    const dWe = J * (Pi - p_avg) * dt_days;
    
    We_cum += Math.max(0, dWe); // Assuming influx only, not outflow
    We_profile.push(We_cum);
  }

  return We_profile;
};

/**
 * Fetkovich Pseudo-Steady State Aquifer
 * Finite aquifer with limited connectivity.
 * We = Wei * (1 - exp(-J * Pi * t / Wei)) ... simplified approx for constant P?
 * Standard step-wise calculation used.
 */
export const calculateFetkovichInflux = (timeSteps, pressureHistory, J, Wei, Pi) => {
  // Wei: Maximum encroach-able water (bbl) = c_t * W_i * Pi
  // J: Productivity index
  
  if (!timeSteps || !pressureHistory) return [];
  
  let We_cum = 0;
  const We_profile = [0];
  let p_prev_aquifer = Pi; // Initial aquifer pressure

  for (let i = 1; i < timeSteps.length; i++) {
    const t_prev = new Date(timeSteps[i-1]).getTime();
    const t_curr = new Date(timeSteps[i]).getTime();
    const dt_days = (t_curr - t_prev) / (1000 * 60 * 60 * 24);
    
    const p_res_avg = (pressureHistory[i] + pressureHistory[i-1]) / 2;
    
    // Calculate step influx
    // dWe = (Wei / Pi) * (p_prev_aquifer - p_res_avg) * (1 - Math.exp(-J * Pi * dt_days / Wei))
    
    // Need to update aquifer pressure
    // p_avg_aquifer = p_res_avg + (p_prev_aquifer - p_res_avg) * exp(...)
    
    if (Wei <= 0) {
        We_profile.push(0);
        continue;
    }

    const exponent = -(J * Pi * dt_days) / Wei;
    const term = 1 - Math.exp(exponent);
    
    const dWe = (Wei / Pi) * (p_prev_aquifer - p_res_avg) * term;
    
    We_cum += Math.max(0, dWe);
    We_profile.push(We_cum);
    
    // Update aquifer pressure by material balance on aquifer
    // p_new_aquifer = Pi * (1 - We_cum / Wei)
    p_prev_aquifer = Pi * (1 - We_cum / Wei);
  }

  return We_profile;
};

/**
 * Van Everdingen-Hurst Unsteady State
 * Requires solving superposition of dimensionless terms.
 * Simplified stub for now using linear approximation or lookups.
 * Real implementation needs infinite series solution or table lookup.
 */
export const calculateVEHInflux = (timeSteps, pressureHistory, B, tD_coeff, Pi) => {
  // B: Water influx constant (bbl/psi)
  // tD_coeff: Coefficient to convert real time to dimensionless time
  
  // Stub: Using a simplified proxy (e.g. square root of time approx for infinite acting)
  // We ~ B * sum( dP * Q(tD) )
  
  let We_cum = 0;
  const We_profile = [0];
  
  // Very basic Carter-Tracy approximation for infinite acting often used instead of full VEH superposition
  // For Phase 4, we'll fallback to Schilthuis if full VEH math is too heavy for client JS without tables
  // Or use a simplified "Carter-Tracy" loop.
  
  // Carter-Tracy Logic (Approximate):
  // We(n) = We(n-1) + (B * dt * (Pn-1 - Pn_res)) ... 
  
  // Let's return 0s for now or fallback to Schilthuis behavior with B as J
  return calculateSchilthuisInflux(timeSteps, pressureHistory, B * 0.1, Pi); 
};