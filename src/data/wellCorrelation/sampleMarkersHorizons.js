export const SAMPLE_HORIZONS = [
  { id: 'h1', name: 'Seabed', color: '#4287f5', style: 'solid', order: 1 },
  { id: 'h2', name: 'Top Cretaceous', color: '#42f554', style: 'solid', order: 2 },
  { id: 'h3', name: 'Base Cretaceous', color: '#f5a742', style: 'dashed', order: 3 },
  { id: 'h4', name: 'Top Jurassic', color: '#f54242', style: 'solid', order: 4 }
];

export const SAMPLE_MARKERS = [
  // Well 1 Markers
  { id: 'm1-1', wellId: 'well-p2-1', name: 'Seabed', depth: 1050, horizonId: 'h1', color: '#4287f5' },
  { id: 'm1-2', wellId: 'well-p2-1', name: 'Top Cretaceous', depth: 1200, horizonId: 'h2', color: '#42f554' },
  { id: 'm1-3', wellId: 'well-p2-1', name: 'Base Cretaceous', depth: 1350, horizonId: 'h3', color: '#f5a742' },
  
  // Well 2 Markers
  { id: 'm2-1', wellId: 'well-p2-2', name: 'Seabed', depth: 1080, horizonId: 'h1', color: '#4287f5' },
  { id: 'm2-2', wellId: 'well-p2-2', name: 'Top Cretaceous', depth: 1250, horizonId: 'h2', color: '#42f554' },
  { id: 'm2-3', wellId: 'well-p2-2', name: 'Base Cretaceous', depth: 1400, horizonId: 'h3', color: '#f5a742' }
];

export const SAMPLE_PANELS = [
  { 
    id: 'panel-1', 
    name: 'North-South Section', 
    wells: ['well-p2-1', 'well-p2-2'], 
    datumMarkerId: null,
    scale: 500 
  }
];