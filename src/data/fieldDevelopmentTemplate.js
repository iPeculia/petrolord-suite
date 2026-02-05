export const FIELD_DEVELOPMENT_TEMPLATE = {
  type: 'Field Development',
  description: 'End-to-end workflow for developing oil & gas fields from concept to first oil.',
  stages: [
    { name: 'Concept', duration_weeks: 8, description: 'Identify and select the best development concept.' },
    { name: 'FEED', duration_weeks: 16, description: 'Front-End Engineering Design to define scope and cost.' },
    { name: 'Detailed Design', duration_weeks: 24, description: 'Detailed engineering and procurement specifications.' },
    { name: 'Execution', duration_weeks: 48, description: 'Construction, fabrication, and installation.' },
    { name: 'Ramp-up', duration_weeks: 12, description: 'Commissioning and production ramp-up to plateau.' },
    { name: 'Closeout', duration_weeks: 4, description: 'Project handover and closure.' }
  ],
  gates: [
    { name: 'G1: Concept Select', stage: 'Concept', criteria: ['Feasibility study complete', 'Concept selected', 'Economics positive'] },
    { name: 'G2: FEED Approval', stage: 'FEED', criteria: ['Basis of Design approved', 'FEED budget approved', 'Risk assessment done'] },
    { name: 'G3: FID (Sanction)', stage: 'FEED', criteria: ['FEED complete', 'Execution plan ready', 'CAPEX/OPEX finalized', 'Board approval'] },
    { name: 'G4: Detailed Design Review', stage: 'Detailed Design', criteria: ['3D Model review', 'HAZOP complete', 'IFC drawings ready'] },
    { name: 'G5: Procurement Strategy', stage: 'Detailed Design', criteria: ['Long lead items ordered', 'Vendor list approved'] },
    { name: 'G6: Construction Start', stage: 'Execution', criteria: ['Site mobilized', 'HSE plan active', 'Materials on site'] },
    { name: 'G7: Pre-Commissioning', stage: 'Execution', criteria: ['Mechanical completion', 'Punch list generated'] },
    { name: 'G8: Start-up Approval', stage: 'Ramp-up', criteria: ['Commissioning complete', 'Safety case approved', 'Handover to Ops'] },
    { name: 'G9: Project Close', stage: 'Closeout', criteria: ['Final report', 'Lessons learned', 'Account closure'] }
  ],
  tasks: [
    // Concept
    { name: 'Reservoir Modeling', stage: 'Concept', type: 'task', workstream: 'Subsurface' },
    { name: 'Development Option Screening', stage: 'Concept', type: 'task', workstream: 'Facilities' },
    { name: 'Preliminary Cost Est (Class 5)', stage: 'Concept', type: 'task', workstream: 'Project Services' },
    { name: 'Concept Select Report', stage: 'Concept', type: 'task', workstream: 'Management' },
    // FEED
    { name: 'Basis of Design (BOD)', stage: 'FEED', type: 'task', workstream: 'Engineering' },
    { name: 'Process Flow Diagrams', stage: 'FEED', type: 'task', workstream: 'Engineering' },
    { name: 'P&IDs Development', stage: 'FEED', type: 'task', workstream: 'Engineering' },
    { name: 'FEED Cost Estimate (Class 3)', stage: 'FEED', type: 'task', workstream: 'Project Services' },
    { name: 'Environmental Impact Assessment', stage: 'FEED', type: 'task', workstream: 'HSSE' },
    { name: 'Field Development Plan (FDP)', stage: 'FEED', type: 'task', workstream: 'Management' },
    // Detailed Design
    { name: '3D Model Review (30/60/90)', stage: 'Detailed Design', type: 'task', workstream: 'Engineering' },
    { name: 'Structural Analysis', stage: 'Detailed Design', type: 'task', workstream: 'Engineering' },
    { name: 'HAZOP / LOPA Studies', stage: 'Detailed Design', type: 'task', workstream: 'HSSE' },
    { name: 'Procurement: Major Equipment', stage: 'Detailed Design', type: 'task', workstream: 'Supply Chain' },
    { name: 'Procurement: Bulk Materials', stage: 'Detailed Design', type: 'task', workstream: 'Supply Chain' },
    // Execution
    { name: 'Site Preparation / Civil Works', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Fabrication: Jacket/Topside', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Pipeline Installation', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Equipment Installation', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'E&I Installation', stage: 'Execution', type: 'task', workstream: 'Construction' },
    { name: 'Drilling Campaign (Dev Wells)', stage: 'Execution', type: 'task', workstream: 'Drilling' },
    // Ramp-up
    { name: 'System Leak Testing', stage: 'Ramp-up', type: 'task', workstream: 'Commissioning' },
    { name: 'Loop Checks & Logic Tests', stage: 'Ramp-up', type: 'task', workstream: 'Commissioning' },
    { name: 'Introduction of Hydrocarbons', stage: 'Ramp-up', type: 'milestone', workstream: 'Operations' },
    { name: 'Performance Testing', stage: 'Ramp-up', type: 'task', workstream: 'Operations' },
    // Closeout
    { name: 'As-Built Documentation', stage: 'Closeout', type: 'task', workstream: 'Engineering' },
    { name: 'Final Project Report', stage: 'Closeout', type: 'task', workstream: 'Management' },
    { name: 'Demobilization', stage: 'Closeout', type: 'task', workstream: 'Logistics' }
  ],
  deliverables: [
    { name: 'Concept Selection Report', stage: 'Concept' },
    { name: 'Basis of Design', stage: 'FEED' },
    { name: 'Field Development Plan', stage: 'FEED' },
    { name: 'Approved AFE', stage: 'FEED' },
    { name: 'Detailed Engineering Package', stage: 'Detailed Design' },
    { name: 'Procurement Plan', stage: 'Detailed Design' },
    { name: 'HSE Safety Case', stage: 'Detailed Design' },
    { name: 'Construction Execution Plan', stage: 'Execution' },
    { name: 'Mechanical Completion Certs', stage: 'Execution' },
    { name: 'Commissioning Procedures', stage: 'Ramp-up' },
    { name: 'Handover Certificate', stage: 'Ramp-up' },
    { name: 'Project Closeout Report', stage: 'Closeout' }
  ],
  risks: [
    { title: 'Reservoir Uncertainty', category: 'Technical', probability: 3, impact: 5, description: 'Reserves lower than P50 estimate.' },
    { title: 'Design Changes', category: 'Technical', probability: 4, impact: 3, description: 'Scope creep during detailed design.' },
    { title: 'Material Delay', category: 'Schedule', probability: 3, impact: 4, description: 'Late delivery of long lead items.' },
    { title: 'Construction Safety', category: 'HSSE', probability: 2, impact: 5, description: 'Lost Time Incident (LTI) during fabrication.' },
    { title: 'Cost Overrun', category: 'Commercial', probability: 4, impact: 4, description: 'Inflation in steel/service prices.' },
    { title: 'Regulatory Approval', category: 'Commercial', probability: 2, impact: 5, description: 'Delay in getting environmental permits.' },
    { title: 'Weather Delay', category: 'Schedule', probability: 3, impact: 3, description: 'Offshore installation window missed.' },
    { title: 'Subcontractor Performance', category: 'Resource', probability: 3, impact: 3, description: 'Fabrication yard capacity issues.' },
    { title: 'Interface Management', category: 'Technical', probability: 3, impact: 4, description: 'Clash between subsea and topside scopes.' },
    { title: 'Commissioning Snags', category: 'Technical', probability: 4, impact: 3, description: 'Control system integration issues.' },
    { title: 'Political Instability', category: 'Commercial', probability: 1, impact: 5, description: 'Regional unrest affecting operations.' },
    { title: 'Cyber Security', category: 'Digital', probability: 2, impact: 4, description: 'Attack on control systems.' }
  ],
  resources: [
    { discipline: 'Project Manager', count: 1, type: 'Person' },
    { discipline: 'Process Engineer', count: 2, type: 'Person' },
    { discipline: 'Structural Engineer', count: 2, type: 'Person' },
    { discipline: 'Mechanical Engineer', count: 2, type: 'Person' },
    { discipline: 'Electrical Engineer', count: 1, type: 'Person' },
    { discipline: 'Instrumentation Eng', count: 1, type: 'Person' },
    { discipline: 'Pipeline Engineer', count: 1, type: 'Person' },
    { discipline: 'Drilling Manager', count: 1, type: 'Person' },
    { discipline: 'HSE Manager', count: 1, type: 'Person' },
    { discipline: 'Cost Controller', count: 1, type: 'Person' },
    { discipline: 'Planner', count: 1, type: 'Person' },
    { discipline: 'Document Controller', count: 1, type: 'Person' },
    { discipline: 'Construction Manager', count: 1, type: 'Person' },
    { discipline: 'Commissioning Lead', count: 1, type: 'Person' },
    { discipline: 'Subsurface Team', count: 1, type: 'Team' }
  ]
};