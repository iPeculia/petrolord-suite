import { 
  Layers, 
  Box, 
  Activity, 
  Zap, 
  TrendingUp, 
  Grid, 
  Database, 
  Cpu, 
  Eye,
  Share2,
  Settings,
  FileText,
  Hexagon,
  Waves,
  AlertTriangle,
  Cuboid,
  Component,
  PieChart
} from 'lucide-react';

export const phase2Modules = [
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
  }
];

export const faciesTemplates = [
  { id: 'sand_shale', name: 'Sand-Shale Binary', colors: ['#F4A460', '#708090'] },
  { id: 'deltaic', name: 'Deltaic System', colors: ['#FFD700', '#FFA500', '#8B4513', '#2F4F4F'] },
  { id: 'carbonate', name: 'Carbonate Platform', colors: ['#00FFFF', '#40E0D0', '#00CED1'] }
];

export const propertyTemplates = [
  { id: 'phi', name: 'Porosity (PHI)', min: 0, max: 0.4, unit: 'v/v' },
  { id: 'perm', name: 'Permeability (K)', min: 0.1, max: 5000, unit: 'mD', log: true },
  { id: 'sw', name: 'Water Saturation (Sw)', min: 0, max: 1, unit: 'v/v' }
];