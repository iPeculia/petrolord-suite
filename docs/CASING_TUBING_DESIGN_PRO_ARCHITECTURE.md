# Casing & Tubing Design Pro - Application Architecture

## 1. Overview
**Casing & Tubing Design Pro** is a comprehensive engineering module within the Petrolord Suite designed for the rigorous analysis and design of oil & gas well tubulars. It facilitates the complete workflow from trajectory analysis to detailed stress checks (Burst, Collapse, Tension, Triaxial) and completion configuration.

## 2. Technical Architecture
The application utilizes a **Context-Driven Architecture** within React.
- **Root Component**: `CasingTubingDesignPro.jsx` (Wraps content in Context Provider)
- **State Management**: `CasingTubingDesignContext.jsx`
  - Handles global state for Wells, Strings, Load Cases, and Settings.
  - Exposes actions like `createDesignCase`, `addLog`, `calculateResults`.
- **UI Framework**: Tailwind CSS + shadcn/ui components.
- **Visualization**:
  - `recharts` for XY plots (Pressure, Safety Factors).
  - SVG for 2D Wellbore Schematics.

## 3. Folder Structure (`src/pages/apps/CasingTubingDesignPro/`)
The module is self-contained with a domain-specific directory structure:

### `components/`
*   **`layout/`**: 
    *   `TopBanner.jsx`: Navigation and Well Context.
    *   `LeftPanel.jsx`: Project Explorer (Wells, Design Cases).
    *   `RightPanel.jsx`: Design Parameters (Safety Factors, KPIs).
    *   `BottomStrip.jsx`: Logs, Warnings, and References console.
*   **`tabs/`**: Main workspace views.
    *   `WellEnvironmentTab.jsx`: Trajectory, PPFG, Temperature inputs.
    *   `LoadCasesTab.jsx`: Definition of design scenarios (Burst, Collapse, etc.).
    *   `CasingDesignTab.jsx`: String configuration and casing-specific analysis.
    *   `TubingDesignTab.jsx`: Completion design, packers, flow assurance checks.
    *   `StringVisualizerTab.jsx`: Full-screen visual analysis and comparison.
*   **`casing/`**: Components specific to casing strings.
    *   `CasingStringList.jsx`: Management of casing strings.
    *   `CasingSectionsTable.jsx`: Detailed section editor.
    *   `DesignResultsTable.jsx`: Calculated safety factors view.
    *   `AddCasingStringDialog.jsx`: Creation wizard.
*   **`tubing/`**: Components specific to tubing.
    *   `TubingStringList.jsx`: Management of tubing strings.
    *   `PackerConfigPanel.jsx`: Configuration for packers and SSSVs.
    *   `FlowCapacityAnalysis.jsx`: Basic erosion and friction analysis.
*   **`visualizer/`**: 
    *   `WellboreVisualization.jsx`: Dynamic SVG rendering engine for wellbore schematics.
*   **`charts/`**: Reusable Recharts wrappers (`ProfilePlot`, `SafetyFactorPlot`).
*   **`help/`**: Embedded help system components (`QuickStartGuide`, `ConceptNotes`).

### `contexts/`
*   `CasingTubingDesignContext.jsx`: The brain of the application. Hydrates initial data (Mock/DB) and manages interactions.

### `utils/`
*   `casingCalculations.js`: Core physics engine for casing safety factors.
*   `tubingCalculations.js`: Physics engine for tubing, including packer loads and basic flow assurance.
*   `calculations.js`: Shared math helpers (hydrostatics, interpolation).

### `data/`
*   `catalog.js`: JSON-based database of API pipe grades, connections, and standard sizes.

## 4. Key Features & Functionality

### A. Well Environment
*   **Trajectory Visualization**: Displays MD/TVD/Inc profiles.
*   **Pore Pressure & Fracture Gradient**: Interactive plot of subsurface pressures.
*   **Temperature**: Geothermal gradient modeling.

### B. Load Case Management
*   **Scenario Builder**: Supports standard API load cases (Drilling, Production, Kick, Stimulation).
*   **Pressure Profiling**: Auto-calculates internal/external pressure profiles based on fluid gradients and surface pressures.

### C. Casing Design
*   **String Configuration**: Add/Edit/Duplicate casing strings (Surface, Intermediate, Production).
*   **Section Management**: Define multi-grade strings (e.g., L-80 top, P-110 bottom).
*   **Automated Calculations**: Real-time updates of Burst, Collapse, and Tension safety factors.
*   **Catalog Integration**: Pick standard API sizes and grades.

### D. Tubing & Completion
*   **Tubing String Design**: Similar to casing but adds flow metrics.
*   **Component Modeling**: Add Packers, SSSVs, Nipples to the string.
*   **Packer Analysis**: Calculates differential forces and tubing-to-packer loads.
*   **Flow Capacity**: Basic Nodal Analysis stub for erosion velocity and friction loss.

### E. Visualization & Reporting
*   **2D Schematic**: Dynamic SVG rendering of the wellbore (Hole -> Casing -> Cement -> Tubing).
*   **Interactive Plots**: Depth vs. Safety Factor charts with limit lines.
*   **Comparison Mode**: Overlay current design against baseline or offset well.

## 5. Data Models

### Casing/Tubing String