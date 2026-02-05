import { 
  Database, 
  Waves, 
  Activity, 
  Layers, 
  Grid, 
  Hexagon, 
  Box, 
  Cuboid, 
  Component, 
  PieChart, 
  AlertTriangle, 
  Eye,
  Link,
  TrendingUp,
  FileText,
  Share2,
  Workflow,
  Cpu
} from 'lucide-react';

export const phase3Modules = [
  // ... Phase 1 & 2 Modules ...
  {
    id: 'data',
    name: 'Data Manager',
    icon: Database,
    description: 'Import and manage wells, logs, and markers',
    category: 'Core'
  },
  {
    id: 'seismic',
    name: 'Seismic Integration',
    icon: Waves,
    description: 'Import SEG-Y and interpret horizons',
    category: 'Core',
    phase: 2
  },
  {
    id: 'faults',
    name: 'Fault Framework',
    icon: Activity,
    description: 'Model structural faults and throw',
    category: 'Structural',
    phase: 2
  },
  {
    id: 'surface',
    name: 'Surface Modeling',
    icon: Layers,
    description: 'Create horizons and zones',
    category: 'Structural'
  },
  {
    id: 'grid',
    name: 'Grid Builder',
    icon: Grid,
    description: 'Generate 3D corner-point grids',
    category: 'Structural'
  },
  {
    id: 'facies',
    name: 'Facies Modeling',
    icon: Hexagon,
    description: 'Stochastic facies simulation',
    category: 'Property',
    phase: 2
  },
  {
    id: 'properties',
    name: 'Property Modeling',
    icon: Box,
    description: 'Porosity and permeability distribution',
    category: 'Property',
    phase: 2
  },
  {
    id: 'objects',
    name: 'Object Modeling',
    icon: Cuboid,
    description: 'Channel and lobe placement',
    category: 'Property',
    phase: 2
  },
  {
    id: 'petro',
    name: 'Petrophysics',
    icon: Component,
    description: 'Saturation and contact analysis',
    category: 'Property',
    phase: 2
  },
  {
    id: 'volume',
    name: 'Volumetrics',
    icon: PieChart,
    description: 'GRV, NRV, and STOIIP calculation',
    category: 'Analysis'
  },
  {
    id: 'uncertainty',
    name: 'Uncertainty',
    icon: AlertTriangle,
    description: 'Risk and sensitivity analysis',
    category: 'Analysis',
    phase: 2
  },
  {
    id: 'viewer',
    name: '3D Viewer',
    icon: Eye,
    description: 'Advanced 3D visualization',
    category: 'Visualization'
  },
  // ... Phase 3 New Modules ...
  {
    id: 'hub',
    name: 'Integration Hub',
    icon: Link,
    description: 'Manage app connections and data flow',
    category: 'Integrations',
    phase: 3
  },
  {
    id: 'orchestrator',
    name: 'Workflow Orchestrator',
    icon: Workflow,
    description: 'Design and run cross-app workflows',
    category: 'Integrations',
    phase: 3
  },
  {
    id: 'int_logfacies',
    name: 'Log Facies Sync',
    icon: FileText,
    description: 'Sync with Log Facies Analysis app',
    category: 'Integrations',
    phase: 3
  },
  {
    id: 'int_ppfg',
    name: 'PPFG Sync',
    icon: Activity,
    description: 'Sync with Pore Pressure app',
    category: 'Integrations',
    phase: 3
  },
  {
    id: 'int_npv',
    name: 'NPV & Economics',
    icon: TrendingUp,
    description: 'Export volumes to NPV Scenario Builder',
    category: 'Integrations',
    phase: 3
  },
  {
    id: 'int_fdp',
    name: 'FDP Accelerator',
    icon: Share2,
    description: 'Sync development plans with FDP',
    category: 'Integrations',
    phase: 3
  }
];