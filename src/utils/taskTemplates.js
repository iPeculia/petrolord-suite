export const TASK_TEMPLATES = [
  {
    id: 'exploration_well',
    name: 'Exploration Well Pack',
    description: 'Standard workflow for planning and executing an exploration well.',
    tasks: [
      { name: 'Well Scoping & Objectives', duration: 5, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Site Survey & Land Access', duration: 14, workstream: 'HSSE', category: 'Data gathering' },
      { name: 'Basis of Design (BOD)', duration: 10, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Long Lead Item Procurement', duration: 60, workstream: 'Commercial', category: 'Decision' },
      { name: 'Drilling Program Approval', duration: 7, workstream: 'Drilling', category: 'Review' },
      { name: 'Rig Mobilization', duration: 10, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Spud Well', duration: 1, workstream: 'Drilling', category: 'Milestone' },
      { name: 'Drilling Operations (Top Hole)', duration: 5, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Drilling Operations (Reservoir Section)', duration: 15, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Wireline Logging', duration: 3, workstream: 'Subsurface', category: 'Data gathering' },
      { name: 'Well Testing (DST)', duration: 7, workstream: 'Subsurface', category: 'Data gathering' },
      { name: 'P&A or Suspension', duration: 4, workstream: 'Drilling', category: 'Technical work' },
      { name: 'End of Well Report', duration: 30, workstream: 'Subsurface', category: 'Review' }
    ]
  },
  {
    id: 'development_well',
    name: 'Development Well Pack',
    description: 'Streamlined workflow for development drilling campaigns.',
    tasks: [
      { name: 'Target Refinement', duration: 5, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Trajectory Planning', duration: 3, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Regulatory Permits', duration: 30, workstream: 'HSSE', category: 'Review' },
      { name: 'Casing Design Optimization', duration: 5, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Batch Drilling: Surface Hole', duration: 3, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Batch Drilling: Production Hole', duration: 10, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Completion Installation', duration: 5, workstream: 'Drilling', category: 'Technical work' },
      { name: 'Well Clean-up & Flowback', duration: 4, workstream: 'Facilities', category: 'Technical work' },
      { name: 'Handover to Production', duration: 1, workstream: 'Commercial', category: 'Milestone' }
    ]
  },
  {
    id: 'fdp_study',
    name: 'FDP Study Pack',
    description: 'Comprehensive Field Development Plan workflow.',
    tasks: [
      { name: 'Data Gathering & QA/QC', duration: 20, workstream: 'Digital', category: 'Data gathering' },
      { name: 'Static Model Building', duration: 45, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Dynamic Simulation', duration: 40, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Production Profiles Generation', duration: 10, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Facilities Concept Select', duration: 30, workstream: 'Facilities', category: 'Technical work' },
      { name: 'Cost Estimation (CAPEX/OPEX)', duration: 15, workstream: 'Commercial', category: 'Technical work' },
      { name: 'Economic Modeling', duration: 10, workstream: 'Commercial', category: 'Technical work' },
      { name: 'FDP Report Compilation', duration: 25, workstream: 'Subsurface', category: 'Review' },
      { name: 'Peer Review', duration: 5, workstream: 'Commercial', category: 'Review' },
      { name: 'Management FID', duration: 1, workstream: 'Commercial', category: 'Milestone' }
    ]
  },
  {
    id: 'reservoir_study',
    name: 'Reservoir Study Pack',
    description: 'Focused reservoir engineering and geoscience study.',
    tasks: [
      { name: 'Well Log Correlation', duration: 5, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Petrophysical Analysis', duration: 10, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Seismic Interpretation Update', duration: 15, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Material Balance Analysis', duration: 5, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Decline Curve Analysis', duration: 3, workstream: 'Subsurface', category: 'Technical work' },
      { name: 'Reserves Booking Update', duration: 5, workstream: 'Commercial', category: 'Decision' }
    ]
  }
];