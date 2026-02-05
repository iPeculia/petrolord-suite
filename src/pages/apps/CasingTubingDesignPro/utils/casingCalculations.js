// Casing Calculation Engine

export const calculateMargins = (section, loadCase, safetyFactors) => {
    if (!section || !loadCase) return null;

    // 1. Determine Depths
    const topDepth = parseFloat(section.top_depth);
    const bottomDepth = parseFloat(section.bottom_depth);
    const midDepth = (topDepth + bottomDepth) / 2;

    // 2. Mock Pressure Calculations (Simplified Physics)
    // Internal Pressure (Pi) = Surface Pressure + Hydrostatic Head
    const fluidDensity = loadCase.internal_fluid_density || 8.5; // ppg
    const surfacePressure = loadCase.surface_pressure || 0; // psi
    const pi_bottom = surfacePressure + (0.052 * fluidDensity * bottomDepth * 3.28084); // 3.28084 ft/m
    const pi_top = surfacePressure + (0.052 * fluidDensity * topDepth * 3.28084);

    // External Pressure (Pe) = Pore Pressure or Mud Gradient
    // Assuming a generic pore pressure gradient of 9.0 ppg for simplicity if not provided
    const extGradient = 9.0; // ppg
    const pe_bottom = 0.052 * extGradient * bottomDepth * 3.28084;
    const pe_top = 0.052 * extGradient * topDepth * 3.28084;

    // 3. Differentials
    // Burst: Internal > External. Worst case at top usually (gas kick) or bottom (injection)
    // Simplification: Check max differential
    const diff_burst = Math.max(0, pi_bottom - pe_bottom); 
    
    // Collapse: External > Internal. Worst case at bottom usually (evacuation)
    const diff_collapse = Math.max(0, pe_bottom - pi_bottom);

    // Tension: Buoyed Weight + Overpull
    // Weight in air (approx): length * weight_per_m * g
    // Buoyancy Factor (BF) = 1 - (MW / 65.5) approx for steel
    const bf = 1 - (fluidDensity / 65.5);
    const sectionLength = bottomDepth - topDepth;
    const weightAir = sectionLength * section.weight; // kg
    const weightBuoyed = weightAir * bf;
    // Axial Load (Tension) from Load Case (e.g. overpull) + Weight
    const axialLoad = (loadCase.axial_force_klb || 0) * 1000 * 4.448; // Convert klb to N, then maybe kgf? Keeping simple units
    // Let's use simplified unitless or consistently Imperial/Metric.
    // Catalog Yield is usually PSI or Lbs. Let's assume Catalog is PSI for pressure, Lbs for tension.
    
    // Converting Section Properties from Catalog (which assumes API units often)
    // Catalog: Yield (PSI), Burst (PSI), Collapse (PSI), Tensile (Lbs)
    
    // Recalculate forces in Imperial for matching Catalog
    const depthFt = bottomDepth * 3.28084;
    const diff_burst_psi = Math.abs(pi_bottom - pe_bottom); // Worst diff
    const diff_collapse_psi = Math.abs(pe_bottom - pi_bottom); // Worst diff

    const weight_lb_ft = section.weight * 0.671969; // kg/m to lb/ft
    const length_ft = (bottomDepth - topDepth) * 3.28084;
    const string_weight_lbs = length_ft * weight_lb_ft;
    const tension_load_lbs = string_weight_lbs * bf + (loadCase.axial_force_klb || 0) * 1000;

    // 4. Margins (Safety Factors) = Rating / Load
    // Burst
    const burstRating = section.api_burst || 5000; // Default if missing
    const burstSF = diff_burst_psi > 0 ? (burstRating / diff_burst_psi) : 99.9;

    // Collapse
    const collapseRating = section.api_collapse || 4000; // Default if missing
    const collapseSF = diff_collapse_psi > 0 ? (collapseRating / diff_collapse_psi) : 99.9;

    // Tension
    const tensionRating = section.yield_strength || 500000; // Body Yield Strength in lbs (approx from catalog tensile)
    const tensionSF = tension_load_lbs > 0 ? (tensionRating / tension_load_lbs) : 99.9;

    // Buckling
    // Euler buckling check simplified: Is effective tension negative?
    // F_eff = F_axial + Pi*Ai - Pe*Ae. If < 0, compression.
    // Very simplified check:
    const isBuckling = tension_load_lbs < 0; // Simple compression check

    // Status
    let status = 'PASS';
    if (burstSF < safetyFactors.burst || collapseSF < safetyFactors.collapse || tensionSF < safetyFactors.tension) {
        status = 'FAIL';
    } else if (burstSF < safetyFactors.burst * 1.1 || collapseSF < safetyFactors.collapse * 1.1) {
        status = 'WARNING';
    }

    return {
        burstMargin: burstSF.toFixed(2),
        collapseMargin: collapseSF.toFixed(2),
        tensionMargin: tensionSF.toFixed(2),
        isBuckling: isBuckling ? 'Yes' : 'No',
        status: status,
        details: {
            diffBurst: Math.round(diff_burst_psi),
            diffCollapse: Math.round(diff_collapse_psi),
            tensionLoad: Math.round(tension_load_lbs)
        }
    };
};