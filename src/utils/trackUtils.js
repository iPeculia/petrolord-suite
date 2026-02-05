import { TRACK_TYPES } from './wellCorrelation/constants';

export const DEFAULT_TRACK_CONFIG = [
  {
    id: 'track-1',
    title: 'Lithology',
    type: 'LOG',
    width: 150,
    grid: { horizontal: true, vertical: true },
    scale: 'linear',
    curves: [
      { mnemonic: 'GR', color: '#10b981', min: 0, max: 150, style: 'solid', width: 1 },
      { mnemonic: 'CALI', color: '#64748b', min: 6, max: 16, style: 'dashed', width: 1 }
    ],
    fillings: [
      { id: 'fill-1', type: 'left', curve1: 'GR', color: '#10b981', opacity: 0.3, cutoff: 75 }
    ]
  },
  {
    id: 'track-2',
    title: 'Resistivity',
    type: 'LOG',
    width: 150,
    grid: { horizontal: true, vertical: true },
    scale: 'log',
    curves: [
      { mnemonic: 'RES_DEEP', color: '#ef4444', min: 0.2, max: 2000, style: 'solid', width: 2 },
      { mnemonic: 'RES_SHAL', color: '#f97316', min: 0.2, max: 2000, style: 'dotted', width: 1 }
    ],
    fillings: [
       { id: 'fill-2', type: 'between', curve1: 'RES_DEEP', curve2: 'RES_SHAL', color: '#ef4444', opacity: 0.2 }
    ]
  },
  {
    id: 'track-3',
    title: 'Porosity',
    type: 'LOG',
    width: 150,
    grid: { horizontal: true, vertical: true },
    scale: 'linear',
    curves: [
      { mnemonic: 'NPHI', color: '#3b82f6', min: 0.45, max: -0.15, style: 'solid', width: 1 },
      { mnemonic: 'RHOB', color: '#eab308', min: 1.95, max: 2.95, style: 'solid', width: 1 }
    ],
    fillings: [
      { id: 'fill-3', type: 'crossover', curve1: 'NPHI', curve2: 'RHOB', color: '#eab308', opacity: 0.4 }
    ]
  },
  {
    id: 'track-4',
    title: 'Facies',
    type: 'FACIES',
    width: 80,
    grid: { horizontal: false, vertical: false },
    scale: 'linear',
    curves: [
      { mnemonic: 'FACIES', color: '#8b5cf6', min: 0, max: 5, style: 'solid', width: 0 }
    ],
    fillings: [
        { id: 'fill-4', type: 'facies', curve1: 'FACIES', color: '#8b5cf6', opacity: 0.8 }
    ]
  }
];

export const DEFAULT_LAYERS = [
  { id: 'grid', name: 'Grid Lines', visible: true, zIndex: 1 },
  { id: 'fillings', name: 'Curve Fillings', visible: true, zIndex: 2 },
  { id: 'curves', name: 'Log Curves', visible: true, zIndex: 3 },
  { id: 'markers', name: 'Markers', visible: true, zIndex: 4 },
  { id: 'horizons', name: 'Horizons', visible: true, zIndex: 5 }
];

export { TRACK_TYPES };