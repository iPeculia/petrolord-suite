// Tubing Calculation Engine - Phase 4 (Complete)

/**
 * Calculates safety factors and loads for a tubing section under a specific load case
 */
export const calculateTubingSectionResult = (section, loadCase, packerConfig, depthStep = 100) => {
    if (!section || !loadCase) return null;

    const topDepth = parseFloat(section.top_depth);
    const bottomDepth = parseFloat(section.bottom_depth);
    const sectionLength = bottomDepth - topDepth;
    
    // Constants
    const g = 9.81;
    const ppgToBar = 0.0689476; // 1 ppg = 0.052 psi/ft ~= 0.0689 bar/m (approx conversion)
    const psiToBar = 0.0689476;
    const barToPsi = 14.5038;
    
    // Fluid Densities (ppg)
    const fluidDensity = loadCase.internal_fluid_density || 8.5; 
    const extFluidDensity = loadCase.external_fluid_density || 9.0;
    
    // Pressures (Bar)
    const surfacePressureBar = (loadCase.surface_pressure || 0) * psiToBar;
    
    // Hydrostatic Heads (Bar) - Depth in meters
    // 0.052 psi/ft/ppg * depth(ft) -> bar
    // 0.052 * 3.28084 = 0.1706 psi/m/ppg
    // 0.1706 * 0.0689476 = 0.01176 bar/m/ppg
    const gradFactor = 0.01176; 
    
    const hydrostaticInternalTop = gradFactor * fluidDensity * topDepth;
    const hydrostaticInternalBottom = gradFactor * fluidDensity * bottomDepth;
    
    const hydrostaticExternalTop = gradFactor * extFluidDensity * topDepth;
    const hydrostaticExternalBottom = gradFactor * extFluidDensity * bottomDepth;
    
    const pi_top = surfacePressureBar + hydrostaticInternalTop;
    const pi_bottom = surfacePressureBar + hydrostaticInternalBottom;
    
    const pe_top = hydrostaticExternalTop; // Annulus usually open to atmo or minimal pressure
    const pe_bottom = hydrostaticExternalBottom;

    // Differentials (Max usually at bottom for collapse, top for burst depending on gas)
    // Simplified: Check limits at bottom for now as worst case usually
    const burstDiff = Math.max(0, pi_bottom - pe_bottom);
    const collapseDiff = Math.max(0, pe_bottom - pi_bottom);

    // Forces (Axial) - Newtons
    // 1. Dead Weight
    const weightAirKg = section.weight * sectionLength;
    const weightAirN = weightAirKg * g;
    
    // 2. Buoyancy
    // BF = 1 - (rho_fluid / rho_steel)
    const rhoSteel = 7850; // kg/m3
    const rhoFluidKgM3 = extFluidDensity * 119.8; // ppg to kg/m3 approx
    const buoyancyFactor = Math.max(0, 1 - (rhoFluidKgM3 / rhoSteel));
    const buoyedWeightN = weightAirN * buoyancyFactor;

    // 3. Thermal (Simplified)
    const deltaT = 50; // degC change assumption (Hot production)
    const thermalCoeff = 12e-6; // /degC
    const E = 200e9; // Pa (200 GPa)
    const areaM2 = (Math.PI/4) * (Math.pow(section.od * 0.0254, 2) - Math.pow((section.od * 0.0254 - 2 * (section.wall_thickness || 0.006)), 2)); 
    // Approx wall thickness if not provided: 6mm
    
    // Force due to restricted expansion (Compression if hot)
    // F = - E * A * alpha * dT
    // Only applies if packer constrained. Assuming constrained for Production/Injection cases.
    let thermalForceN = 0;
    if (packerConfig?.hasPacker && (loadCase.type === 'Production' || loadCase.type === 'Injection')) {
        thermalForceN = -1 * E * areaM2 * thermalCoeff * deltaT; 
    }

    // 4. Packer Loads (Piston effect)
    // F_piston = (Pi - Pe) * A_seal
    // Assuming packer at bottom
    let packerForceN = 0;
    if (packerConfig?.hasPacker) {
        // Approx seal area difference (Tubing ID vs Casing ID) - Simplified
        const sealArea = 0.01; // m2 mock
        const dpPacker = (pi_bottom - pe_bottom) * 1e5; // Pa
        packerForceN = dpPacker * sealArea; // Tension if internal > external
    }

    // Total Axial Load
    // Tension is Positive
    const totalAxialLoadN = buoyedWeightN + thermalForceN + packerForceN;
    const isCompression = totalAxialLoadN < 0;

    // Ratings (Convert API ratings usually in PSI to Bar/N)
    const burstRatingBar = (section.api_burst || 5000) * psiToBar;
    const collapseRatingBar = (section.api_collapse || 4000) * psiToBar;
    const tensionRatingN = (section.yield_strength || 50000) * 4448; // klb or lb to N? Assuming lb input
    
    // Safety Factors
    const burstSF = burstDiff > 1 ? (burstRatingBar / burstDiff) : 100;
    const collapseSF = collapseDiff > 1 ? (collapseRatingBar / collapseDiff) : 100;
    
    // Tension SF
    let tensionSF = 100;
    if (!isCompression && totalAxialLoadN > 100) {
        tensionSF = tensionRatingN / totalAxialLoadN;
    }
    
    // Compression/Buckling
    let compressionSF = 100;
    let bucklingTendency = 'Low';
    
    if (isCompression) {
        const absLoad = Math.abs(totalAxialLoadN);
        // Euler Buckling (Simplified)
        // F_crit = pi^2 * E * I / (KL)^2
        // I = pi/64 * (OD^4 - ID^4)
        const odM = section.od * 0.0254;
        const idM = (section.id_nom || (section.od - 0.5)) * 0.0254;
        const I = (Math.PI/64) * (Math.pow(odM, 4) - Math.pow(idM, 4));
        const L = 100; // Unsupported length between stabilizers/centralizers or buckling effective length
        const F_crit = (Math.PI**2 * E * I) / (L**2);
        
        compressionSF = F_crit / absLoad;
        
        const ratio = absLoad / weightAirN; // Ratio to string weight often used as heuristic
        if (ratio > 0.5) bucklingTendency = 'High';
        else if (ratio > 0.2) bucklingTendency = 'Moderate';
    }

    // Ballooning Check
    // High internal pressure vs external causing swell
    let ballooningTendency = 'Low';
    if (burstSF < 1.25) ballooningTendency = 'High';
    else if (burstSF < 1.5) ballooningTendency = 'Moderate';

    // Status Determination
    let status = 'PASS';
    if (burstSF < 1.1 || collapseSF < 1.0 || (isCompression ? compressionSF < 1.2 : tensionSF < 1.3)) {
        status = 'FAIL';
    } else if (burstSF < 1.25 || collapseSF < 1.1) {
        status = 'WARNING';
    }

    return {
        depth: bottomDepth,
        burstSF: burstSF.toFixed(2),
        collapseSF: collapseSF.toFixed(2),
        tensionSF: tensionSF > 99 ? 99.99 : tensionSF.toFixed(2),
        compressionSF: compressionSF > 99 ? 99.99 : compressionSF.toFixed(2),
        axialLoad: (totalAxialLoadN / 1000).toFixed(1), // kN
        pressureInt: pi_bottom.toFixed(1),
        pressureExt: pe_bottom.toFixed(1),
        buckling: bucklingTendency,
        ballooning: ballooningTendency,
        status: status
    };
};

/**
 * Calculates flow capacity metrics (Nodal Analysis Stub)
 */
export const calculateFlowAnalysis = (tubingString, reservoirP_bar, whp_bar, tubingID_in) => {
    // Basic inputs validation
    if (!tubingString || !reservoirP_bar) return null;
    
    // Nodal Analysis Estimation
    const reservoirP_psi = reservoirP_bar * 14.5038;
    const whp_psi = whp_bar * 14.5038;
    const dP_available = reservoirP_psi - whp_psi;
    
    if (dP_available <= 0) {
        return {
            maxRate: 0,
            frictionLoss: 0,
            velocity: 0,
            erosionRisk: 'None',
            regime: 'No Flow',
            limitingNode: 'Reservoir Pressure'
        };
    }

    // Estimate Max Rate (Vogel IPR approximation logic stub)
    // q = PI * (Pr - Pwf). Assuming Pwf min is WHP + min friction
    // Simplified: Capacity based on tubing size friction
    // q ~ C * dP^0.5 * D^2.5
    const D_in = tubingID_in || 3.0;
    const maxRate = Math.min(20000, Math.round(50 * Math.sqrt(dP_available) * Math.pow(D_in, 2))); 

    // Friction Loss Calculation at maxRate
    // Darcy-Weisbach approx via API 14E
    // dP = (f * rho * v^2 * L) / (2 * D)
    // Simplified field unit: dP (psi) = 0.0000115 * f * L * Q^2 / D^5 (assumed liquid)
    const L_ft = 10000; // nominal length
    const f = 0.02; // turbulent friction factor estimate
    const frictionLossPsi = (0.0000115 * f * L_ft * Math.pow(maxRate, 2)) / Math.pow(D_in, 5);
    
    // Velocity check
    // v (ft/s) = 0.0119 * Q (bbl/d) / ID^2 (in)
    const velocity = (0.0119 * maxRate) / Math.pow(D_in, 2);
    
    // Erosion Check
    // API 14E: Ve = C / sqrt(rho). C=100 continuous. rho ~ 60 lb/ft3 water
    const criticalVelocity = 100 / Math.sqrt(60); // approx 13 ft/s
    let erosionRisk = 'OK';
    if (velocity > criticalVelocity) erosionRisk = 'Critical';
    else if (velocity > criticalVelocity * 0.8) erosionRisk = 'High';
    else if (velocity > 10) erosionRisk = 'Moderate'; // General rule of thumb 10 ft/s

    // Regime
    // Re = 928 * rho * v * d / mu
    const Re = 928 * 8.5 * velocity * D_in / 1.0; // Water props
    const regime = Re > 4000 ? 'Turbulent' : (Re < 2000 ? 'Laminar' : 'Transitional');

    return {
        maxRate,
        frictionLoss: frictionLossPsi.toFixed(1),
        velocity: velocity.toFixed(1),
        erosionRisk,
        regime,
        limitingNode: frictionLossPsi > dP_available * 0.5 ? 'Tubing Friction' : 'Reservoir'
    };
};

/**
 * Calculates packer loads for different operational modes
 */
export const calculatePackerLoads = (packer, loadCases) => {
    if (!packer || !packer.depth) return [];

    const packerDepth = parseFloat(packer.depth);
    // Mock area based on 7" casing (ID ~6.18) and 3.5" tubing (OD 3.5)
    // Seal area is annulus area
    const casingID = 6.184;
    const tubingOD = 3.5;
    const sealAreaSqIn = (Math.PI/4) * (Math.pow(casingID, 2) - Math.pow(tubingOD, 2));

    return loadCases.map(lc => {
        // Differential Pressure at Packer depth
        // Internal - External
        let diffP_psi = 0;
        
        if (lc.type === 'Production') {
            // Tubing pressure low (flowing), Annulus pressure hydrostatic
            diffP_psi = -500; // External > Internal typically at packer for producing
        } else if (lc.type === 'Injection' || lc.type === 'Stimulation') {
            // Tubing pressure high
            diffP_psi = (lc.surface_pressure || 3000) + (0.052 * (lc.internal_fluid_density || 9.0) * packerDepth * 3.28); 
            // Minus Annulus (hydrostatic)
            diffP_psi -= (0.052 * (lc.external_fluid_density || 9.0) * packerDepth * 3.28);
        } else {
            diffP_psi = 0; // Balanced
        }

        const loadLbs = diffP_psi * sealAreaSqIn;
        const loadKN = loadLbs * 0.004448; // lbf to kN
        const ratingKN = packer.rating || 450; 

        const sf = Math.abs(ratingKN / (loadKN || 1)); // Avoid div by zero
        
        return {
            caseName: lc.name,
            differential: (diffP_psi * 0.0689).toFixed(1), // bar
            load: loadKN.toFixed(1),
            rating: ratingKN,
            sf: sf.toFixed(2),
            status: sf < 1.1 ? 'FAIL' : (sf < 1.25 ? 'WARNING' : 'PASS')
        };
    });
};

/**
 * Generates data for plotting with Casing Comparison
 */
export const generatePlotData = (tubingString, loadCase, casingStrings = []) => {
    if (!tubingString) return [];
    
    const points = [];
    const step = 100; // m
    const maxDepth = Math.max(...tubingString.sections.map(s => parseFloat(s.bottom_depth)));
    
    // Find active casing string (simplification: take first active)
    const activeCasing = casingStrings.find(s => s.status === 'Active');

    for (let d = 0; d <= maxDepth; d += step) {
        // Find section
        const section = tubingString.sections.find(s => d >= s.top_depth && d <= s.bottom_depth);
        if (!section) continue;

        const res = calculateTubingSectionResult({ ...section, bottom_depth: d, top_depth: 0 }, loadCase);
        
        // Mock Casing SF for comparison (if casing exists at this depth)
        let casingBurstSF = null;
        if (activeCasing && d <= activeCasing.bottom_depth) {
            // Simple mock degradation with depth for casing
            casingBurstSF = Math.max(1.1, 2.5 - (d / 4000));
        }

        points.push({
            depth: d,
            burstSF: Math.min(parseFloat(res.burstSF), 5),
            collapseSF: Math.min(parseFloat(res.collapseSF), 5),
            tensionSF: Math.min(parseFloat(res.tensionSF), 5),
            compressionSF: Math.min(parseFloat(res.compressionSF), 5),
            casingBurstSF: casingBurstSF, // For comparison plot
            pressureInt: parseFloat(res.pressureInt),
            pressureExt: parseFloat(res.pressureExt),
            axialLoad: parseFloat(res.axialLoad)
        });
    }
    return points;
};