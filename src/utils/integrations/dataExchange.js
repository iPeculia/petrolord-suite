// Unified Data Exchange Utilities for EarthModel Pro

// Convert between different coordinate systems (Mock implementation)
export const coordinateConverter = {
  toUTM: (lat, lon) => {
    // Mock conversion
    return { x: 450000 + (lon * 1000), y: 6000000 + (lat * 1000) };
  },
  toLatLon: (x, y) => {
    return { lat: (y - 6000000) / 1000, lon: (x - 450000) / 1000 };
  }
};

// Data transformation for specific apps
export const formatConverters = {
  logFacies: {
    toEarthModel: (logData) => {
      return logData.map(log => ({
        wellId: log.well_id,
        depth: log.depth_md,
        facies: log.facies_code,
        // Map confidence score
        confidence: log.prediction_confidence
      }));
    },
    fromEarthModel: (modelData) => {
      return {
        source: 'EarthModel Pro',
        version: '3.0',
        data: modelData
      };
    }
  },
  ppfg: {
    toEarthModel: (pressureData) => {
      return {
        porePressure: pressureData.pp_gradient,
        fractureGradient: pressureData.fg_gradient,
        units: 'psi/ft'
      };
    }
  }
};

// Validation schemas
export const validationSchemas = {
  wellLog: {
    required: ['wellId', 'depth', 'value'],
    types: { wellId: 'string', depth: 'number', value: 'number' }
  },
  surface: {
    required: ['id', 'points'],
    types: { id: 'string', points: 'array' }
  }
};

export const validateData = (data, type) => {
  const schema = validationSchemas[type];
  if (!schema) return { valid: true }; // No schema defined

  const errors = [];
  // Basic validation logic
  if (Array.isArray(data)) {
    data.forEach((item, idx) => {
      schema.required.forEach(field => {
        if (item[field] === undefined) errors.push(`Item ${idx} missing required field: ${field}`);
      });
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};