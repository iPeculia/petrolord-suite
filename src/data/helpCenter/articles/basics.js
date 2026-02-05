export const basicArticles = [
  {
    id: 'gs-1',
    title: 'Welcome to EarthModel Pro',
    category: 'Getting Started',
    content: `
# Welcome to EarthModel Pro

EarthModel Pro is your comprehensive solution for advanced geoscience modeling. Whether you are characterizing a reservoir, planning a well, or analyzing seismic data, EarthModel Pro provides the tools you need in a unified, web-based environment.

## Key Features
- **Integrated 3D Modeling:** Seamlessly combine structural, stratigraphical, and petrophysical models.
- **Machine Learning:** Leverage AI for facies prediction and property distribution.
- **Real-time Collaboration:** Work with your team in real-time on the same project.
- **Cloud-Native:** Access your projects from anywhere, with heavy computation handled in the cloud.

## System Requirements
EarthModel Pro runs in modern web browsers. For the best experience:
- **Browser:** Chrome, Firefox, or Edge (latest versions)
- **Hardware:** GPU support for WebGL is recommended for 3D visualization.
- **Internet:** Stable broadband connection.

## Next Steps
Check out the **Installation and Setup** guide to get your environment ready, or jump straight into **Creating Your First Project**.
    `,
    tags: ['intro', 'overview', 'requirements'],
    difficulty: 'Beginner',
    lastUpdated: '2025-12-01'
  },
  {
    id: 'gs-2',
    title: 'Installation and Setup',
    category: 'Getting Started',
    content: `
# Installation and Setup

Since EarthModel Pro is a web application, "installation" primarily involves setting up your user account and ensuring your browser is compatible.

## Accessing the Platform
1. Navigate to the EarthModel Pro URL provided by your administrator.
2. Log in using your organization credentials.

## Browser Configuration
Ensure **Hardware Acceleration** is enabled in your browser settings. This is crucial for the 3D viewer.
- **Chrome:** Settings > System > "Use graphics acceleration when available"
- **Edge:** Settings > System and performance > "Use graphics acceleration when available"

## First Launch
Upon first login, you will be greeted by the Dashboard. We recommend taking the **interactive tour** to familiarize yourself with the layout.
    `,
    tags: ['setup', 'installation', 'browser'],
    difficulty: 'Beginner',
    lastUpdated: '2025-11-15'
  },
  {
    id: 'qs-1',
    title: '5-Minute Quick Start',
    category: 'Quick Start',
    content: `
# 5-Minute Quick Start Guide

Build a simple model in under 5 minutes.

## Step 1: Create Project
Click **New Project** on the dashboard. Select the "Blank Template" and name it "QuickStart Model".

## Step 2: Import Data
Go to **Data Management > Import**. Drag and drop the sample \`wells.csv\` file provided in the resources section. Map the columns (X, Y, Z, MD).

## Step 3: Create a Grid
Navigate to **Structural Modeling > Grid Builder**.
1. Select "Automatic Extents" based on your wells.
2. Set Nx=50, Ny=50, Nz=10.
3. Click **Generate**.

## Step 4: Visualize
Switch to the **3D Viewer** tab. Toggle the visibility of your new Grid and Wells. You should see them in 3D space.

## Step 5: Save
Click the **Save** icon in the top toolbar. You've just created your first static model!
    `,
    tags: ['quickstart', 'tutorial', 'first-project'],
    difficulty: 'Beginner',
    lastUpdated: '2025-12-05'
  }
];