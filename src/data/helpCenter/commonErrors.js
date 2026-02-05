export const commonErrors = [
  {
    id: 'err-1',
    title: 'Negative Thickness Detected',
    cause: 'A horizon surface crosses below the horizon underneath it.',
    solution: 'Use the "Isopach Correction" tool in the Structural module to enforce a minimum thickness (e.g., 0 or 1m) between the surfaces.',
    category: 'Modeling'
  },
  {
    id: 'err-2',
    title: 'WebGL Context Lost',
    cause: 'The GPU ran out of memory, usually due to loading extremely large grids or too many high-res surfaces.',
    solution: 'Refresh the page. Try enabling LOD (Level of Detail) settings or decimating surfaces before import.',
    category: 'Visualization'
  },
  {
    id: 'err-3',
    title: 'LAS Import Failed',
    cause: 'Header information is missing or formatted incorrectly (non-standard mnemonics).',
    solution: 'Open the LAS file in a text editor and check the ~Well Information block. Ensure depth units (M or FT) are specified.',
    category: 'Data Import'
  },
  {
    id: 'err-4',
    title: 'Simulation Did Not Converge',
    cause: 'In Object Modeling, the target proportion cannot be met with the current object dimensions (objects are too big to fit).',
    solution: 'Reduce the object dimensions (width/length) or reduce the target facies proportion.',
    category: 'Modeling'
  }
];