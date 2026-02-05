# EarthModel Pro - Quick Start Guide

## Prerequisites
- Modern web browser (Chrome/Edge/Firefox) with WebGL enabled.
- Active user account with EarthModel Pro access.

## Step 1: Create a Project
1. Open EarthModel Pro from the Dashboard.
2. In the **Data Manager** tab, click **New Project**.
3. Enter a project name (e.g., "North Sea Demo") and select a CRS (e.g., "EPSG:32631").
4. Click **Create**.

## Step 2: Import Data
1. Ensure your project is selected.
2. In the **Wells** section, click **Import CSV**.
3. Upload a well header file (see `sample-wells.csv` for format).
4. Upload well logs if available.
5. Verify data in the table view.

## Step 3: Visualize in 3D
1. Switch to the **3D Viewer** module using the sidebar.
2. You should see your well trajectories visualized.
3. Use **Left Click** to rotate, **Right Click** to pan, and **Scroll** to zoom.
4. Use the **Viewer Controls** panel (top right) to toggle layers.

## Step 4: Build a Surface
1. Go to the **Surface Modeling** module.
2. Select "Kriging" as the algorithm.
3. Choose your input data (e.g., "Well Tops").
4. Set resolution to 100m.
5. Click **Build Surface**.
6. The result will appear in the 3D viewer automatically.

## Step 5: Calculate Volumes
1. Navigate to **Volumetrics**.
2. Select the surface/grid you just created.
3. Enter parameters:
   - Gas/Oil Contact Depth: 2500m
   - Porosity Cutoff: 0.12
   - Water Saturation Cutoff: 0.6
4. Click **Compute**.
5. Review the results card for GRV and STOIIP.