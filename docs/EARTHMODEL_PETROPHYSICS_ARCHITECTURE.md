# Petrophysics Architecture

## Overview
The Petrophysics module processes well log data. It relies heavily on array processing.

## Components
*   **Frontend**:
    *   `PetrophysicsHub`: Dashboard.
    *   `PetrophysicalCrossPlot`: Plotly.js based scatter plots.
    *   `PetrophysicalDepthProfile`: SVG/Canvas based log track viewer.
*   **Services**:
    *   `petrophysicsService.js`: Contains physics equations (Archie, Gassmann).
    *   `rockPhysicsService.js`: Specialized elastic calculations.
*   **Data**:
    *   Well logs stored in `em_well_logs` (arrays of floats).
    *   Analysis results stored in `em_petro_analyses`.

## Performance
*   **Array Buffers**: Log data is often handled as TypedArrays (`Float32Array`) for performance.
*   **Web Workers**: Heavy calculations (like running fluid substitution on 100 wells) are offloaded to web workers to keep the UI responsive.