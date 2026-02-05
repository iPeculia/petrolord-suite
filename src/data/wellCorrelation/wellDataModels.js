/**
 * Data Models for Well Correlation Tool
 * Defines the structure of data objects used in the application.
 */

export const WellModel = {
  id: '',           // Unique ID
  name: '',         // Well Name
  metadata: {       // Header info
    uwi: '',
    field: '',
    country: '',
    operator: '',
    date: '',
    source: ''      // e.g. 'import', 'db'
  },
  location: {       // Surface location
    lat: 0,
    lon: 0,
    x: 0,
    y: 0,
    crs: ''
  },
  depthInfo: {      // Depth reference
    unit: 'M',      // M or FT
    reference: 'KB',
    step: 0.1524,
    start: 0,
    stop: 0,
    type: 'MD'      // MD or TVD
  },
  curves: [],       // Array of CurveModel
  markers: [],      // Array of MarkerModel
  status: 'loaded'  // loaded, loading, error
};

export const CurveModel = {
  id: '',
  mnemonic: '',     // e.g., GR
  unit: '',         // e.g., gAPI
  description: '',
  min: 0,
  max: 0,
  data: []          // Float32Array or Array
};

export const MarkerModel = {
  id: '',
  wellId: '',
  name: '',         // Marker Name (e.g. Top Brent)
  depth: 0,         // MD
  type: 'stratigraphic', // stratigraphic, fault, fluid_contact
  horizonId: null,  // Link to HorizonModel
  color: '#000000',
  description: ''
};

export const HorizonModel = {
  id: '',
  name: '',         // Horizon Name
  age: 0,           // Geological Age
  color: '#FF0000',
  style: 'solid',   // solid, dashed, dotted
  order: 0,         // Stratigraphic order
  description: ''
};

export const CorrelationPanelModel = {
  id: '',
  name: '',
  wells: [],        // Array of well IDs in order
  datumMarkerId: null, // Marker ID to flatten on
  scale: 1000,      // Vertical scale 1:X
  tracks: []        // Configuration for tracks
};

export const createWellFromLas = (importData) => {
  const wellId = `well-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: wellId,
    name: importData.metadata.name || 'Unknown Well',
    metadata: {
      uwi: importData.metadata.uwi,
      field: importData.metadata.field,
      operator: importData.metadata.operator,
      source: importData.originalFile || 'Import'
    },
    location: {
      x: 0, y: 0 // Default
    },
    depthInfo: {
      unit: importData.metadata.depthUnit || 'M',
      reference: importData.metadata.depthReference || 'KB',
      start: importData.metadata.startDepth,
      stop: importData.metadata.endDepth,
      step: importData.metadata.step,
      depths: importData.depths // Store raw depth array
    },
    curves: importData.curves.map(c => ({
      id: `${wellId}-${c.mnemonic}`,
      mnemonic: c.mnemonic,
      unit: c.unit,
      description: c.description,
      min: c.minValue,
      max: c.maxValue,
      data: c.data
    })),
    markers: [],
    status: 'loaded'
  };
};