/**
 * Utility functions for Casing Wear Analyzer load estimation
 */

export const calculateBHAProperties = (bha) => {
  // Safety check for bha structure
  if (!bha || !bha.drillPipe || !bha.hwdp || !bha.drillCollars) {
    return {
      totalWeight: 0,
      totalLength: 0,
      toolJointCount: 0
    };
  }

  // Simple summations
  const dpWeight = (bha.drillPipe.length || 0) * (bha.drillPipe.weight || 0) / 1000; // klbf
  const hwdpWeight = (bha.hwdp.count || 0) * 30 * (bha.hwdp.weight || 0) / 1000; // approx 30ft per joint
  const dcWeight = (bha.drillCollars.count || 0) * 30 * (bha.drillCollars.weight || 0) / 1000; // approx 30ft per joint
  
  const totalWeight = dpWeight + hwdpWeight + dcWeight;
  const totalLength = (bha.drillPipe.length || 0) + ((bha.hwdp.count || 0) * 30) + ((bha.drillCollars.count || 0) * 30); // ft
  
  const toolJointCount = Math.floor((bha.drillPipe.length || 0) / 30) + (bha.hwdp.count || 0) + (bha.drillCollars.count || 0);

  return {
    totalWeight,
    totalLength,
    toolJointCount
  };
};

export const calculateTotalRotaryDistance = (rpm, rotatingHours, toolJointOD) => {
  // Distance = Circumference * RPM * Time
  // Circumference (m) = PI * OD (in) * 0.0254
  const circumference = Math.PI * (toolJointOD || 0) * 0.0254;
  const totalRevolutions = (rpm || 0) * (rotatingHours || 0) * 60;
  return totalRevolutions * circumference; // meters
};

export const calculateTotalSlidingDistance = (slidingHours, ropSliding) => {
  // This is actually linear distance drilled while sliding, but often we care about the
  // distance the pipe body slides against the casing.
  // For wear, it's often (Time * Velocity).
  // Assuming ROP is ft/hr, convert to m
  return (slidingHours || 0) * (ropSliding || 0) * 0.3048;
};

export const generateMockWellProfile = (maxDepth) => {
  const step = 30; // meters
  const points = [];
  let inclination = 0;
  let azimuth = 0;
  const safeDepth = maxDepth || 1000; // Default if null
  
  for (let md = 0; md <= safeDepth; md += step) {
    // Generate some synthetic doglegs
    let dls = 0;
    if (md > 500 && md < 1500) dls = 1.5 + Math.random(); // Build section
    else if (md > 2500 && md < 3000) dls = 2.0 + Math.random(); // Turn/Drop
    else dls = Math.random() * 0.5; // Tangent noise

    inclination += (dls / 30) * (step / 30); // Rough accumulation
    if (inclination > 90) inclination = 90;

    points.push({
      md,
      tvd: md * Math.cos(inclination * Math.PI / 180), // Simple TVD approx
      inclination,
      azimuth,
      dls
    });
  }
  return points;
};

export const estimateContactForce = (wellProfile, bhaData, casingData) => {
  // Simplified Contact Force Model (Soft String approx for visualization)
  if (!wellProfile || !bhaData || !casingData) return [];

  const bhaWeight = calculateBHAProperties(bhaData).totalWeight * 4.44822; // Convert klbf to kN roughly
  const mudBuoyancy = 0.85; // rough factor
  const maxDepth = wellProfile.length > 0 ? wellProfile[wellProfile.length-1].md : 0;
  
  return wellProfile.map(point => {
    // Tension at this depth (rough approx: hanging weight below this point)
    const hangingDepth = Math.max(0, maxDepth - point.md);
    const tension = (hangingDepth * 0.02 * 9.81) + bhaWeight; // Dummy linear weight for pipe
    
    // Contact Force (Side Force) per 30m ~ Tension (kN) * DLS (rad/30m)
    // DLS is in deg/30m usually for field units, let's assume input DLS is deg/30m
    const dlsRad = point.dls * (Math.PI / 180);
    
    let sideForce = tension * dlsRad * mudBuoyancy;
    
    // Add spikes for BHA/Tool joints if in open hole or specific areas (simulated)
    // We just add a factor if DLS is high
    if (point.dls > 2) sideForce *= 1.2;

    return {
      depth: point.md,
      dls: point.dls,
      contactForce: Math.max(0, sideForce) // kN
    };
  });
};