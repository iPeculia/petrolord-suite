export const BROWNFIELD_TEMPLATE = {
  type: 'Brownfield Development',
  description: 'Workflow for optimizing, upgrading, and extending the life of existing assets.',
  stages: [
    { name: 'Opportunity Identification', duration_weeks: 4, description: 'Screen and assess opportunities to enhance value.' },
    { name: 'Concept & Planning', duration_weeks: 8, description: 'Select best technical solution and define scope.' },
    { name: 'Detailed Design', duration_weeks: 12, description: 'Engineering design for brownfield modifications.' },
    { name: 'Execution', duration_weeks: 20, description: 'Fabrication, shutdown planning, and installation.' },
    { name: 'Ramp-up & Optimization', duration_weeks: 6, description: 'Commissioning, start-up, and performance testing.' },
    { name: 'Closeout', duration_weeks: 4, description: 'Project closure and lessons learned.' }
  ],
  gates: [
    { name: 'G1: Opportunity Confirm', stage: 'Opportunity Identification', criteria: ['Value potential confirmed', 'Strategic fit verified'] },
    { name: 'G2: Concept Select', stage: 'Concept & Planning', criteria: ['Feasibility study done', 'Preferred option selected', 'Rough cost estimate'] },
    { name: 'G3: FID (Sanction)', stage: 'Detailed Design', criteria: ['Execution plan approved', 'Budget sanctioned', 'Risk acceptable'] },
    { name: 'G4: Design Freeze', stage: 'Detailed Design', criteria: ['Engineering complete', 'HAZOP closed', 'Constructability review done'] },
    { name: 'G5: Ready for Installation', stage: 'Execution', criteria: ['Materials on site', 'Shutdown window confirmed', 'Workpacks ready'] },
    { name: 'G6: Mechanical Completion', stage: 'Execution', criteria: ['Installation complete', 'Punchlist items manageable'] },
    { name: 'G7: Start-up Approval', stage: 'Ramp-up & Optimization', criteria: ['Pre-startup safety review (PSSR) complete'] },
    { name: 'G8: Project Close', stage: 'Closeout', criteria: ['Performance targets met', 'Handover to ops complete'] }
  ],
  tasks: [
    // Opportunity
    { name: 'Screening of Opportunities', stage: 'Opportunity Identification', type: 'task', workstream: 'Commercial' },
    { name: 'Infrastructure Integrity Audit', stage: 'Opportunity Identification', type: 'task', workstream: 'Engineering' },
    { name: 'Bottleneck Identification', stage: 'Opportunity Identification', type: 'task', workstream: 'Process' },
    // Concept
    { name: 'Develop Upgrade Concepts', stage: 'Concept & Planning', type: 'task', workstream: 'Engineering' },
    { name: 'Simulate Production Uplift', stage: 'Concept & Planning', type: 'task', workstream: 'Reservoir' },
    { name: 'Brownfield Cost Estimation', stage: 'Concept & Planning', type: 'task', workstream: 'Project Services' },
    { name: 'Tie-in Point Verification', stage: 'Concept & Planning', type: 'task', workstream: 'Engineering' },
    // Design
    { name: '3D Laser Scanning', stage: 'Detailed Design', type: 'task', workstream: 'Engineering' },
    { name: 'Piping Design Modifications', stage: 'Detailed Design', type: 'task', workstream: 'Engineering' },
    { name: 'Electrical Load Analysis', stage: 'Detailed Design', type: 'task', workstream: 'Electrical' },
    { name: 'Constructability Review', stage: 'Detailed Design', type: 'task', workstream: 'Construction' },
    { name: 'Shutdown Planning', stage: 'Detailed Design', type: 'task', workstream: 'Operations' },
    // Execution
    { name: 'Fabrication of Spools/Skids', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Shutdown Execution', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Tie-in Execution', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Control System Updates', stage: 'Execution', type: 'task', workstream: 'Instrumentation' },
    // Ramp-up
    { name: 'Leak Testing', stage: 'Ramp-up & Optimization', type: 'task', workstream: 'Commissioning' },
    { name: 'Process Stabilization', stage: 'Ramp-up & Optimization', type: 'task', workstream: 'Operations' },
    { name: 'Performance Testing', stage: 'Ramp-up & Optimization', type: 'task', workstream: 'Operations' },
    // Closeout
    { name: 'As-Built Documentation', stage: 'Closeout', type: 'task', workstream: 'Engineering' },
    { name: 'Closeout Report', stage: 'Closeout', type: 'task', workstream: 'Project Management' }
  ],
  deliverables: [
    { name: 'Opportunity Assessment Report', stage: 'Opportunity Identification' },
    { name: 'Business Case', stage: 'Opportunity Identification' },
    { name: 'Basis of Design (Brownfield)', stage: 'Concept & Planning' },
    { name: 'Survey & Laser Scan Report', stage: 'Detailed Design' },
    { name: 'Construction Workpacks', stage: 'Detailed Design' },
    { name: 'Shutdown Plan', stage: 'Detailed Design' },
    { name: 'Tie-in Schedule', stage: 'Execution' },
    { name: 'Commissioning Procedures', stage: 'Ramp-up & Optimization' },
    { name: 'Production Uplift Verification', stage: 'Closeout' }
  ],
  risks: [
    { title: 'Unknown Site Conditions', category: 'Technical', probability: 4, impact: 4, description: 'As-builts do not match actual facility.' },
    { title: 'Simultaneous Ops (SIMOPS)', category: 'HSSE', probability: 5, impact: 5, description: 'Construction conflict with live production.' },
    { title: 'Shutdown Overrun', category: 'Schedule', probability: 3, impact: 5, description: 'Production deferment exceeds plan.' },
    { title: 'Tie-in Integrity', category: 'Technical', probability: 2, impact: 5, description: 'Leak at new tie-in points.' },
    { title: 'Material degradation', category: 'Technical', probability: 3, impact: 4, description: 'Existing pipe wall thickness too low for welding.' },
    { title: 'Space Constraints', category: 'Technical', probability: 4, impact: 3, description: 'No room for new equipment on deck.' },
    { title: 'Weight Limitations', category: 'Technical', probability: 3, impact: 4, description: 'Structural capacity maxed out.' },
    { title: 'Regulatory Compliance', category: 'Commercial', probability: 2, impact: 4, description: 'New codes apply to old facility.' },
    { title: 'Resource Availability', category: 'Resource', probability: 3, impact: 3, description: 'Specialist welders shortage.' },
    { title: 'Cyber Security', category: 'Digital', probability: 2, impact: 4, description: 'Integration of new digital systems.' }
  ],
  resources: [
    { discipline: 'Project Manager', count: 1, type: 'Person' },
    { discipline: 'Brownfield Engineer', count: 2, type: 'Person' },
    { discipline: 'Construction Lead', count: 1, type: 'Person' },
    { discipline: 'Operations Rep', count: 1, type: 'Person' },
    { discipline: 'Process Engineer', count: 1, type: 'Person' },
    { discipline: 'Structural Engineer', count: 1, type: 'Person' },
    { discipline: 'Planner', count: 1, type: 'Person' },
    { discipline: 'HSE Advisor', count: 1, type: 'Person' },
    { discipline: 'Cost Controller', count: 1, type: 'Person' },
    { discipline: 'Commissioning Tech', count: 2, type: 'Person' }
  ]
};