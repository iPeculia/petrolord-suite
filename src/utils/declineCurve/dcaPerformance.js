const metrics = {};

export const startTimer = (label) => {
  performance.mark(`${label}-start`);
  return label;
};

export const endTimer = (label) => {
  try {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    const entries = performance.getEntriesByName(label);
    const duration = entries[entries.length - 1].duration;
    
    if (!metrics[label]) metrics[label] = [];
    metrics[label].push(duration);
    
    // Cleanup
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  } catch (e) {
    console.warn('Performance timer error', e);
    return 0;
  }
};

export const getMetrics = () => metrics;