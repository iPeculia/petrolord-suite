export const workflowTemplates = [
  {
    id: 'log-facies-npv',
    name: 'Log Facies to Economics',
    description: 'End-to-end workflow from well log interpretation to economic valuation.',
    steps: [
      { id: '1', type: 'source', app: 'log_facies', action: 'sync_facies', label: 'Import Facies' },
      { id: '2', type: 'process', app: 'earth_model', action: 'update_model', label: 'Update 3D Model' },
      { id: '3', type: 'process', app: 'earth_model', action: 'calc_volume', label: 'Calculate Volumes' },
      { id: '4', type: 'target', app: 'npv', action: 'run_economics', label: 'Economic Analysis' }
    ]
  },
  {
    id: 'ppfg-fdp',
    name: 'Pressure to Drilling Plan',
    description: 'Update drilling risks and well trajectory based on new pressure data.',
    steps: [
      { id: '1', type: 'source', app: 'ppfg', action: 'sync_pressure', label: 'Import Pressure Cube' },
      { id: '2', type: 'process', app: 'earth_model', action: 'update_stress', label: 'Update Stress Model' },
      { id: '3', type: 'target', app: 'fdp', action: 'optimize_wells', label: 'Optimize Trajectories' }
    ]
  },
  {
    id: 'multi-realization',
    name: 'Uncertainty Propagation',
    description: 'Run 50 realizations across all integrated apps to assess P10/P90 range.',
    steps: [
      { id: '1', type: 'control', action: 'loop_start', count: 50, label: 'Start Loop' },
      { id: '2', type: 'process', app: 'earth_model', action: 'stochastic_sim', label: 'Simulate Properties' },
      { id: '3', type: 'process', app: 'earth_model', action: 'calc_volume', label: 'Compute Volume' },
      { id: '4', type: 'target', app: 'npv', action: 'store_result', label: 'Store Result' },
      { id: '5', type: 'control', action: 'loop_end', label: 'End Loop' }
    ]
  }
];