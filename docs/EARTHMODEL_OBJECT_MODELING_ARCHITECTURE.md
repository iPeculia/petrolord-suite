# Object Modeling Architecture

## Overview
The Object Modeling engine uses a hybrid client-server architecture. Lightweight geometry generation and previewing happen in the browser (Three.js), while heavy geostatistical operations (like conditioning to thousands of wells) would be offloaded to the backend.

## Components
*   **Frontend**:
    *   `ObjectModelingHub`: Main entry point.
    *   `ObjectViewer3D`: React Three Fiber canvas for visualization.
    *   `ObjectPlacementInterface`: State manager for object coordinates.
*   **Services**:
    *   `objectModelingService.js`: Handles CRUD operations for object definitions.
    *   `channelGeometry.js`: Math functions to generate channel vertices.
*   **Data**:
    *   Stored in `em_objects` table (Supabase).
    *   Geometry is serialized as JSON (GeoJSON or custom binary format for complex meshes).

## Data Flow
1.  User defines parameters (UI).
2.  Frontend generates a lightweight mesh preview.
3.  User places object.
4.  On "Save", parameters and transform matrix are sent to Supabase.
5.  On "Realize/Run", the backend (or heavy worker) rasterizes these vector objects into the 3D grid (voxelization).