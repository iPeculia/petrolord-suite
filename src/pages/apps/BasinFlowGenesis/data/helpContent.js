export const helpContent = {
    categories: [
        { id: 'getting-started', label: 'Getting Started', icon: 'Rocket' },
        { id: 'tutorials', label: 'Tutorials', icon: 'GraduationCap' },
        { id: 'features', label: 'Feature Guide', icon: 'Grid' },
        { id: 'reference', label: 'Reference', icon: 'BookOpen' },
        { id: 'admin', label: 'Admin Guide', icon: 'Shield' },
        { id: 'developer', label: 'Developer', icon: 'Code' },
    ],
    articles: {
        'welcome': {
            title: 'Welcome to BasinFlow Genesis',
            category: 'getting-started',
            content: `
# Welcome to BasinFlow Genesis

BasinFlow Genesis is a state-of-the-art 1D basin modeling platform designed for petroleum systems analysis. It allows geoscientists to reconstruct the burial and thermal history of sedimentary basins to predict source rock maturity and hydrocarbon generation.

## Key Concepts

*   **Burial History**: Reconstructing the deposition and erosion of sedimentary layers over geological time.
*   **Thermal History**: Modeling the temperature evolution of the basin using heat flow and thermal conductivity.
*   **Maturity Modeling**: Calculating the thermal maturity (Vitrinite Reflectance, Ro%) of source rocks.
*   **Hydrocarbon Generation**: Estimating the timing and volume of oil and gas generation using kinetic models.

## Modes of Operation

1.  **Guided Mode**: A step-by-step wizard ideal for quick look analysis and new users.
2.  **Expert Mode**: A comprehensive dashboard for detailed property editing, calibration, and multi-scenario analysis.
`
        },
        'quick-start': {
            title: 'Quick Start Guide',
            category: 'getting-started',
            content: `
# Quick Start Guide

Follow these steps to create your first model in under 5 minutes.

1.  **Select a Template**: On the home screen, choose "Guided Mode" and select a predefined basin template (e.g., "Rift Basin").
2.  **Define Stratigraphy**: 
    *   Review the default layers.
    *   Adjust thickness and ages if you have specific data.
    *   Assign lithologies (Sandstone, Shale, Limestone).
3.  **Set Petroleum System Elements**:
    *   Identify your **Source Rock** layer.
    *   Enable "Source Rock" toggle and set TOC (Total Organic Carbon) and HI (Hydrogen Index).
4.  **Define Heat Flow**:
    *   Choose a "Constant" heat flow (e.g., 60 mW/m²) or a time-dependent model.
5.  **Simulate**:
    *   Click "Review & Simulate".
    *   Wait for the simulation to complete (usually < 2 seconds).
6.  **Analyze**:
    *   View the "Maturity Plot" to see if your source rock entered the oil window.
`
        },
        'creating-scenarios': {
            title: 'Creating Scenarios',
            category: 'tutorials',
            content: `
# Managing Scenarios

Expert Mode allows you to test multiple hypotheses without overwriting your base model.

### How to Create a Scenario

1.  Navigate to the **Expert Mode** dashboard.
2.  Open the **Scenarios** tab in the right sidebar.
3.  Click **"Save Scenario"**.
4.  Enter a name (e.g., "High Heat Flow Case") and description.
5.  Make changes to your model (e.g., increase Heat Flow to 70 mW/m²).
6.  Run the simulation.
7.  Save this new state as another scenario or update the current one.

### Comparing Scenarios

Use the **Analysis > Comparison** tab to view side-by-side plots of different scenarios. This is crucial for understanding uncertainty.
`
        },
        'calibration': {
            title: 'Model Calibration',
            category: 'tutorials',
            content: `
# Model Calibration

Calibration ensures your model matches observed reality.

### Data Requirements
*   **Vitrinite Reflectance (Ro)** data from well samples.
*   **Bottom Hole Temperature (BHT)** or DST temperature data.

### Workflow
1.  Go to the **Calibration** tab in Expert Mode.
2.  **Import Data**: Upload a CSV file with columns: \`Depth (m)\`, \`Value\`, \`Type (Ro/Temp)\`.
3.  **Visualize**: The interface plots your model curve against the measured points.
4.  **Adjust**:
    *   If model Ro is too low -> Increase Heat Flow or Erosion amount.
    *   If model Ro is too high -> Decrease Heat Flow.
5.  **Iterate**: Repeat until the RMSE (Root Mean Square Error) is minimized.
`
        },
        'lithology-mixing': {
            title: 'Lithology Mixing',
            category: 'features',
            content: `
# Lithology Mixing

Real rocks are rarely 100% pure. BasinFlow Genesis allows mixed lithologies.

*   **Standard**: Pure End-members (Sandstone, Shale, Limestone).
*   **Mixed**: Create custom lithologies (e.g., "Silty Shale" = 70% Shale + 30% Siltstone).

*Note: In the current version, use the "Custom Lithology" editor in Expert Mode to define specific thermal properties representing your mix.*
`
        },
        'glossary': {
            title: 'Glossary of Terms',
            category: 'reference',
            content: `
# Glossary

*   **Apatite Fission Track (AFT)**: A thermochronology method used to constrain low-temperature thermal history (60-120°C).
*   **Boundary Condition**: Parameters defined at the top (Sediment Water Interface Temperature) and bottom (Heat Flow) of the model.
*   **Expulsion Efficiency**: The percentage of generated hydrocarbons that migrate out of the source rock.
*   **Heat Flow (HF)**: The movement of heat energy from the earth's interior to the surface, measured in mW/m².
*   **Hydrogen Index (HI)**: A measure of the hydrogen richness of kerogen, indicating oil vs. gas potential (mg HC/g TOC).
*   **Kerogen**: Insoluble organic matter in sedimentary rocks; precursor to oil and gas.
*   **Ro (Vitrinite Reflectance)**: A key maturity indicator measuring the reflectivity of vitrinite macerals.
*   **Source Rock**: A rock rich in organic matter which, if heated sufficiently, will generate oil or gas.
*   **TOC (Total Organic Carbon)**: The quantity of organic carbon in a rock, expressed as a weight percentage.
`
        },
        'keyboard-shortcuts': {
            title: 'Keyboard Shortcuts',
            category: 'reference',
            content: `
# Keyboard Shortcuts

| Action | Shortcut | Context |
| :--- | :--- | :--- |
| **Run Simulation** | \`Ctrl + Enter\` | Expert Mode |
| **Save Project** | \`Ctrl + S\` | Global |
| **Toggle Sidebar** | \`Ctrl + B\` | Expert Mode |
| **New Scenario** | \`Alt + N\` | Expert Mode |
| **Help Center** | \`F1\` or \`?\` | Global |
| **Close Dialog** | \`Esc\` | Global |
`
        },
        'api-docs': {
            title: 'API Documentation',
            category: 'developer',
            content: `
# API Documentation

BasinFlow Genesis integrates with the PetroLord Platform API.

### Core Endpoints

#### \`POST /api/simulation/run\`
Executes a 1D basin model simulation.

**Payload:**
\`\`\`json
{
  "stratigraphy": [...],
  "heatFlow": { "type": "constant", "value": 60 },
  "kinetics": "Burnham_Sweeney_1989"
}
\`\`\`

#### \`GET /api/projects/{id}\`
Retrieves full project state.

### Edge Functions
We use Supabase Edge Functions for computationally intensive tasks:
*   \`basin-sim-v1\`: Core thermal solver.
*   \`kinetics-calc\`: Arrhenius equation solver.
`
        },
        'troubleshooting': {
            title: 'Troubleshooting',
            category: 'getting-started',
            content: `
# Troubleshooting

### Simulation Fails to Run
*   **Check Layers**: Ensure no layers have 0 thickness.
*   **Check Ages**: Ensure Age Start > Age End for all layers.
*   **Missing Lithology**: Verify all layers have a valid lithology assigned.

### "Model too cool" / Maturity too low
*   Check your **Heat Flow** values. Typical continental margins are 40-70 mW/m². Rifts can be >80 mW/m².
*   Check **Erosion**. Missing overburden can significantly reduce paleo-temperatures.

### Export is blank
*   Ensure the simulation has completed successfully before attempting export.
*   Check browser pop-up blockers for PDF downloads.
`
        }
    }
};