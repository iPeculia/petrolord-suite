export const EXPLORATION_TEMPLATE = {
  type: 'Exploration',
  description: 'Standard workflow for identifying and evaluating potential hydrocarbon accumulations.',
  stages: [
    { name: 'Prospecting', duration_weeks: 4, description: 'Identify leads and acquire data.' },
    { name: 'Seismic Acquisition & Processing', duration_weeks: 12, description: 'Acquire and process 2D/3D seismic data.' },
    { name: 'Subsurface Evaluation', duration_weeks: 8, description: 'Detailed interpretation and modeling.' },
    { name: 'Commercial Evaluation', duration_weeks: 4, description: 'Economic analysis and risk assessment.' },
    { name: 'Decision & Closure', duration_weeks: 2, description: 'Final investment decision (FID) and documentation.' }
  ],
  gates: [
    { name: 'G1: Seismic Approval', stage: 'Prospecting', criteria: ['Leads identified', 'Data available', 'Budget approved'] },
    { name: 'G2: Seismic Processing QC', stage: 'Seismic Acquisition & Processing', criteria: ['Processing complete', 'Quality acceptable'] },
    { name: 'G3: Geological Model Review', stage: 'Subsurface Evaluation', criteria: ['Model built', 'Volumetrics calculated', 'Peer review done'] },
    { name: 'G4: Risk Assessment Review', stage: 'Subsurface Evaluation', criteria: ['Risks cataloged', 'Mitigation plans in place'] },
    { name: 'G5: Commercial Review', stage: 'Commercial Evaluation', criteria: ['Economics positive', 'Legal check complete'] },
    { name: 'G6: Investment Decision (FID)', stage: 'Decision & Closure', criteria: ['Management approval', 'Funding secured'] }
  ],
  tasks: [
    // Prospecting
    { name: 'Regional Basin Screening', stage: 'Prospecting', type: 'task', workstream: 'Subsurface' },
    { name: 'Data Licensing & Purchase', stage: 'Prospecting', type: 'task', workstream: 'Commercial' },
    { name: 'Initial Lead Mapping', stage: 'Prospecting', type: 'task', workstream: 'Subsurface' },
    { name: 'Seismic Survey Design', stage: 'Prospecting', type: 'task', workstream: 'Subsurface' },
    // Seismic
    { name: 'Seismic Acquisition Tender', stage: 'Seismic Acquisition & Processing', type: 'task', workstream: 'Commercial' },
    { name: 'Field Acquisition Operations', stage: 'Seismic Acquisition & Processing', type: 'task', workstream: 'Operations' },
    { name: 'Seismic Processing (PSTM/PSDM)', stage: 'Seismic Acquisition & Processing', type: 'task', workstream: 'Subsurface' },
    { name: 'Seismic QC & Validation', stage: 'Seismic Acquisition & Processing', type: 'task', workstream: 'Subsurface' },
    // Subsurface
    { name: 'Seismic Interpretation', stage: 'Subsurface Evaluation', type: 'task', workstream: 'Subsurface' },
    { name: 'Velocity Modeling', stage: 'Subsurface Evaluation', type: 'task', workstream: 'Subsurface' },
    { name: 'Petrophysical Analysis (Offset Wells)', stage: 'Subsurface Evaluation', type: 'task', workstream: 'Subsurface' },
    { name: 'Geological Modeling (Static)', stage: 'Subsurface Evaluation', type: 'task', workstream: 'Subsurface' },
    { name: 'Charge Risk Assessment', stage: 'Subsurface Evaluation', type: 'task', workstream: 'Subsurface' },
    { name: 'Probabilistic Volumetrics', stage: 'Subsurface Evaluation', type: 'task', workstream: 'Subsurface' },
    // Commercial
    { name: 'Well Cost Estimation', stage: 'Commercial Evaluation', type: 'task', workstream: 'Drilling' },
    { name: 'Economic Modeling (NPV/IRR)', stage: 'Commercial Evaluation', type: 'task', workstream: 'Economics' },
    { name: 'Fiscal Regime Analysis', stage: 'Commercial Evaluation', type: 'task', workstream: 'Commercial' },
    { name: 'Risk & Uncertainty Analysis', stage: 'Commercial Evaluation', type: 'task', workstream: 'Economics' },
    // Decision
    { name: 'Prepare Decision Support Package', stage: 'Decision & Closure', type: 'task', workstream: 'Project Management' },
    { name: 'Final Investment Decision Meeting', stage: 'Decision & Closure', type: 'milestone', workstream: 'Project Management' },
    { name: 'Project Close-out / Handover', stage: 'Decision & Closure', type: 'task', workstream: 'Project Management' }
  ],
  deliverables: [
    { name: 'Seismic Survey Plan', stage: 'Prospecting' },
    { name: 'Processed Seismic Data (SEGY)', stage: 'Seismic Acquisition & Processing' },
    { name: 'Seismic Interpretation Report', stage: 'Subsurface Evaluation' },
    { name: 'Static Geological Model', stage: 'Subsurface Evaluation' },
    { name: 'Petrophysical Evaluation Report', stage: 'Subsurface Evaluation' },
    { name: 'Charge & Seal Risk Assessment', stage: 'Subsurface Evaluation' },
    { name: 'Volumetric Estimate Report (P10/P50/P90)', stage: 'Commercial Evaluation' },
    { name: 'Drilling Cost Estimate (AFE)', stage: 'Commercial Evaluation' },
    { name: 'Economic Model & Commercial Assessment', stage: 'Commercial Evaluation' },
    { name: 'Decision Support Document (FID)', stage: 'Decision & Closure' }
  ],
  risks: [
    { title: 'Charge Failure', category: 'Subsurface', probability: 3, impact: 5, description: 'Source rock may not be mature or migration path blocked.' },
    { title: 'Seal Integrity', category: 'Subsurface', probability: 2, impact: 5, description: 'Top seal may be breached or insufficient.' },
    { title: 'Trap Definition', category: 'Subsurface', probability: 3, impact: 4, description: 'Seismic velocity uncertainty affecting depth structure.' },
    { title: 'Reservoir Quality', category: 'Subsurface', probability: 3, impact: 4, description: 'Porosity/Permeability lower than expected.' },
    { title: 'Seismic Data Quality', category: 'Seismic', probability: 2, impact: 3, description: 'Poor imaging due to salt or complex overburden.' },
    { title: 'Processing Delays', category: 'Seismic', probability: 3, impact: 2, description: 'Vendor backlog delaying processing delivery.' },
    { title: 'Regulatory Approval Delay', category: 'Commercial', probability: 2, impact: 4, description: 'Environmental permits delayed.' },
    { title: 'Oil Price Volatility', category: 'Commercial', probability: 4, impact: 3, description: 'Economic viability sensitivity to price drop.' },
    { title: 'Drilling Cost Overrun', category: 'Commercial', probability: 3, impact: 3, description: 'Rig rates increasing.' },
    { title: 'HSE Incident during Ops', category: 'HSSE', probability: 1, impact: 5, description: 'Safety incident during seismic acquisition.' },
    { title: 'Data Loss / Corruption', category: 'Digital', probability: 1, impact: 4, description: 'Loss of critical seismic data.' },
    { title: 'Partner Alignment', category: 'Commercial', probability: 2, impact: 3, description: 'JV partners disagree on technical scope.' }
  ],
  resources: [
    { discipline: 'Senior Geologist', count: 1, type: 'Person' },
    { discipline: 'Geophysicist', count: 2, type: 'Person' },
    { discipline: 'Petrophysicist', count: 1, type: 'Person' },
    { discipline: 'Reservoir Engineer', count: 1, type: 'Person' },
    { discipline: 'Drilling Engineer', count: 1, type: 'Person' },
    { discipline: 'Commercial Analyst', count: 1, type: 'Person' },
    { discipline: 'Data Manager', count: 1, type: 'Person' },
    { discipline: 'Project Manager', count: 1, type: 'Person' },
    { discipline: 'Seismic Processing Vendor', count: 1, type: 'Vendor' }
  ]
};