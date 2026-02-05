# Petrophysics User Guide

## 1. Overview
The Petrophysics module is your workspace for log analysis and rock property modeling. It integrates closely with the 3D modeling workflow.

## 2. Key Workflows

### Porosity & Permeability Analysis
1.  **Load Data**: Select wells from the Data Manager.
2.  **Cross-Plot**: Open **Analysis > Cross-Plots**. Plot `Core_PHI` vs `Core_K`.
3.  **Regression**: Fit a curve (e.g., `Log(K) = a*PHI + b`).
4.  **Save Model**: Save this relationship as a "Permeability Transform".
5.  **Apply**: Apply this transform to the 3D porosity grid to generate a permeability cube.

### Saturation Height Modeling
1.  **Select Model**: Go to **Petrophysics Hub > Saturation**. Choose **Capillary Pressure**.
2.  **Fit Curve**: Adjust `Entry Pressure (Pd)` and `Shape Factor (lambda)` to match core capillary pressure data.
3.  **Free Water Level**: Define the FWL depth.
4.  **Calculate**: The engine calculates Sw for every cell in the grid based on its height above FWL and its permeability (using the J-function).

### Fluid Substitution (Gassmann)
1.  **Inputs**: Load Vp, Vs, and Density logs.
2.  **Define Fluid**: Set properties for Brine, Oil, and Gas (Density, Modulus).
3.  **Scenario**: Change in-situ saturation (e.g., replace Oil with Brine).
4.  **Compute**: View the resulting change in Acoustic Impedance (AI) to predict 4D seismic response.

## 3. Visualization
Use the **Log Viewer** to see calculated curves alongside measured logs for QC. Use **Cross-Plots** to identify outliers or lithology clusters.