import { createDepthArray } from '@/utils/wellCorrelation/depthHandler';

// Helper to create a synthetic curve
const createCurve = (depths, type) => {
  const data = new Float32Array(depths.length);
  for(let i = 0; i < depths.length; i++) {
    const d = depths[i];
    if (type === 'GR') {
      data[i] = 50 + Math.sin(d/10) * 30 + Math.random() * 10;
    } else if (type === 'NPHI') {
      data[i] = 0.3 + Math.cos(d/15) * 0.15 + Math.random() * 0.05;
    } else if (type === 'RHOB') {
      data[i] = 2.4 + Math.cos(d/15) * 0.3 + Math.random() * 0.1;
    }
  }
  return data;
};

const depth1 = createDepthArray(1000, 1500, 0.5);
const depth2 = createDepthArray(1050, 1600, 0.5);

export const SAMPLE_WELLS_PHASE2 = [
  {
    id: 'well-p2-1',
    name: 'Phase2-Well-A',
    metadata: { uwi: '12345', field: 'TEST' },
    depthInfo: { start: 1000, stop: 1500, step: 0.5, unit: 'M', depths: depth1 },
    curves: [
      { mnemonic: 'GR', unit: 'gAPI', data: createCurve(depth1, 'GR'), min: 0, max: 150 },
      { mnemonic: 'NPHI', unit: 'v/v', data: createCurve(depth1, 'NPHI'), min: -0.15, max: 0.45 },
      { mnemonic: 'RHOB', unit: 'g/cc', data: createCurve(depth1, 'RHOB'), min: 1.95, max: 2.95 }
    ],
    status: 'loaded'
  },
  {
    id: 'well-p2-2',
    name: 'Phase2-Well-B',
    metadata: { uwi: '67890', field: 'TEST' },
    depthInfo: { start: 1050, stop: 1600, step: 0.5, unit: 'M', depths: depth2 },
    curves: [
      { mnemonic: 'GR', unit: 'gAPI', data: createCurve(depth2, 'GR'), min: 0, max: 150 },
      { mnemonic: 'RHOB', unit: 'g/cc', data: createCurve(depth2, 'RHOB'), min: 1.95, max: 2.95 }
    ],
    status: 'loaded'
  }
];