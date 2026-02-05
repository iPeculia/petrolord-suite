export const detectZeroRatePeriods = (data) => {
  return data.filter(d => d.rate === 0);
};

export const detectMissingDates = (data) => {
  if (data.length < 2) return [];
  const missing = [];
  // Assuming daily data for simplified check
  for (let i = 1; i < data.length; i++) {
    const prev = new Date(data[i-1].date);
    const curr = new Date(data[i].date);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays > 1.1) { // Allow some slop
      missing.push({ start: data[i-1].date, end: data[i].date, gap: Math.floor(diffDays) });
    }
  }
  return missing;
};

export const detectDuplicateDates = (data) => {
  const seen = new Set();
  const duplicates = [];
  data.forEach(d => {
    if (seen.has(d.date)) {
      duplicates.push(d.date);
    }
    seen.add(d.date);
  });
  return duplicates;
};

export const detectNegativeVolumes = (data) => {
  return data.filter(d => d.rate < 0);
};

export const generateQCSummary = (data) => {
  const zeros = detectZeroRatePeriods(data);
  const missing = detectMissingDates(data);
  const duplicates = detectDuplicateDates(data);
  const negatives = detectNegativeVolumes(data);

  let score = 100;
  score -= Math.min(20, zeros.length * 0.5);
  score -= Math.min(20, missing.length * 2);
  score -= Math.min(30, duplicates.length * 5);
  score -= Math.min(30, negatives.length * 5);

  return {
    totalRecords: data.length,
    issues: {
      zeros: zeros.length,
      missing: missing.length,
      duplicates: duplicates.length,
      negatives: negatives.length
    },
    score: Math.max(0, Math.round(score)),
    dateRange: data.length > 0 ? { start: data[0].date, end: data[data.length - 1].date } : null
  };
};