import { parseExcel, parseCSV } from './fileUploadHandler';

/**
 * Parses a well file (CSV, Excel, JSON) into standardized well objects
 * @param {File} file 
 * @returns {Promise<Array>} Array of well objects
 */
export const parseWellFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  let rawData = [];

  if (extension === 'json') {
    const text = await file.text();
    rawData = JSON.parse(text);
    // If JSON is a single object, wrap in array
    if (!Array.isArray(rawData)) rawData = [rawData];
  } else if (extension === 'csv') {
    const text = await file.text();
    rawData = await parseCSV(text);
  } else if (extension === 'xlsx' || extension === 'xls') {
    const buffer = await file.arrayBuffer();
    rawData = parseExcel(buffer);
  } else {
    throw new Error('Unsupported file format. Please use CSV, Excel, or JSON.');
  }

  return validateAndFormatWells(rawData);
};

const validateAndFormatWells = (data) => {
  return data.map((row, index) => {
    // Normalize keys to lowercase and remove special chars for easier matching
    const normalized = {};
    Object.keys(row).forEach(key => {
      normalized[key.toLowerCase().replace(/[^a-z0-9]/g, '')] = row[key];
    });

    // Identify Name
    const name = normalized.wellname || normalized.name || normalized.well || `Imported Well ${index + 1}`;
    
    // Identify UWI/API
    const uwi = normalized.uwi || normalized.api || normalized.id || `W-${Date.now()}-${index}`;

    // Identify Depths (MD/TVD)
    // Prefer 'md', 'totaldepth', 'td', 'depth'
    const totalDepth = Number(normalized.totaldepth || normalized.md || normalized.td || normalized.depth || 3000);
    
    // Identify Location
    const x = Number(normalized.x || normalized.surfaceeast || normalized.east || normalized.longitude || 0);
    const y = Number(normalized.y || normalized.surfacenorth || normalized.north || normalized.latitude || 0);
    
    if (!name) return null; // Skip if no name could be determined? Actually we defaulted above.

    return {
      id: crypto.randomUUID(), // Generate new ID for internal use
      name: String(name),
      uwi: String(uwi),
      totalDepth: isNaN(totalDepth) ? 3000 : totalDepth,
      location: { x, y },
      depthInfo: {
        start: 0,
        stop: isNaN(totalDepth) ? 3000 : totalDepth,
        step: 0.5, // Default step
        unit: normalized.unit || 'M',
        reference: 'KB'
      },
      field: normalized.field || 'Unknown',
      operator: normalized.operator || 'Unknown',
      country: normalized.country || '',
      type: normalized.type || 'Vertical', // Vertical, Deviated, etc.
      status: 'active', // Default status
      curves: [], // Initial empty curves
      logData: null // Placeholder for full data
    };
  }).filter(Boolean);
};