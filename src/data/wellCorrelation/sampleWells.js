export const SAMPLE_WELLS = [
  {
    id: 'well-1',
    name: 'Well-A1',
    lat: 29.5,
    lon: -95.1,
    kb: 25,
    totalDepth: 3500,
    curves: ['GR', 'RES', 'NPHI', 'RHOB'],
    logs: {
      'GR': { min: 0, max: 150, unit: 'GAPI' },
      'RES': { min: 0.2, max: 2000, unit: 'OHMM', scale: 'log' }
    }
  },
  {
    id: 'well-2',
    name: 'Well-A2',
    lat: 29.51,
    lon: -95.12,
    kb: 28,
    totalDepth: 3600,
    curves: ['GR', 'RES', 'DT'],
    logs: {
      'GR': { min: 0, max: 150, unit: 'GAPI' },
      'RES': { min: 0.2, max: 2000, unit: 'OHMM', scale: 'log' }
    }
  },
  {
    id: 'well-3',
    name: 'Well-B1',
    lat: 29.52,
    lon: -95.08,
    kb: 22,
    totalDepth: 3450,
    curves: ['GR', 'NPHI', 'RHOB'],
    logs: {
      'GR': { min: 0, max: 150, unit: 'GAPI' }
    }
  }
];