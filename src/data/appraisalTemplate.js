export const APPRAISAL_TEMPLATE = {
  type: 'Appraisal',
  description: 'Workflow for delineating a discovery, reducing subsurface uncertainty, and optimizing development planning.',
  stages: [
    { name: 'Appraisal Planning', duration_weeks: 6, description: 'Define objectives, well locations, and data acquisition program.' },
    { name: 'Well Drilling', duration_weeks: 12, description: 'Execute appraisal drilling program safely and efficiently.' },
    { name: 'Data Interpretation', duration_weeks: 8, description: 'Analyze logs, cores, and seismic to update models.' },
    { name: 'Reservoir Evaluation', duration_weeks: 8, description: 'Update static and dynamic models, volumetric range.' },
    { name: 'Commercial Evaluation', duration_weeks: 6, description: 'Economic analysis of development concepts.' },
    { name: 'Decision & Transition', duration_weeks: 4, description: 'Select development concept and transition to Define phase.' }
  ],
  gates: [
    { name: 'G1: Well Plan Approval', stage: 'Appraisal Planning', criteria: ['Objectives defined', 'Locations selected', 'Basis of Design approved'] },
    { name: 'G2: Drilling Program Approval', stage: 'Appraisal Planning', criteria: ['Drilling program finalized', 'Long lead items secured', 'HSE plan in place'] },
    { name: 'G3: Well Completion & Test', stage: 'Well Drilling', criteria: ['TD reached', 'Logging complete', 'DST/EWT successful'] },
    { name: 'G4: Data Interpretation Review', stage: 'Data Interpretation', criteria: ['Petrophysics complete', 'Seismic tie done', 'Fluid analysis ready'] },
    { name: 'G5: Reservoir Model Review', stage: 'Reservoir Evaluation', criteria: ['History match (if any)', 'Volumetric range (P10-P90) updated'] },
    { name: 'G6: Commercial Review', stage: 'Commercial Evaluation', criteria: ['Development concepts screened', 'Economics robust'] },
    { name: 'G7: Development Decision', stage: 'Decision & Transition', criteria: ['Concept selected', 'Proceed to Define/FEED approved'] }
  ],
  tasks: [
    // Planning
    { name: 'Define Appraisal Objectives', stage: 'Appraisal Planning', type: 'task', workstream: 'Subsurface' },
    { name: 'Select Well Locations', stage: 'Appraisal Planning', type: 'task', workstream: 'Subsurface' },
    { name: 'Basis of Design (BOD)', stage: 'Appraisal Planning', type: 'task', workstream: 'Drilling' },
    { name: 'Data Acquisition Plan', stage: 'Appraisal Planning', type: 'task', workstream: 'Subsurface' },
    // Drilling
    { name: 'Drilling Program Preparation', stage: 'Well Drilling', type: 'task', workstream: 'Drilling' },
    { name: 'Rig Mobilization', stage: 'Well Drilling', type: 'task', workstream: 'Logistics' },
    { name: 'Appraisal Well 1 Drilling', stage: 'Well Drilling', type: 'task', workstream: 'Operations' },
    { name: 'Appraisal Well 2 Drilling', stage: 'Well Drilling', type: 'task', workstream: 'Operations' },
    { name: 'Wireline Logging', stage: 'Well Drilling', type: 'task', workstream: 'Operations' },
    { name: 'Well Testing (DST)', stage: 'Well Drilling', type: 'task', workstream: 'Operations' },
    // Interpretation
    { name: 'Well Log Interpretation', stage: 'Data Interpretation', type: 'task', workstream: 'Subsurface' },
    { name: 'Core Analysis (RCAL/SCAL)', stage: 'Data Interpretation', type: 'task', workstream: 'Subsurface' },
    { name: 'Fluid Analysis (PVT)', stage: 'Data Interpretation', type: 'task', workstream: 'Subsurface' },
    { name: 'Seismic Re-calibration', stage: 'Data Interpretation', type: 'task', workstream: 'Subsurface' },
    // Evaluation
    { name: 'Static Model Update', stage: 'Reservoir Evaluation', type: 'task', workstream: 'Subsurface' },
    { name: 'Dynamic Simulation', stage: 'Reservoir Evaluation', type: 'task', workstream: 'Reservoir' },
    { name: 'Volumetric Estimation', stage: 'Reservoir Evaluation', type: 'task', workstream: 'Reservoir' },
    { name: 'Uncertainty Analysis', stage: 'Reservoir Evaluation', type: 'task', workstream: 'Subsurface' },
    // Commercial
    { name: 'Development Concept Screening', stage: 'Commercial Evaluation', type: 'task', workstream: 'Facilities' },
    { name: 'Cost Estimation (CAPEX/OPEX)', stage: 'Commercial Evaluation', type: 'task', workstream: 'Project Services' },
    { name: 'Economic Modeling', stage: 'Commercial Evaluation', type: 'task', workstream: 'Economics' },
    { name: 'Commercial Risk Assessment', stage: 'Commercial Evaluation', type: 'task', workstream: 'Economics' },
    // Decision
    { name: 'Prepare Declaration of Commerciality', stage: 'Decision & Transition', type: 'task', workstream: 'Commercial' },
    { name: 'Concept Selection Report', stage: 'Decision & Transition', type: 'task', workstream: 'Project Management' },
    { name: 'Transition to Development Team', stage: 'Decision & Transition', type: 'task', workstream: 'Project Management' }
  ],
  deliverables: [
    { name: 'Appraisal Well Basis of Design', stage: 'Appraisal Planning' },
    { name: 'Data Acquisition Program', stage: 'Appraisal Planning' },
    { name: 'Detailed Drilling Program', stage: 'Well Drilling' },
    { name: 'Daily Drilling Reports (DDR)', stage: 'Well Drilling' },
    { name: 'Well Completion Report', stage: 'Well Drilling' },
    { name: 'Well Test Analysis Report', stage: 'Data Interpretation' },
    { name: 'Petrophysical Interpretation Report', stage: 'Data Interpretation' },
    { name: 'PVT / Fluid Analysis Report', stage: 'Data Interpretation' },
    { name: 'Static Reservoir Model', stage: 'Reservoir Evaluation' },
    { name: 'Dynamic Simulation Report', stage: 'Reservoir Evaluation' },
    { name: 'Reserves & Resources Report', stage: 'Reservoir Evaluation' },
    { name: 'Development Concept Options', stage: 'Commercial Evaluation' },
    { name: 'Economic Evaluation Report', stage: 'Commercial Evaluation' },
    { name: 'Declaration of Commerciality', stage: 'Decision & Transition' }
  ],
  risks: [
    { title: 'Reservoir Connectivity', category: 'Subsurface', probability: 3, impact: 5, description: 'Compartmentalization may reduce recoverable volumes.' },
    { title: 'Fluid Properties', category: 'Subsurface', probability: 2, impact: 4, description: 'Viscosity or GOR different from discovery well.' },
    { title: 'Aquifer Support', category: 'Subsurface', probability: 3, impact: 4, description: 'Water drive strength uncertainty.' },
    { title: 'Wellbore Stability', category: 'Well', probability: 3, impact: 3, description: 'Issues drilling through overburden shales.' },
    { title: 'Logistics/Supply Chain', category: 'Commercial', probability: 2, impact: 3, description: 'Delay in rig or materials arrival.' },
    { title: 'Cost Escalation', category: 'Commercial', probability: 3, impact: 3, description: 'Service costs rising during campaign.' },
    { title: 'Regulatory Delays', category: 'Commercial', probability: 2, impact: 4, description: 'Permits for testing or flaring delayed.' },
    { title: 'HSE Incident', category: 'HSSE', probability: 1, impact: 5, description: 'Safety incident during drilling or testing.' },
    { title: 'Data Quality', category: 'Digital', probability: 2, impact: 4, description: 'Poor log quality or corrupted samples.' },
    { title: 'Seal Integrity', category: 'Subsurface', probability: 2, impact: 5, description: 'Leakage through cap rock.' },
    { title: 'Market Access', category: 'Commercial', probability: 2, impact: 4, description: 'Pipeline capacity or off-take constraints.' },
    { title: 'Stakeholder Opposition', category: 'Commercial', probability: 2, impact: 3, description: 'Local community concerns.' }
  ],
  resources: [
    { discipline: 'Drilling Engineer', count: 2, type: 'Person' },
    { discipline: 'Reservoir Engineer', count: 2, type: 'Person' },
    { discipline: 'Geologist', count: 2, type: 'Person' },
    { discipline: 'Petrophysicist', count: 1, type: 'Person' },
    { discipline: 'Production Engineer', count: 1, type: 'Person' },
    { discipline: 'Facilities Engineer', count: 1, type: 'Person' },
    { discipline: 'Commercial Analyst', count: 1, type: 'Person' },
    { discipline: 'HSE Specialist', count: 1, type: 'Person' },
    { discipline: 'Project Manager', count: 1, type: 'Person' },
    { discipline: 'Data Manager', count: 1, type: 'Person' }
  ]
};