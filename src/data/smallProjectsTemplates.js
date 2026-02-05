export const SMALL_PROJECTS_TEMPLATES = {
  'Well Intervention': {
    description: 'Workflow for well maintenance and production enhancement.',
    stages: [
      { name: 'Planning', duration_weeks: 2, description: 'Scope definition and resource planning.' },
      { name: 'Execution', duration_weeks: 2, description: 'Field operations and intervention.' },
      { name: 'Closure', duration_weeks: 1, description: 'Post-job reporting and analysis.' }
    ],
    gates: [
      { name: 'G1: Plan Approval', stage: 'Planning', criteria: ['Program approved', 'Resources secured'] },
      { name: 'G2: Ready to Execute', stage: 'Execution', criteria: ['Equipment on site', 'Safety meeting done'] },
      { name: 'G3: Job Close', stage: 'Closure', criteria: ['Site restored', 'Final report signed'] }
    ],
    tasks: [
      { name: 'Well History Review', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Intervention Program Design', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Risk Assessment (TRA)', stage: 'Planning', workstream: 'HSSE' },
      { name: 'Resource Mobilization', stage: 'Planning', workstream: 'Logistics' },
      { name: 'Site Preparation', stage: 'Execution', workstream: 'Operations' },
      { name: 'Rig Up / Equipment Setup', stage: 'Execution', workstream: 'Operations' },
      { name: 'Pressure Testing', stage: 'Execution', workstream: 'Operations' },
      { name: 'Run in Hole', stage: 'Execution', workstream: 'Operations' },
      { name: 'Perform Intervention Treatment', stage: 'Execution', workstream: 'Operations' },
      { name: 'Pull out of Hole', stage: 'Execution', workstream: 'Operations' },
      { name: 'Rig Down', stage: 'Execution', workstream: 'Operations' },
      { name: 'Site Cleanup', stage: 'Closure', workstream: 'Operations' },
      { name: 'Post-Job Report', stage: 'Closure', workstream: 'Engineering' },
      { name: 'Cost Reconciliation', stage: 'Closure', workstream: 'Finance' },
      { name: 'Update Well File', stage: 'Closure', workstream: 'Data Management' }
    ],
    risks: [
      { title: 'Stuck Tool', category: 'Technical', probability: 3, impact: 4 },
      { title: 'Well Control Event', category: 'HSSE', probability: 2, impact: 5 },
      { title: 'Equipment Failure', category: 'Technical', probability: 3, impact: 3 },
      { title: 'Weather Delay', category: 'Schedule', probability: 3, impact: 2 },
      { title: 'Access Issues', category: 'Logistics', probability: 2, impact: 3 },
      { title: 'H2S Release', category: 'HSSE', probability: 1, impact: 5 },
      { title: 'Cost Overrun', category: 'Commercial', probability: 3, impact: 3 },
      { title: 'Data Loss', category: 'Digital', probability: 2, impact: 2 },
      { title: 'Regulatory Audit', category: 'Regulatory', probability: 2, impact: 3 },
      { title: 'Personnel Injury', category: 'HSSE', probability: 2, impact: 4 }
    ],
    kpis: [
      { name: 'NPT (Non-Productive Time)', target: 5, unit: '%' },
      { name: 'Budget Adherence', target: 100, unit: '%' },
      { name: 'Schedule Adherence', target: 100, unit: '%' },
      { name: 'Safety Incidents', target: 0, unit: 'count' },
      { name: 'Production Uplift', target: 100, unit: 'bbl/d' },
      { name: 'Job Success Rate', target: 100, unit: '%' },
      { name: 'Cost per Foot', target: 500, unit: '$' },
      { name: 'Resource Utilization', target: 90, unit: '%' },
      { name: 'Report Cycle Time', target: 3, unit: 'days' },
      { name: 'Environmental Spills', target: 0, unit: 'count' },
      { name: 'Stakeholder Satisfaction', target: 90, unit: '%' },
      { name: 'Lessons Learned Captured', target: 1, unit: 'count' }
    ]
  },
  'Facility Upgrade': {
    description: 'Minor modifications or upgrades to existing surface facilities.',
    stages: [
      { name: 'Planning', duration_weeks: 4, description: 'Engineering and procurement planning.' },
      { name: 'Execution', duration_weeks: 8, description: 'Installation and construction.' },
      { name: 'Commissioning', duration_weeks: 2, description: 'Testing and handover.' }
    ],
    gates: [
      { name: 'G1: Design Approval', stage: 'Planning', criteria: ['Design frozen', 'Materials ordered'] },
      { name: 'G2: Construction Start', stage: 'Execution', criteria: ['Permits in place', 'Site safe'] },
      { name: 'G3: Handover', stage: 'Commissioning', criteria: ['Punchlist cleared', 'Ops acceptance'] }
    ],
    tasks: [
      { name: 'Site Survey', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Detailed Design', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Material Procurement', stage: 'Planning', workstream: 'Supply Chain' },
      { name: 'Constructability Review', stage: 'Planning', workstream: 'Construction' },
      { name: 'Mobilization', stage: 'Execution', workstream: 'Logistics' },
      { name: 'Isolations & LOTO', stage: 'Execution', workstream: 'Operations' },
      { name: 'Demolition/Removal', stage: 'Execution', workstream: 'Construction' },
      { name: 'Installation of New Equipment', stage: 'Execution', workstream: 'Construction' },
      { name: 'Piping & Electrical Tie-ins', stage: 'Execution', workstream: 'Construction' },
      { name: 'Mechanical Completion', stage: 'Execution', workstream: 'Construction' },
      { name: 'Leak Testing', stage: 'Commissioning', workstream: 'Commissioning' },
      { name: 'Loop Checks', stage: 'Commissioning', workstream: 'Commissioning' },
      { name: 'Functional Testing', stage: 'Commissioning', workstream: 'Commissioning' },
      { name: 'Start-up', stage: 'Commissioning', workstream: 'Operations' },
      { name: 'Final Handover', stage: 'Commissioning', workstream: 'Project Management' }
    ],
    risks: [
      { title: 'Design Clash', category: 'Technical', probability: 3, impact: 4 },
      { title: 'Material Delay', category: 'Schedule', probability: 4, impact: 4 },
      { title: 'SIMOPS Conflict', category: 'HSSE', probability: 3, impact: 5 },
      { title: 'Permit Delay', category: 'Regulatory', probability: 2, impact: 3 },
      { title: 'Budget Overrun', category: 'Commercial', probability: 3, impact: 3 },
      { title: 'Resource Shortage', category: 'Resource', probability: 3, impact: 3 },
      { title: 'Unknown Site Conditions', category: 'Technical', probability: 3, impact: 3 },
      { title: 'Testing Failure', category: 'Technical', probability: 2, impact: 4 },
      { title: 'Scope Creep', category: 'Technical', probability: 4, impact: 3 },
      { title: 'Safety Incident', category: 'HSSE', probability: 2, impact: 5 }
    ],
    kpis: [
      { name: 'SPI (Schedule Performance)', target: 1.0, unit: 'index' },
      { name: 'CPI (Cost Performance)', target: 1.0, unit: 'index' },
      { name: 'Construction Progress', target: 100, unit: '%' },
      { name: 'Engineering Progress', target: 100, unit: '%' },
      { name: 'Procurement Progress', target: 100, unit: '%' },
      { name: 'Punchlist Items', target: 0, unit: 'count' },
      { name: 'Rework %', target: 2, unit: '%' },
      { name: 'Safety Days w/o Incident', target: 100, unit: 'days' },
      { name: 'Materials On-Site', target: 100, unit: '%' },
      { name: 'Commissioning Success', target: 100, unit: '%' },
      { name: 'Ops Acceptance', target: 1, unit: 'bool' },
      { name: 'Final Cost Variance', target: 0, unit: '%' }
    ]
  },
  'Optimization': {
    description: 'Process or system optimization to improve efficiency or output.',
    stages: [
      { name: 'Planning', duration_weeks: 3, description: 'Data analysis and strategy selection.' },
      { name: 'Implementation', duration_weeks: 4, description: 'Applying changes or new settings.' },
      { name: 'Verification', duration_weeks: 3, description: 'Monitoring results and stabilizing.' }
    ],
    gates: [
      { name: 'G1: Strategy Select', stage: 'Planning', criteria: ['ROI confirmed', 'Baseline established'] },
      { name: 'G2: Go Live', stage: 'Implementation', criteria: ['Changes ready', 'Risk assessed'] },
      { name: 'G3: Performance Sign-off', stage: 'Verification', criteria: ['Targets met', 'Stable operation'] }
    ],
    tasks: [
      { name: 'Baseline Data Collection', stage: 'Planning', workstream: 'Engineering' },
      { name: 'System Modeling', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Identify Bottlenecks', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Develop Optimization Plan', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Approval of Changes', stage: 'Planning', workstream: 'Management' },
      { name: 'Implement Control Changes', stage: 'Implementation', workstream: 'Operations' },
      { name: 'Chemical Injection Adjustment', stage: 'Implementation', workstream: 'Operations' },
      { name: 'Equipment Setpoint Tuning', stage: 'Implementation', workstream: 'Operations' },
      { name: 'Process Monitoring', stage: 'Implementation', workstream: 'Engineering' },
      { name: 'Troubleshooting', stage: 'Implementation', workstream: 'Operations' },
      { name: 'Performance Testing', stage: 'Verification', workstream: 'Engineering' },
      { name: 'Data Analysis', stage: 'Verification', workstream: 'Digital' },
      { name: 'ROI Calculation', stage: 'Verification', workstream: 'Finance' },
      { name: 'Standard Operating Proc Update', stage: 'Verification', workstream: 'Operations' },
      { name: 'Final Report', stage: 'Verification', workstream: 'Project Management' }
    ],
    risks: [
      { title: 'Process Instability', category: 'Technical', probability: 3, impact: 4 },
      { title: 'Production Loss', category: 'Commercial', probability: 2, impact: 5 },
      { title: 'Equipment Damage', category: 'Technical', probability: 2, impact: 4 },
      { title: 'Inaccurate Data', category: 'Digital', probability: 3, impact: 3 },
      { title: 'Model Mismatch', category: 'Technical', probability: 3, impact: 3 },
      { title: 'Resistance to Change', category: 'Resource', probability: 3, impact: 2 },
      { title: 'Regulatory Excursion', category: 'Regulatory', probability: 1, impact: 5 },
      { title: 'Chemical Incompatibility', category: 'Technical', probability: 2, impact: 3 },
      { title: 'Sensor Failure', category: 'Technical', probability: 2, impact: 3 },
      { title: 'Benefit Overestimation', category: 'Commercial', probability: 3, impact: 3 }
    ],
    kpis: [
      { name: 'Throughput Increase', target: 5, unit: '%' },
      { name: 'Energy Efficiency', target: 10, unit: '%' },
      { name: 'Cost Savings', target: 100000, unit: '$' },
      { name: 'Process Stability Index', target: 95, unit: '%' },
      { name: 'Uptime', target: 99, unit: '%' },
      { name: 'Implementation Cost', target: 50000, unit: '$' },
      { name: 'Payback Period', target: 6, unit: 'months' },
      { name: 'Quality Compliance', target: 100, unit: '%' },
      { name: 'Operator Training', target: 100, unit: '%' },
      { name: 'Model Accuracy', target: 95, unit: '%' },
      { name: 'Alarm Rate Reduction', target: 20, unit: '%' },
      { name: 'Chemical Usage', target: -10, unit: '%' }
    ]
  },
  'Workover': {
    description: 'Major well maintenance or remedial treatments.',
    stages: [
      { name: 'Planning', duration_weeks: 3, description: 'Diagnostic and program preparation.' },
      { name: 'Execution', duration_weeks: 3, description: 'Rig operations.' },
      { name: 'Completion', duration_weeks: 1, description: 'Return to production.' }
    ],
    gates: [
      { name: 'G1: Program Approval', stage: 'Planning', criteria: ['Diagnosis confirmed', 'AFE signed'] },
      { name: 'G2: Rig Mobilization', stage: 'Execution', criteria: ['Contract signed', 'Site ready'] },
      { name: 'G3: Production Restart', stage: 'Completion', criteria: ['Well secured', 'Flow confirmed'] }
    ],
    tasks: [
      { name: 'Candidate Selection', stage: 'Planning', workstream: 'Subsurface' },
      { name: 'Workover Prognosis', stage: 'Planning', workstream: 'Engineering' },
      { name: 'Long Lead Items Order', stage: 'Planning', workstream: 'Supply Chain' },
      { name: 'Rig Contracting', stage: 'Planning', workstream: 'Supply Chain' },
      { name: 'Move Rig to Location', stage: 'Execution', workstream: 'Logistics' },
      { name: 'Kill Well', stage: 'Execution', workstream: 'Operations' },
      { name: 'Pull Tubing', stage: 'Execution', workstream: 'Operations' },
      { name: 'Remedial Cementing/Packer', stage: 'Execution', workstream: 'Operations' },
      { name: 'Run New Completion', stage: 'Execution', workstream: 'Operations' },
      { name: 'Nipple Up Tree', stage: 'Execution', workstream: 'Operations' },
      { name: 'Swab Well', stage: 'Completion', workstream: 'Operations' },
      { name: 'Production Test', stage: 'Completion', workstream: 'Operations' },
      { name: 'Rig Release', stage: 'Completion', workstream: 'Logistics' },
      { name: 'Final Cost Report', stage: 'Completion', workstream: 'Finance' },
      { name: 'Update Schematics', stage: 'Completion', workstream: 'Engineering' }
    ],
    risks: [
      { title: 'Fishing Operations', category: 'Technical', probability: 3, impact: 5 },
      { title: 'Tight Spot / Restrictions', category: 'Technical', probability: 3, impact: 4 },
      { title: 'Formation Damage', category: 'Technical', probability: 2, impact: 5 },
      { title: 'Cost Overrun', category: 'Commercial', probability: 4, impact: 3 },
      { title: 'Schedule Delay', category: 'Schedule', probability: 4, impact: 3 },
      { title: 'Well Control', category: 'HSSE', probability: 2, impact: 5 },
      { title: 'Equipment Failure', category: 'Technical', probability: 3, impact: 3 },
      { title: 'Weather', category: 'Schedule', probability: 3, impact: 2 },
      { title: 'Logistics Delay', category: 'Logistics', probability: 2, impact: 3 },
      { title: 'Regulatory Compliance', category: 'Regulatory', probability: 1, impact: 4 }
    ],
    kpis: [
      { name: 'Job Cost', target: 100, unit: '%' },
      { name: 'Job Duration', target: 100, unit: '%' },
      { name: 'NPT', target: 5, unit: '%' },
      { name: 'Safety Incidents', target: 0, unit: 'count' },
      { name: 'Post-Job Production', target: 500, unit: 'bbl/d' },
      { name: 'Incremental Reserves', target: 100, unit: 'mbbl' },
      { name: 'Rig Efficiency', target: 90, unit: '%' },
      { name: 'Materials Usage', target: 100, unit: '%' },
      { name: 'Contractor Performance', target: 4, unit: 'rating' },
      { name: 'Environmental Compliance', target: 100, unit: '%' },
      { name: 'Well Integrity Status', target: 1, unit: 'bool' },
      { name: 'Data Quality', target: 95, unit: '%' }
    ]
  },
  'R&D': {
    description: 'Research and Development projects for new technologies or methods.',
    stages: [
      { name: 'Research', duration_weeks: 12, description: 'Literature review and lab testing.' },
      { name: 'Development', duration_weeks: 16, description: 'Prototyping and field trial prep.' },
      { name: 'Validation', duration_weeks: 8, description: 'Field testing and final analysis.' }
    ],
    gates: [
      { name: 'G1: Feasibility Confirm', stage: 'Research', criteria: ['Concept proven', 'Lab results positive'] },
      { name: 'G2: Prototype Ready', stage: 'Development', criteria: ['Design frozen', 'Safety review passed'] },
      { name: 'G3: Tech Qualified', stage: 'Validation', criteria: ['Field success', 'Commercial ready'] }
    ],
    tasks: [
      { name: 'Literature Review', stage: 'Research', workstream: 'R&D' },
      { name: 'Hypothesis Definition', stage: 'Research', workstream: 'R&D' },
      { name: 'Lab Experimentation', stage: 'Research', workstream: 'R&D' },
      { name: 'Data Analysis', stage: 'Research', workstream: 'R&D' },
      { name: 'Feasibility Report', stage: 'Research', workstream: 'Management' },
      { name: 'Prototype Design', stage: 'Development', workstream: 'Engineering' },
      { name: 'Fabrication', stage: 'Development', workstream: 'Engineering' },
      { name: 'Bench Testing', stage: 'Development', workstream: 'R&D' },
      { name: 'Field Trial Planning', stage: 'Development', workstream: 'Operations' },
      { name: 'Risk Assessment', stage: 'Development', workstream: 'HSSE' },
      { name: 'Field Trial Execution', stage: 'Validation', workstream: 'Operations' },
      { name: 'Performance Monitoring', stage: 'Validation', workstream: 'R&D' },
      { name: 'Post-Trial Analysis', stage: 'Validation', workstream: 'R&D' },
      { name: 'Commercialization Plan', stage: 'Validation', workstream: 'Commercial' },
      { name: 'Final Tech Report', stage: 'Validation', workstream: 'Management' }
    ],
    risks: [
      { title: 'Technical Failure', category: 'Technical', probability: 4, impact: 5 },
      { title: 'Cost Escalation', category: 'Commercial', probability: 3, impact: 3 },
      { title: 'Timeline Slip', category: 'Schedule', probability: 4, impact: 3 },
      { title: 'IP Issues', category: 'Legal', probability: 2, impact: 5 },
      { title: 'Safety in Field Trial', category: 'HSSE', probability: 2, impact: 5 },
      { title: 'Lack of Resources', category: 'Resource', probability: 3, impact: 4 },
      { title: 'Market Changes', category: 'Commercial', probability: 2, impact: 3 },
      { title: 'Data Validity', category: 'Digital', probability: 3, impact: 4 },
      { title: 'Partner Alignment', category: 'Commercial', probability: 3, impact: 3 },
      { title: 'Regulatory Barriers', category: 'Regulatory', probability: 2, impact: 4 }
    ],
    kpis: [
      { name: 'Milestones Met', target: 100, unit: '%' },
      { name: 'Budget Utilization', target: 100, unit: '%' },
      { name: 'TRL Advancement', target: 2, unit: 'levels' },
      { name: 'Patent Applications', target: 1, unit: 'count' },
      { name: 'Publication Count', target: 1, unit: 'count' },
      { name: 'Prototype Success', target: 1, unit: 'bool' },
      { name: 'Field Trial Uptime', target: 90, unit: '%' },
      { name: 'Data Points Collected', target: 1000, unit: 'count' },
      { name: 'Team Velocity', target: 100, unit: '%' },
      { name: 'Stakeholder Engagement', target: 90, unit: '%' },
      { name: 'Commercial Potential', target: 10, unit: '$MM' },
      { name: 'Innovation Index', target: 8, unit: 'rating' }
    ]
  }
};