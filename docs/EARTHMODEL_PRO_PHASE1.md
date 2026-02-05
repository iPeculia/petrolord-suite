# EarthModel Pro - Phase 1 Documentation

## Overview
EarthModel Pro is a comprehensive web-based geoscience modeling platform designed to streamline the workflow from data management to subsurface visualization. Phase 1 establishes the core architecture, data management capabilities, and fundamental modeling tools.

## Key Features (Phase 1)

### 1. Data Management
- **Project Organization**: Create and manage multiple modeling projects with CRS support.
- **Well Data**: Import and visualize well headers, trajectories, and logs.
- **Surface Data**: Support for point sets (XYZ) and surface grids.

### 2. Surface Modeling
- **Interpolation Engines**: Built-in support for Kriging, Minimum Curvature, and IDW algorithms.
- **Contouring**: Real-time contour generation and visualization.
- **Export**: Export generated surfaces to common formats.

### 3. 3D Grid Building
- **Corner Point Grids**: Definition and generation of corner-point geometry grids.
- **Fault Modeling**: Basic fault integration into the grid structure.
- **Quality Control**: Tools for checking cell volumes and geometry integrity.

### 4. Visualization
- **3D Viewer**: High-performance WebGL viewer based on Three.js/React-Three-Fiber.
- **2D Map View**: Interactive map based on Deck.gl/Mapbox.
- **Cross-Sections**: Vertical section generation through the model.

### 5. Volumetrics
- **Reserve Calculation**: Deterministic volume calculation (GRV, NRV, HCPV).
- **Reporting**: Automated generation of volumetric reports.

## Architecture
The platform is built using a modern React stack:
- **Frontend**: React 18, Vite, TailwindCSS
- **State Management**: React Context + Hooks
- **3D Graphics**: React Three Fiber (Three.js)
- **Mapping**: Deck.gl + MapLibre
- **Backend**: Supabase (PostgreSQL + PostGIS)

## Getting Started
1. Navigate to the **Geoscience Hub** (`/apps/geoscience/hub`).
2. Launch **EarthModel Pro**.
3. Create a new Project in the **Data Manager**.
4. Import sample data from the Help menu or use your own CSV files.
5. Switch to **Surface Modeling** to create your first horizon.

For detailed API usage, refer to `EARTHMODEL_API_REFERENCE.md`.