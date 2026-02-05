export const gettingStartedDetailed = [
  {
    id: 'gs-detailed-1',
    title: 'Welcome to EarthModel Pro',
    category: 'Getting Started',
    difficulty: 'Beginner',
    lastUpdated: '2025-12-06',
    views: 1542,
    helpful: 450,
    tags: ['introduction', 'overview', 'features'],
    content: `
# Welcome to EarthModel Pro

EarthModel Pro is the next-generation geoscience modeling platform designed to integrate structural, stratigraphic, and petrophysical modeling into a single, seamless workflow.

## What is EarthModel Pro?
EarthModel Pro allows geoscientists and engineers to build complex 3D representations of the subsurface. It combines the precision of deterministic modeling with the power of stochastic simulation, all accessible through a modern web interface.

## Key Features
- **Unified Environment:** Move from seismic interpretation to flow simulation without changing applications.
- **Cloud-Native:** Heavy computations like grid generation and geostatistical simulations run in the cloud, freeing up your local machine.
- **Machine Learning:** Integrated ML algorithms for facies prediction, fault detection, and property distribution.
- **Real-time Collaboration:** Work on the same project with colleagues simultaneously.

## System Requirements
To run EarthModel Pro efficiently, ensure your system meets the following:
- **Browser:** Latest version of Chrome, Edge, or Firefox.
- **Internet:** Stable broadband connection (min 10 Mbps).
- **Graphics:** WebGL 2.0 compatible graphics card.

## Workflow Overview
1. **Import Data:** Wells, logs, seismic, and surfaces.
2. **Structural Modeling:** Define the fault network and horizons.
3. **Grid Building:** Create the 3D cellular grid.
4. **Property Modeling:** Distribute facies and petrophysical properties.
5. **Upscaling & Simulation:** Prepare the model for dynamic simulation.

## Getting Help
If you get stuck, use the **Help** button in the top right corner or press \`F1\` to access this Help Center. You can also contact support via the **Support** tab.
    `
  },
  {
    id: 'gs-detailed-2',
    title: 'Installation and Setup',
    category: 'Getting Started',
    difficulty: 'Beginner',
    lastUpdated: '2025-11-20',
    views: 980,
    helpful: 320,
    tags: ['installation', 'setup', 'configuration'],
    content: `
# Installation and Setup Guide

EarthModel Pro is a web-based application, meaning there is no traditional "installation" for the client. However, there are setup steps to ensure optimal performance.

## Browser Configuration
1. **Enable Hardware Acceleration:**
   - Go to your browser settings.
   - Search for "Hardware Acceleration".
   - Ensure it is toggled **ON**.
2. **WebGL Support:**
   - Visit \`get.webgl.org\` to verify your browser supports WebGL 2.0.

## Account Setup
1. **Invitation:** You should receive an email invitation from your administrator.
2. **Create Password:** Click the link in the email to set your secure password.
3. **Profile:** Upon first login, complete your user profile including your discipline (Geologist, Geophysicist, Engineer).

## First Launch
When you first log in, you will see the **Project Hub**.
- **Recent Projects:** Shows projects you've worked on recently.
- **Pinned Projects:** Keep your most important projects at the top.
- **Templates:** Start a new project from a predefined template.

## Troubleshooting
- **Blank Screen?** Clear your browser cache and refresh (Ctrl+F5).
- **Connection Error?** Check your VPN settings if accessing from a corporate network.
    `
  },
  {
    id: 'gs-detailed-3',
    title: 'User Interface Overview',
    category: 'Getting Started',
    difficulty: 'Beginner',
    lastUpdated: '2025-10-15',
    views: 1200,
    helpful: 400,
    tags: ['ui', 'interface', 'navigation'],
    content: `
# User Interface Overview

Familiarize yourself with the EarthModel Pro layout to boost your productivity.

## 1. The Sidebar (Navigation)
Located on the left, the sidebar gives access to the main modules:
- **Dashboard:** Project overview and stats.
- **Data:** Import and manage well/seismic data.
- **Structural:** Tools for faults and horizons.
- **Property:** Facies and petrophysical modeling.
- **Settings:** Project and user preferences.

## 2. The Main Viewport (3D Canvas)
The central area is where you interact with your model.
- **Rotate:** Left-click + Drag.
- **Pan:** Right-click + Drag (or Shift + Left-click).
- **Zoom:** Scroll Wheel.

## 3. The Top Toolbar
Contains context-specific tools based on the active module.
- **Selection Tools:** Point, box, and polygon select.
- **Measure Tool:** Measure distances and azimuths.
- **Slicing:** Activate slicing planes (X, Y, Z).

## 4. The Properties Panel
Located on the right (collapsible), this panel shows details for the currently selected object (e.g., grid statistics, well log metadata).

## 5. Status Bar
At the bottom of the screen, showing:
- Current coordinates (X, Y, Z).
- System status (Ready, Processing, Saving).
- Unit system (Metric/Imperial).
    `
  },
  {
    id: 'gs-detailed-4',
    title: 'Creating Your First Project',
    category: 'Getting Started',
    difficulty: 'Beginner',
    lastUpdated: '2025-12-01',
    views: 1100,
    helpful: 380,
    tags: ['project', 'create', 'new'],
    content: `
# Creating Your First Project

Start your modeling journey by creating a robust project structure.

## Step 1: New Project
1. From the Dashboard, click **New Project**.
2. Enter a **Project Name** (e.g., "North Sea Pilot").
3. Select a **Coordinate Reference System (CRS)**. This is critical for accurate data import.

## Step 2: Select a Template
- **Blank:** Start from scratch.
- **QuickLook:** Pre-configured for fast analysis of imported grids.
- **Full Field:** Optimized folder structure for large assets.

## Step 3: Import Initial Data
Once the project is created:
1. Go to **Data > Import**.
2. Upload your well headers (\`.csv\`) and trajectories (\`.deviation\`).
3. Upload well logs (\`.las\`).

## Step 4: Save and Organize
- Projects are auto-saved to the cloud every 5 minutes.
- Use **File > Save Snapshot** to create a named restore point before major operations.
    `
  },
  {
    id: 'gs-detailed-5',
    title: 'Basic Workflow',
    category: 'Getting Started',
    difficulty: 'Beginner',
    lastUpdated: '2025-11-25',
    views: 1350,
    helpful: 410,
    tags: ['workflow', 'process', 'steps'],
    content: `
# Basic Modeling Workflow

A typical session in EarthModel Pro follows this linear progression:

## 1. Data QC
- Visualize imported wells in 3D.
- Check for "spikes" in logs using the **Log Histogram** tool.
- Ensure well tops align with seismic markers.

## 2. Structural Framework
- Pick faults on seismic sections.
- Interpolate horizons from well tops and seismic picks.
- **Validation:** Check for "negative thickness" (crossing horizons).

## 3. Gridding
- Define grid boundaries (AOI).
- Choose a layering scheme (e.g., Proportional, Parallel to Top).
- **Generate 3D Grid.**

## 4. Property Population
- **Upscale Logs:** Average well data into grid cells along the wellbore.
- **Data Analysis:** Create variograms to understand spatial continuity.
- **Simulation:** Run SGS (Sequential Gaussian Simulation) to populate porosity.

## 5. Volume Calculation
- Define a fluid contact (e.g., OWC).
- Calculate GRV, Pore Volume, and HCV.
- Export the report.
    `
  }
];