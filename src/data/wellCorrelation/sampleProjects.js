import { SAMPLE_WELLS } from './sampleWells';

export const SAMPLE_PROJECTS = [
  {
    id: 'proj-001',
    name: 'North Sea Correlation',
    created: '2023-10-15T10:00:00Z',
    modified: '2023-10-20T14:30:00Z',
    wells: [SAMPLE_WELLS[0].id, SAMPLE_WELLS[1].id],
    description: 'Correlation of Jurassic sands in the North Sea sector.'
  },
  {
    id: 'proj-002',
    name: 'Permian Basin Quick Look',
    created: '2023-11-01T09:00:00Z',
    modified: '2023-11-01T09:00:00Z',
    wells: [SAMPLE_WELLS[2].id],
    description: 'Preliminary analysis of Wolfcamp section.'
  }
];