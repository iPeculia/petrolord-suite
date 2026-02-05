/**
 * Utility functions for measurements in the Well Correlation Tool
 */

export const calculateDepthDifference = (y1, y2, pixelsPerUnit) => {
  if (!pixelsPerUnit) return 0;
  return Math.abs((y2 - y1) / pixelsPerUnit);
};

export const formatDepth = (depth, unit = 'm') => {
  return `${depth.toFixed(2)} ${unit}`;
};

export const calculateSlope = (p1, p2, pixelsPerUnit) => {
  // Calculate visual slope or geological dip if scale is provided
  // This is a simplified visual slope
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (dx === 0) return 90;
  return (Math.atan(dy / dx) * 180) / Math.PI;
};

export const getMeasurementLabel = (type, p1, p2, pixelsPerUnit, unit) => {
  if (type === 'depth') {
    const diff = calculateDepthDifference(p1.y, p2.y, pixelsPerUnit);
    return formatDepth(diff, unit);
  }
  return '';
};