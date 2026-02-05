# BasinFlow Genesis - Expert Mode Visual Guide

This document outlines the features, layout, and expected interactions within the BasinFlow Genesis Expert Mode interface.

## 1. Overview & Layout

The Expert Mode provides a professional, three-panel workspace designed for advanced basin modeling workflows.

### Layout Structure
- **Left Panel (Stratigraphy)**: Dedicated to layer management. Users can view the stratigraphic column, select layers, and see lithology color coding.
- **Center Panel (Visualization)**: The main canvas for interacting with the model. It displays 1D burial history plots, 2D cross-sections, and stratigraphic visualizations.
- **Right Panel (Advanced Controls)**: A tabbed interface containing deep-dive tools for property editing, calibration, scenario management, and sensitivity analysis.
- **Header Toolbar**: Contains navigation (Back to Hub), project metadata, save/export actions, and panel toggle controls (Left/Right panel visibility).

### Responsiveness
- **Desktop**: Full three-panel layout. Panels can be toggled to maximize the visualization area.
- **Tablet/Mobile**: Side panels are hidden by default or moved to slide-out drawers (Sheets) to preserve screen real estate for visualization.

## 2. Advanced Controls Panel (Right Sidebar)

The core of the Expert Mode, divided into four distinct workflow tabs:

### Tab 1: Properties (Layer Editor)
**Component**: `PropertyEditor.jsx`
- **Function**: Detailed editing of physical and chemical properties for the selected layer.
- **Features**:
  - **Basic**: Name, Lithology (dropdown), Porosity (slider/input), Ages.
  - **Thermal**: Matrix Conductivity, Heat Capacity, Radiogenic Heat Production.
  - **Kinetic**: Source rock kinetics model selection (Burnham & Sweeney, etc.).
  - **Validation**: Real-time updates to the context; visual feedback on changes.

### Tab 2: Calibration
**Component**: `CalibrationPanel.jsx`
- **Function**: Compare modeled results against measured field data to validate the model.
- **Features**:
  - **Misfit Statistics**: RMSE for Ro% and Temperature displayed in summary cards.
  - **Plots**:
    - *Vitrinite Reflectance (Ro%) vs Depth*
    - *Temperature vs Depth*
  - **Data Table**: detailed residuals for each measured data point.
  - **Actions**: Import measured data, Export calibration report.

### Tab 3: Scenarios
**Component**: `ScenarioComparison.jsx`
- **Function**: Create and compare multiple modeling scenarios (e.g., High vs Low Heat Flow).
- **Features**:
  - **Creation Form**: Quickly generate new scenarios based on the current base case.
  - **Scenario List**: Cards showing active scenarios with key parameters summary.
  - **Comparative Plot**: Bar chart comparing key KPIs (e.g., Max Maturity) across scenarios.
  - **Stats Table**: Side-by-side numerical comparison of results.

### Tab 4: Sensitivity
**Component**: `SensitivityAnalysis.jsx`
- **Function**: Analyze how uncertainty in input parameters affects model results.
- **Features**:
  - **Configuration**: Select parameter (Heat Flow, Erosion, etc.) and range (Min/Max).
  - **Tornado Chart**: Visual ranking of parameter impact on results.
  - **Variation Plot**: XY plot showing result sensitivity across the defined range.

## 3. Data Flow Architecture

1.  **Selection**: Clicking a layer in the **Left Panel** updates the `activeLayerId` in the `ExpertModeContext`.
2.  **Editing**: The **Right Panel (Properties)** listens to `activeLayerId` and populates the form. Changes made here dispatch updates to the main `BasinFlowContext`.
3.  **Visualization**: The **Center Panel** re-renders automatically when `BasinFlowContext` data changes, providing immediate visual feedback (e.g., layer thickness change).
4.  **Analysis**: Calibration and Sensitivity tools read the current model state from context, run calculations (mocked or real), and display results within their respective tabs in the Right Panel.

## 4. Verification Checklist

- [x] **Layout**: Verify 3-panel structure and toggle functionality.
- [x] **Layer Editing**: Confirm changing a layer property updates the visual model.
- [x] **Calibration**: Ensure plots render and statistics are calculated.
- [x] **Scenarios**: Create a new scenario and verify it appears in the comparison list.
- [x] **Sensitivity**: Run a sensitivity analysis and verify the Tornado chart generates.
- [x] **Mobile**: Resize window to <768px and verify controls move to a sheet/drawer.