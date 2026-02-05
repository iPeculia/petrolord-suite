import { 
  Database, Calculator, Droplets, Activity, GitFork, 
  RefreshCw, Sliders, Save, FileOutput, Network 
} from 'lucide-react';

export const workflowNodeTypes = [
  { type: 'input', label: 'Input Data', category: 'Input', icon: Database, description: 'Load LAS/CSV well data' },
  { type: 'calc_vsh', label: 'Clay Volume', category: 'Calculation', icon: Calculator, description: 'Gamma Ray / SP methods' },
  { type: 'calc_phi', label: 'Porosity', category: 'Calculation', icon: Calculator, description: 'Density / Neutron / Sonic' },
  { type: 'calc_sw', label: 'Saturation', category: 'Calculation', icon: Droplets, description: 'Archie / Simandoux' },
  { type: 'calc_perm', label: 'Permeability', category: 'Calculation', icon: Activity, description: 'Timur-Coates / SDR' },
  { type: 'logic_if', label: 'Condition (If)', category: 'Logic', icon: GitFork, description: 'Branch based on value' },
  { type: 'logic_loop', label: 'Loop Wells', category: 'Logic', icon: RefreshCw, description: 'Iterate over project wells' },
  { type: 'transform', label: 'Transform', category: 'Data', icon: Sliders, description: 'Normalize / Filter / Smooth' },
  { type: 'integration', label: 'External API', category: 'Integration', icon: Network, description: 'Fetch/Push external data' },
  { type: 'output', label: 'Save/Export', category: 'Output', icon: Save, description: 'Save to database or file' },
];

export const initialTemplates = [
  {
    id: 'tpl_basic',
    name: 'Triple Combo Analysis',
    description: 'Standard petrophysical workflow: Vsh -> Porosity -> Water Saturation',
    tags: ['Standard', 'Basic'],
    nodes: [
      { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Input Well Data' } },
      { id: '2', type: 'calc_vsh', position: { x: 250, y: 100 }, data: { label: 'Vsh (GR)' } },
      { id: '3', type: 'calc_phi', position: { x: 250, y: 200 }, data: { label: 'Eff. Porosity' } },
      { id: '4', type: 'calc_sw', position: { x: 250, y: 300 }, data: { label: 'Sw (Archie)' } },
      { id: '5', type: 'output', position: { x: 250, y: 400 }, data: { label: 'Save Curves' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
    ]
  },
  {
    id: 'tpl_pay',
    name: 'Net Pay Determination',
    description: 'Determine net pay using cutoffs for Vsh, Porosity, and Sw',
    tags: ['Reserves', 'Advanced'],
    nodes: [
      { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Calc Results' } },
      { id: '2', type: 'transform', position: { x: 250, y: 100 }, data: { label: 'Apply Cutoffs' } },
      { id: '3', type: 'logic_if', position: { x: 250, y: 200 }, data: { label: 'Is Pay?' } },
      { id: '4', type: 'calc_perm', position: { x: 150, y: 300 }, data: { label: 'Est. Perm' } },
      { id: '5', type: 'output', position: { x: 250, y: 400 }, data: { label: 'Net Pay Flag' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e3-5', source: '3', target: '5', label: 'No' },
    ]
  },
  {
    id: 'tpl_multi',
    name: 'Batch Processing (Multi-Well)',
    description: 'Iterate through all wells in project and apply normalization',
    tags: ['Automation', 'Batch'],
    nodes: [
      { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Project Wells' } },
      { id: '2', type: 'logic_loop', position: { x: 250, y: 100 }, data: { label: 'For Each Well' } },
      { id: '3', type: 'transform', position: { x: 250, y: 200 }, data: { label: 'Normalize GR' } },
      { id: '4', type: 'output', position: { x: 250, y: 300 }, data: { label: 'Update Project' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  }
];

export const mockExecutionHistory = [
  { id: 'run_123', name: 'Daily Well Sync', status: 'Success', duration: '45s', timestamp: '2025-11-22T08:00:00Z', user: 'System', nodes: 12 },
  { id: 'run_124', name: 'Porosity Batch', status: 'Failed', duration: '12s', timestamp: '2025-11-22T09:15:00Z', user: 'Analyst A', nodes: 5 },
  { id: 'run_125', name: 'Triple Combo - Well 4', status: 'Success', duration: '2.3s', timestamp: '2025-11-22T10:30:00Z', user: 'Analyst B', nodes: 8 },
  { id: 'run_126', name: 'Export Reports', status: 'Success', duration: '1m 20s', timestamp: '2025-11-22T11:00:00Z', user: 'System', nodes: 20 },
];