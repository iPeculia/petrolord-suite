import { Book, Play, HelpCircle, FileText, Terminal, AlertTriangle, GraduationCap } from 'lucide-react';

export const helpCategories = [
    { id: 'getting-started', label: 'Getting Started', icon: GraduationCap },
    { id: 'guides', label: 'Feature Guides', icon: Book },
    { id: 'videos', label: 'Video Tutorials', icon: Play },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'glossary', label: 'Glossary', icon: FileText },
    { id: 'api', label: 'API Reference', icon: Terminal },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
];

export const gettingStartedSteps = [
    {
        title: "Project Setup",
        description: "Learn how to initialize a new project and configure basic settings.",
        steps: [
            "Navigate to the 'Setup' tab.",
            "Click 'Create New Project' or select an existing one.",
            "Define project parameters like CRS, Unit System, and Elevation Reference."
        ]
    },
    {
        title: "Importing Data",
        description: "Bringing LAS files and well headers into the system.",
        steps: [
            "Go to the 'Data Sources' or 'Setup' tab.",
            "Drag and drop your .LAS files into the upload zone.",
            "Map your curve mnemonics (GR, NPHI, RHOB) to the system standard."
        ]
    },
    {
        title: "Running Basic Analysis",
        description: "Execute a standard triple-combo interpretation.",
        steps: [
            "Switch to the 'Calculations' tab.",
            "Select your Clay Volume (Vsh) method (e.g., Linear, Steiber).",
            "Define your Matrix and Fluid parameters.",
            "Click 'Run Calculations' to generate Porosity and Water Saturation curves."
        ]
    }
];

export const featureGuides = [
    {
        id: 'data-management',
        title: 'Data Management',
        content: `
### Overview
The Data Management module is the central hub for all well logs, core data, and survey files.

### Key Features
- **LAS Parser**: Automatically reads LAS 2.0 and 3.0 files.
- **Curve Aliasing**: Smart mapping of vendor-specific mnemonics (e.g., 'GR_FINAL' -> 'GR').
- **QC Flags**: Automated checks for null values, gaps, and spikes.

### Best Practices
- Always verify the depth units (Feet vs Meters) before importing.
- Use the 'QC' tab to flag bad hole conditions prior to petrophysical calculation.
        `
    },
    {
        id: '3d-viz',
        title: '3D Visualization',
        content: `
### Overview
Interactive 3D canvas for viewing well trajectories and property distributions.

### Controls
- **Rotate**: Left-click and drag.
- **Pan**: Right-click and drag.
- **Zoom**: Mouse wheel.

### Layers
- Toggle 'Stratigraphic Surfaces' to see interpolated formation tops.
- Switch 'Color Mode' to 'Property' to visualize Porosity or Saturation along the wellbore.
        `
    },
    {
        id: 'probabilistic',
        title: 'Monte Carlo Simulation',
        content: `
### Overview
Quantify uncertainty in your reserves estimation using probabilistic methods.

### Workflow
1. Define distributions (Triangular, Normal, Uniform) for key inputs like Porosity and Saturation.
2. Set the number of iterations (e.g., 10,000).
3. Run simulation to generate P10, P50, and P90 reserve estimates.
        `
    }
];

export const faqs = [
    {
        q: "Why are my porosity values negative?",
        a: "This usually happens if the Matrix Density is set lower than the Bulk Density log, or if there are bad hole effects. Check your caliper log and matrix parameters in the 'Calculations' tab."
    },
    {
        q: "Can I export the calculated curves?",
        a: "Yes. Go to the 'Reports' tab and select 'Export LAS'. You can choose which curves to include in the output file."
    },
    {
        q: "How do I add a custom formation top?",
        a: "In the 'Setup' or 'Correlation' tab, you can manually type a depth or click on the log track while in 'Pick Mode' to insert a new marker."
    },
    {
        q: "Does the software support LWD data?",
        a: "Yes, LWD (Logging While Drilling) data is supported. Ensure you select the correct tool telemetry mode if importing real-time WITSML streams."
    }
];

export const glossary = [
    { term: "Archie's Equation", def: "A fundamental empirical relationship used to calculate water saturation in clean sandstones." },
    { term: "Effective Porosity (PHIE)", def: "The fraction of the total volume of rock that is interconnected pore space, excluding isolated pores and clay-bound water." },
    { term: "Vshale (Vsh)", def: "The volume fraction of shale/clay in the rock. Used to correct porosity and resistivity logs." },
    { term: "Tornado Chart", def: "A visualization used in sensitivity analysis to show which input parameters have the largest impact on the result." },
    { term: "Pickett Plot", def: "A crossplot of Porosity vs. Resistivity used to determine Rw (Formation Water Resistivity) and cementation exponent m." }
];

export const troubleshooting = [
    {
        issue: "LAS File Import Failed",
        solution: "Check the file header. Ensure 'STRT' and 'STOP' depths are numeric. Remove any special characters from curve mnemonics."
    },
    {
        issue: "3D View is Blank",
        solution: "Ensure your browser supports WebGL. Try refreshing the page. Check if the well has valid deviation survey data (X/Y coordinates)."
    },
    {
        issue: "Calculation Timeout",
        solution: "If running Monte Carlo with >50,000 iterations on a large dataset, try reducing the iteration count or processing fewer zones at a time."
    }
];

export const apiDocs = `
## API Reference

### Authentication
All API requests require a Bearer Token in the header:
\`Authorization: Bearer <YOUR_API_KEY>\`

### Endpoints

#### GET /api/v1/wells
Retrieves a list of all wells in the project.

**Parameters:**
- \`project_id\` (required): UUID of the project.
- \`limit\` (optional): Number of records to return.

**Response:**
\`\`\`json
{
  "data": [
    { "id": "w123", "name": "Well-A", "api": "42-000-00000" }
  ]
}
\`\`\`

#### POST /api/v1/calc/porosity
Run porosity calculation on a dataset.

**Body:**
\`\`\`json
{
  "method": "density",
  "rho_matrix": 2.65,
  "rho_fluid": 1.0,
  "data": [2.45, 2.50, 2.55]
}
\`\`\`
`;