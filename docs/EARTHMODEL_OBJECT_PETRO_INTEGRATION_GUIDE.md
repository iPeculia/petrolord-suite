# EarthModel Pro: Object Modeling & Petrophysics Integration Guide

## Overview
This guide details the workflows and integration points between the **Object Modeling** (stochastic geology) and **Petrophysics** (rock properties) modules in EarthModel Pro v4.0.

## 1. Object Modeling Workflow
The Object Modeling module allows you to create discrete geological bodies (channels, lobes, salt diapirs) that populate the 3D grid.

### Key Features
*   **3D Editor**: Interactive placement of bodies in 3D space using the `ObjectViewer3D`.
*   **Templates**: Use the `ObjectLibraryBrowser` to save and reuse parameterized geometries (e.g., "High Sinuosity Channel").
*   **Conditioning**: Objects can be conditioned to well data, honoring facies logs where they intersect well paths.

### Steps
1.  **Initialize**: Go to **Object Modeling Hub** and select a body type.
2.  **Define Geometry**: Use the **Property Panel** to set width, thickness, and orientation.
3.  **Place**: Use the **Placement Interface** to position the object in the 3D grid or let the stochastic engine place it based on probability maps.
4.  **QC**: Check **Statistics Panel** for Net-to-Gross and overlap percentages.

## 2. Petrophysics Workflow
The Petrophysics module handles the distribution of continuous properties (PHI, K, Sw) within the facies framework defined by the Object Model.

### Key Features
*   **Cross-Plots**: Interactive `PetrophysicalCrossPlot` for analyzing property relationships and identifying clusters.
*   **Depth Profiles**: `PetrophysicalDepthProfile` for visualizing log data and upscaled grid properties.
*   **Physics Models**: Tools like `CapillaryPressureCurveViewer` for defining saturation height functions.

### Steps
1.  **Data Analysis**: Import logs and perform QC using cross-plots and histograms.
2.  **Model Definition**: Define transform equations (e.g., Porosity vs Permeability) for each facies.
3.  **Distribution**: Populate the 3D grid properties. The engine respects the object boundaries (e.g., Channel sands get different properties than background shale).

## 3. Integration Points
The power of EarthModel Pro lies in the seamless link between these two domains:

*   **Facies-Dependent Properties**: Properties defined in Petrophysics are automatically linked to Facies Codes used in Object Modeling.
*   **Volume Calculation**: Changes in object geometry instantly update Gross Rock Volume (GRV), which combined with Petrophysical properties updates STOIIP/GIIP.
*   **Joint Visualization**: The 3D Viewer supports toggling between Discrete (Facies/Objects) and Continuous (Property) views for rapid QC.

## 4. Advanced Visualization
*   **LOD Rendering**: Large models use Level-of-Detail techniques to maintain performance.
*   **Slicing**: Use the Z-slice and Cross-section tools in the viewer to inspect internal heterogeneity.

## 5. Troubleshooting
*   **Overlap Warnings**: If objects overlap significantly, check the priority rules in the Object Property Panel.
*   **Performance**: For very large grids (>10M cells), switch to "Bounding Box" view mode in settings to improve frame rates.