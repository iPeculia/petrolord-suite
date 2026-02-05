/**
 * Export Service
 * orchestrates data formatting for various export targets.
 */

import { generateCSV } from './reportGenerator';
import { formatForEarthModelPro } from './integrationService';

export const exportData = async (type, data) => {
  switch (type) {
    case 'CSV':
      return generateCSV(data.wells, data.horizons, data.markers);
    case 'EARTHMODEL':
      return formatForEarthModelPro(data.horizons, data.markers, data.wells);
    case 'JSON':
      return JSON.stringify(data, null, 2);
    default:
      throw new Error(`Unknown export type: ${type}`);
  }
};