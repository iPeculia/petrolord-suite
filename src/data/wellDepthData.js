// Generates synthetic well trajectory data for demonstration purposes

const createVerticalWell = (maxDepth = 3500, seaLevel = 1000) => {
  const steps = maxDepth / 0.5;
  const md = new Float32Array(steps + 1);
  const tvd = new Float32Array(steps + 1);
  const tvdss = new Float32Array(steps + 1);
  const angle = new Float32Array(steps + 1);

  for (let i = 0; i <= steps; i++) {
    const depth = i * 0.5;
    md[i] = depth;
    tvd[i] = depth;
    tvdss[i] = depth - seaLevel;
    angle[i] = Math.random() * 2; // slight variation
  }
  return { md, tvd, tvdss, angle };
};

const createDeviatedWell = (maxMd, maxTvd, kickoffDepth, buildRate, seaLevel = 1000) => {
  const steps = Math.round(maxMd / 0.5);
  const md = new Float32Array(steps + 1);
  const tvd = new Float32Array(steps + 1);
  const tvdss = new Float32Array(steps + 1);
  const angle = new Float32Array(steps + 1);
  
  let currentAngle = 0;
  let currentTvd = 0;

  for (let i = 0; i <= steps; i++) {
    const depth = i * 0.5;
    md[i] = depth;

    if (depth <= kickoffDepth) {
      tvd[i] = depth;
      angle[i] = 0;
    } else {
      const angleRad = (currentAngle * Math.PI) / 180;
      currentTvd += 0.5 * Math.cos(angleRad);
      tvd[i] = currentTvd;
      
      const buildSectionLength = depth - kickoffDepth;
      currentAngle = Math.min(90, buildSectionLength * buildRate);
      angle[i] = currentAngle;
    }
    tvdss[i] = tvd[i] - seaLevel;
  }
  return { md, tvd, tvdss, angle };
};

const wellTrajectories = {
  'Well-01': createVerticalWell(3500, 1000),
  'Well-02': createDeviatedWell(3800, 3500, 500, 0.01, 1000), // Slightly deviated
  'Well-03': createDeviatedWell(4200, 3500, 500, 0.03, 1000), // Moderately deviated
  'Well-04': createDeviatedWell(5000, 3500, 500, 0.05, 1000), // Highly deviated
  'Well-05': createDeviatedWell(6000, 3500, 500, 0.08, 1000), // Horizontal
};

export const getWellTrajectory = (wellId) => {
  return wellTrajectories[wellId] || wellTrajectories['Well-01']; // fallback
};