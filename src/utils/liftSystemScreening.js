export const screenLiftSystems = (inputs) => {
  const {
    targetRate,
    depth,
    gor,
    waterCut,
    apiGravity,
    isOffshore,
    hasSand,
    isDeviated,
    powerAvailable,
    gasAvailable,
  } = inputs;

  const results = [
    evaluateESP(targetRate, depth, gor, apiGravity, hasSand, isDeviated, powerAvailable, isOffshore),
    evaluateGasLift(targetRate, depth, gor, apiGravity, hasSand, isDeviated, gasAvailable, isOffshore),
    evaluateRodPump(targetRate, depth, gor, apiGravity, hasSand, isDeviated, isOffshore),
  ];

  results.sort((a, b) => b.score - a.score);

  if (results.length > 0) {
    const topScore = results[0].score;
    results.forEach(r => {
      r.isRecommended = r.score >= topScore - 15 && r.score > 50;
    });
  }

  return results;
};

const evaluateESP = (rate, depth, gor, api, sand, deviated, power, offshore) => {
  let score = 100;
  const reasons = [];

  // Rate
  if (rate > 500 && rate < 50000) {
    score -= 0;
    reasons.push({ type: 'pro', text: 'Excellent rate handling capability for this range.' });
  } else if (rate <= 500) {
    score -= 20;
    reasons.push({ type: 'con', text: 'Low rates can lead to poor efficiency and motor cooling issues.' });
  } else {
    score -= 10;
    reasons.push({ type: 'neutral', text: 'Very high rates may require large, specialized equipment.' });
  }

  // GOR
  if (gor > 2000) {
    score -= 30;
    reasons.push({ type: 'con', text: 'High GOR significantly degrades pump performance and can cause gas locking.' });
  } else if (gor > 1000) {
    score -= 15;
    reasons.push({ type: 'neutral', text: 'Moderate GOR requires gas handling devices.' });
  } else {
    reasons.push({ type: 'pro', text: 'Low GOR is ideal for ESPs.' });
  }

  // Sand
  if (sand) {
    score -= 25;
    reasons.push({ type: 'con', text: 'Abrasive wear from sand drastically reduces ESP run life.' });
  }

  // Deviated
  if (deviated) {
    score -= 5;
    reasons.push({ type: 'neutral', text: 'Can be used in deviated wells, but high doglegs (>5-7 deg/100ft) are problematic.' });
  } else {
    reasons.push({ type: 'pro', text: 'Ideal for straight or near-vertical wells.' });
  }

  // Power
  if (!power) {
    score = 0;
    reasons.push({ type: 'con', text: 'Requires a reliable electrical power source, which is unavailable.' });
  }

  // Offshore
  if (offshore) {
    reasons.push({ type: 'pro', text: 'Compact surface footprint makes it suitable for offshore platforms.' });
  }

  return { type: 'ESP', score: Math.max(0, Math.round(score)), reasons };
};

const evaluateGasLift = (rate, depth, gor, api, sand, deviated, gas, offshore) => {
  let score = 100;
  const reasons = [];

  // Gas Source
  if (!gas) {
    score = 0;
    reasons.push({ type: 'con', text: 'Requires a reliable source of high-pressure lift gas, which is unavailable.' });
  }

  // GOR
  if (gor > 500) {
    reasons.push({ type: 'pro', text: 'Works well with existing formation gas.' });
  }

  // Sand
  if (sand) {
    score -= 5;
    reasons.push({ type: 'pro', text: 'Excellent solids handling capability as there are no downhole moving parts.' });
  }

  // Deviated
  if (deviated) {
    reasons.push({ type: 'pro', text: 'Excellent for deviated wells, unaffected by dogleg severity.' });
  }

  // Rate
  if (rate > 20000) {
    score -= 15;
    reasons.push({ type: 'neutral', text: 'Can be inefficient at very high liquid rates.' });
  } else {
    reasons.push({ type: 'pro', text: 'Very flexible and can handle a wide range of production rates.' });
  }

  // Offshore
  if (offshore) {
    score -= 5;
    reasons.push({ type: 'pro', text: 'Commonly used offshore due to reliability and simple downhole components.' });
  }

  // Depth
  if (depth > 10000) {
    score -= 10;
    reasons.push({ type: 'neutral', text: 'Deep wells require very high injection pressures.' });
  }

  return { type: 'Gas Lift', score: Math.max(0, Math.round(score)), reasons };
};

const evaluateRodPump = (rate, depth, gor, api, sand, deviated, offshore) => {
  let score = 100;
  const reasons = [];

  // Offshore
  if (offshore) {
    score = 0;
    reasons.push({ type: 'con', text: 'Large surface footprint makes it generally unsuitable for offshore platforms.' });
  }

  // Rate
  if (rate > 1500) {
    score -= 40;
    reasons.push({ type: 'con', text: 'Limited to low-to-medium flow rates.' });
  } else {
    reasons.push({ type: 'pro', text: 'Highly efficient at lower flow rates.' });
  }

  // Depth
  if (depth > 9000) {
    score -= 30;
    reasons.push({ type: 'con', text: 'Rod stress and stretch become major issues in deep wells.' });
  } else if (depth > 6000) {
    score -= 15;
    reasons.push({ type: 'neutral', text: 'Feasible in medium-depth wells with careful design.' });
  }

  // Deviated
  if (deviated) {
    score -= 25;
    reasons.push({ type: 'con', text: 'Side-loading and friction from deviation cause high rates of rod and tubing wear.' });
  }

  // GOR
  if (gor > 1000) {
    score -= 15;
    reasons.push({ type: 'con', text: 'Prone to gas interference, reducing pump efficiency.' });
  }

  // Sand
  if (sand) {
    score -= 10;
    reasons.push({ type: 'neutral', text: 'Can handle some solids, but abrasive wear is a concern for the pump and tubing.' });
  }

  return { type: 'Rod Pump', score: Math.max(0, Math.round(score)), reasons };
};