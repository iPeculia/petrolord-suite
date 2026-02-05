import { 
  BookOpen, Zap, Layers, Palette, Box, Activity, Cpu, Database, 
  Settings, GraduationCap, User, Bell, HelpCircle, FileText, 
  Share2, BarChart2, LifeBuoy, RefreshCw, Book, Search 
} from 'lucide-react';

export const helpCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Essential guides to get you up and running with EarthModel Pro.',
    icon: BookOpen,
    articleCount: 5,
    order: 1
  },
  {
    id: 'quick-start',
    name: 'Quick Start',
    description: 'Fast-track your first project with these quick guides.',
    icon: Zap,
    articleCount: 3,
    order: 2
  },
  {
    id: 'structural-modeling',
    name: 'Structural Modeling',
    description: 'Create horizons, faults, surfaces, and grids.',
    icon: Layers,
    articleCount: 5,
    order: 3
  },
  {
    id: 'facies-modeling',
    name: 'Facies Modeling',
    description: 'Define and distribute lithological facies.',
    icon: Palette,
    articleCount: 5,
    order: 4
  },
  {
    id: 'property-modeling',
    name: 'Property Modeling',
    description: 'Model porosity, permeability, and other properties.',
    icon: BarChart2,
    articleCount: 5,
    order: 5
  },
  {
    id: 'object-modeling',
    name: 'Object Modeling',
    description: 'Model discrete geological bodies like channels and lobes.',
    icon: Box,
    articleCount: 5,
    order: 6
  },
  {
    id: 'petrophysics',
    name: 'Petrophysics',
    description: 'Analyze well logs and rock properties.',
    icon: Activity,
    articleCount: 5,
    order: 7
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    description: 'AI-driven predictions and optimizations.',
    icon: Cpu,
    articleCount: 5,
    order: 8
  },
  {
    id: 'data-management',
    name: 'Data Management',
    description: 'Import, export, and manage your project data.',
    icon: Database,
    articleCount: 5,
    order: 9
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Master the 3D viewer and visual analysis tools.',
    icon: Search,
    articleCount: 5,
    order: 10
  },
  {
    id: 'integration',
    name: 'Integration',
    description: 'Connect with other modules and external tools.',
    icon: Share2,
    articleCount: 5,
    order: 11
  },
  {
    id: 'settings',
    name: 'Settings & Preferences',
    description: 'Customize your workspace and application behavior.',
    icon: Settings,
    articleCount: 5,
    order: 12
  },
  {
    id: 'training',
    name: 'Training & Certification',
    description: 'Courses, quizzes, and certification programs.',
    icon: GraduationCap,
    articleCount: 5,
    order: 13
  },
  {
    id: 'account',
    name: 'Account & Profile',
    description: 'Manage your account, subscription, and team.',
    icon: User,
    articleCount: 5,
    order: 14
  },
  {
    id: 'updates',
    name: 'Updates & Releases',
    description: 'Stay up to date with new features and changes.',
    icon: RefreshCw,
    articleCount: 5,
    order: 15
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Solutions for common issues and errors.',
    icon: LifeBuoy,
    articleCount: 5,
    order: 16
  },
  {
    id: 'best-practices',
    name: 'Best Practices',
    description: 'Guidelines for optimal modeling and performance.',
    icon: Book,
    articleCount: 5,
    order: 17
  },
  {
    id: 'glossary',
    name: 'Glossary',
    description: 'Definitions of geological and software terms.',
    icon: FileText,
    articleCount: 5,
    order: 18
  },
  {
    id: 'contact',
    name: 'Contact & Support',
    description: 'Get help from our support team.',
    icon: HelpCircle,
    articleCount: 5,
    order: 19
  }
];