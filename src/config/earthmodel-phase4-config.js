import { 
  BrainCircuit, 
  Scan, 
  Target, 
  Activity, 
  Layers, 
  Search, 
  BarChart2, 
  Cpu,
  TrendingUp,
  Wind
} from 'lucide-react';

export const phase4Modules = [
  {
    id: 'ml_hub',
    name: 'ML Hub',
    icon: BrainCircuit,
    description: 'Machine Learning Center',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_facies',
    name: 'Facies Prediction',
    icon: Scan,
    description: 'Automated facies classification',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_properties',
    name: 'Property Prediction',
    icon: Target,
    description: 'Porosity & Permeability ML',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_faults',
    name: 'Fault Detection',
    icon: Activity,
    description: 'Seismic fault extraction',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_seismic',
    name: 'Seismic Interp.',
    icon: Layers,
    description: 'Automated horizon picking',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_logs',
    name: 'Well Log Analysis',
    icon: BarChart2,
    description: 'Log curve prediction',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_anomalies',
    name: 'Anomaly Detection',
    icon: Search,
    description: 'Identify data outliers',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_volume',
    name: 'Volume Estimation',
    icon: TrendingUp,
    description: 'Probabilistic volumetrics',
    category: 'Machine Learning',
    phase: 4
  },
  {
    id: 'ml_placement',
    name: 'Well Placement',
    icon: Wind,
    description: 'Genetic Algorithm Optimization',
    category: 'Machine Learning',
    phase: 4
  }
];