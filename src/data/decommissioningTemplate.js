export const DECOMMISSIONING_TEMPLATE = {
  type: 'Decommissioning',
  description: 'End-of-life workflow for safe removal of assets and site restoration.',
  stages: [
    { name: 'Planning', duration_weeks: 12, description: 'Define scope, engineering, and regulatory strategy.' },
    { name: 'Well Abandonment', duration_weeks: 16, description: 'Plug and abandon wells permanently.' },
    { name: 'Facility Removal', duration_weeks: 20, description: 'Remove topsides, jackets, and subsea infrastructure.' },
    { name: 'Site Remediation', duration_weeks: 8, description: 'Restore seabed and handle waste disposal.' },
    { name: 'Closure', duration_weeks: 4, description: 'Final regulatory sign-off and lease surrender.' }
  ],
  gates: [
    { name: 'G1: Planning Approval', stage: 'Planning', criteria: ['Scope defined', 'Budget approved', 'Team assembled'] },
    { name: 'G2: Regulatory Filing', stage: 'Planning', criteria: ['Decommissioning plan submitted', 'Environmental impact assessed'] },
    { name: 'G3: P&A Mobilization', stage: 'Well Abandonment', criteria: ['Rig/Vessel contracted', 'P&A program approved'] },
    { name: 'G4: Removal Readiness', stage: 'Facility Removal', criteria: ['Wells secured', 'Hydrocarbon free', 'Heavy lift vessel on site'] },
    { name: 'G5: Site Clearance', stage: 'Site Remediation', criteria: ['All structures removed', 'Debris survey complete'] },
    { name: 'G6: Environmental Sign-off', stage: 'Site Remediation', criteria: ['Seabed survey clean', 'No contamination found'] },
    { name: 'G7: Final Relinquishment', stage: 'Closure', criteria: ['Regulator acceptance', 'Liabilities extinguished'] }
  ],
  tasks: [
    // Planning
    { name: 'Asset Inventory & Data Collection', stage: 'Planning', type: 'task', workstream: 'Engineering' },
    { name: 'Decommissioning Plan Preparation', stage: 'Planning', type: 'task', workstream: 'Regulatory' },
    { name: 'Comparative Assessment Studies', stage: 'Planning', type: 'task', workstream: 'Environmental' },
    { name: 'Cost Estimation (Class 3)', stage: 'Planning', type: 'task', workstream: 'Project Services' },
    { name: 'Stakeholder Engagement', stage: 'Planning', type: 'task', workstream: 'Communications' },
    { name: 'Contracting Strategy', stage: 'Planning', type: 'task', workstream: 'Supply Chain' },
    
    // Well Abandonment
    { name: 'P&A Engineering Program', stage: 'Well Abandonment', type: 'task', workstream: 'Wells' },
    { name: 'Rig/Vessel Mobilization', stage: 'Well Abandonment', type: 'task', workstream: 'Logistics' },
    { name: 'Reservoir Isolation (Cement Plugs)', stage: 'Well Abandonment', type: 'task', workstream: 'Wells' },
    { name: 'Tubing Recovery', stage: 'Well Abandonment', type: 'task', workstream: 'Wells' },
    { name: 'Casing Cutting & Recovery', stage: 'Well Abandonment', type: 'task', workstream: 'Wells' },
    { name: 'Environmental Barrier Installation', stage: 'Well Abandonment', type: 'task', workstream: 'Wells' },
    { name: 'Wellhead Removal', stage: 'Well Abandonment', type: 'task', workstream: 'Wells' },

    // Facility Removal
    { name: 'Make Safe & Clean (Hydrocarbon Free)', stage: 'Facility Removal', type: 'task', workstream: 'Operations' },
    { name: 'Topside Preparation for Lift', stage: 'Facility Removal', type: 'task', workstream: 'Construction' },
    { name: 'Heavy Lift Operations (Topsides)', stage: 'Facility Removal', type: 'task', workstream: 'Marine' },
    { name: 'Jacket/Substructure Removal', stage: 'Facility Removal', type: 'task', workstream: 'Marine' },
    { name: 'Pipeline Cleaning & flushing', stage: 'Facility Removal', type: 'task', workstream: 'Pipelines' },
    { name: 'Subsea Bundle Removal', stage: 'Facility Removal', type: 'task', workstream: 'Subsea' },
    { name: 'Transport to Disposal Yard', stage: 'Facility Removal', type: 'task', workstream: 'Logistics' },

    // Site Remediation
    { name: 'Debris Trawling Survey', stage: 'Site Remediation', type: 'task', workstream: 'Survey' },
    { name: 'Seabed Sampling', stage: 'Site Remediation', type: 'task', workstream: 'Environmental' },
    { name: 'Drill Cuttings Pile Management', stage: 'Site Remediation', type: 'task', workstream: 'Environmental' },
    { name: 'Waste Sorting & Recycling', stage: 'Site Remediation', type: 'task', workstream: 'Waste' },
    { name: 'HazMat Disposal', stage: 'Site Remediation', type: 'task', workstream: 'Waste' },

    // Closure
    { name: 'Close-out Report Generation', stage: 'Closure', type: 'task', workstream: 'Management' },
    { name: 'Regulatory Verification Inspection', stage: 'Closure', type: 'task', workstream: 'Regulatory' },
    { name: 'Final Account Settlement', stage: 'Closure', type: 'task', workstream: 'Finance' },
    { name: 'Lesson Learned Workshop', stage: 'Closure', type: 'task', workstream: 'Management' },
    { name: 'Archive Project Data', stage: 'Closure', type: 'task', workstream: 'IT' }
  ],
  deliverables: [
    { name: 'Decommissioning Plan (Approved)', stage: 'Planning' },
    { name: 'Environmental Impact Assessment', stage: 'Planning' },
    { name: 'Well P&A Program', stage: 'Well Abandonment' },
    { name: 'End of Well Report', stage: 'Well Abandonment' },
    { name: 'Removal Method Statement', stage: 'Facility Removal' },
    { name: 'Waste Management Plan', stage: 'Facility Removal' },
    { name: 'As-Left Seabed Survey', stage: 'Site Remediation' },
    { name: 'Waste Transfer Notes', stage: 'Site Remediation' },
    { name: 'Close-out Report', stage: 'Closure' },
    { name: 'Liability Release Certificate', stage: 'Closure' }
  ],
  risks: [
    { title: 'Well Integrity Issues', category: 'Technical', probability: 4, impact: 5, description: 'Sustained casing pressure or leaks hindering P&A.' },
    { title: 'Structural Integrity', category: 'Technical', probability: 3, impact: 5, description: 'Corroded lifting points failing during removal.' },
    { title: 'NORM Contamination', category: 'HSSE', probability: 5, impact: 4, description: 'Higher than expected NORM levels in piping.' },
    { title: 'Weather Windows', category: 'Schedule', probability: 4, impact: 4, description: 'Heavy lift vessel standby due to bad weather.' },
    { title: 'Regulatory Delays', category: 'Regulatory', probability: 3, impact: 4, description: 'Delay in approval of decommissioning plan.' },
    { title: 'Subsea Obstructions', category: 'Technical', probability: 2, impact: 3, description: 'Unknown debris damaging recovery tools.' },
    { title: 'Vessel Availability', category: 'Resource', probability: 3, impact: 5, description: 'Heavy lift vessel market tightness.' },
    { title: 'Cost Overrun (P&A)', category: 'Commercial', probability: 4, impact: 4, description: 'P&A duration exceeding AFE due to stuck pipe.' },
    { title: 'Mercury/Asbestos Exposure', category: 'HSSE', probability: 3, impact: 5, description: 'Legacy hazardous materials found during dismantling.' },
    { title: 'Environmental Spill', category: 'Environmental', probability: 2, impact: 5, description: 'Loss of containment during pipeline flushing.' },
    { title: 'Stakeholder Opposition', category: 'Regulatory', probability: 2, impact: 4, description: 'Fishermen objecting to debris clearance methods.' },
    { title: 'Scope Creep', category: 'Technical', probability: 3, impact: 3, description: 'Additional remediation required after survey.' },
    { title: 'Data Availability', category: 'Technical', probability: 4, impact: 3, description: 'Missing legacy well files or structural drawings.' },
    { title: 'Disposal Yard Capacity', category: 'Resource', probability: 2, impact: 3, description: 'Yard unable to accept tonnage schedule.' },
    { title: 'Currency Fluctuation', category: 'Commercial', probability: 3, impact: 3, description: 'Exchange rate impact on vessel contracts.' },
    { title: 'Dropped Objects', category: 'HSSE', probability: 2, impact: 5, description: 'Dropped object damaging subsea assets.' }
  ],
  resources: [
    { discipline: 'Decom Project Manager', count: 1, type: 'Person' },
    { discipline: 'Well P&A Engineer', count: 2, type: 'Person' },
    { discipline: 'Structural Engineer', count: 2, type: 'Person' },
    { discipline: 'Environmental Specialist', count: 1, type: 'Person' },
    { discipline: 'Regulatory Liaison', count: 1, type: 'Person' },
    { discipline: 'HSE Advisor', count: 1, type: 'Person' },
    { discipline: 'Waste Coordinator', count: 1, type: 'Person' },
    { discipline: 'Marine Superintendent', count: 1, type: 'Person' },
    { discipline: 'Cost Controller', count: 1, type: 'Person' },
    { discipline: 'Planner', count: 1, type: 'Person' },
    { discipline: 'Subsea Engineer', count: 1, type: 'Person' },
    { discipline: 'Heavy Lift Vessel', count: 1, type: 'Equipment' }
  ]
};